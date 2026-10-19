import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { authMiddleware, requireRole } from './auth.js';
import {
  addContentRecord,
  findContentById,
  findCreatorByUserId,
  getCreatorDashboardSummary,
  hasActiveSubscription,
  listCreatorContent,
  listPublicContent,
} from '../store.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'creator' | 'fan';
    name: string;
  };
}

const contentRouter = Router();

const uploadUrlSchema = z.object({
  kind: z.enum(['image', 'video']),
  fileName: z.string().min(1),
  mimeType: z.string().min(1),
});

contentRouter.post('/upload-url', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = uploadUrlSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid upload request', issues: parsed.error.issues });
  }

  const objectKey = `creators/${req.user?.id}/${randomUUID()}-${parsed.data.fileName}`;
  const uploadUrl = `https://example-r2-bucket.example.com/${objectKey}?signed=true`;

  return res.status(201).json({
    uploadUrl,
    objectKey,
    publicUrl: `https://cdn.example.com/${objectKey}`,
  });
});

contentRouter.post('/confirm', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const payload = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    kind: z.enum(['image', 'video']),
    visibility: z.enum(['public', 'paid']),
    objectKey: z.string().min(1),
    mimeType: z.string().min(1),
    sizeBytes: z.number().positive(),
    durationSeconds: z.number().optional(),
  }).safeParse(req.body);

  if (!payload.success) {
    return res.status(400).json({ message: 'Invalid media metadata', issues: payload.error.issues });
  }

  const creatorProfile = findCreatorByUserId(req.user!.id);
  if (!creatorProfile) {
    return res.status(400).json({ message: 'Create a creator profile before uploading content' });
  }

  const asset = addContentRecord({
    id: randomUUID(),
    creatorId: req.user!.id,
    kind: payload.data.kind,
    title: payload.data.title,
    description: payload.data.description,
    visibility: payload.data.visibility,
    url: `https://cdn.example.com/${payload.data.objectKey}`,
    previewUrl: payload.data.kind === 'video' ? `https://cdn.example.com/previews/${payload.data.objectKey}.jpg` : undefined,
    fileName: payload.data.objectKey,
    mimeType: payload.data.mimeType,
    sizeBytes: payload.data.sizeBytes,
    durationSeconds: payload.data.durationSeconds,
  });

  return res.status(201).json({ asset });
});

contentRouter.get('/public', async (_req: Request, res: Response) => {
  return res.json({ items: listPublicContent() });
});

contentRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const items = listCreatorContent(req.user!.id);
  return res.json({ items });
});

contentRouter.get('/dashboard', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const summary = getCreatorDashboardSummary(req.user!.id);
  return res.json({ summary });
});

contentRouter.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const contentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const item = findContentById(contentId);
  if (!item) {
    return res.status(404).json({ message: 'Content not found' });
  }

  if (item.visibility === 'public') {
    return res.json({ item, access: 'public' });
  }

  const hasAccess = hasActiveSubscription(req.user?.id ?? '', item.creatorId);
  if (!req.user || !hasAccess) {
    return res.status(403).json({ message: 'Subscription required to view this content' });
  }

  return res.json({ item, access: 'paid' });
});

export { contentRouter };
