import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { authMiddleware, requireRole } from './auth.js';

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

const creatorContent = [
  {
    id: 'content_1',
    creatorId: 'creator_1',
    kind: 'image',
    title: 'Behind the scenes',
    description: 'Public preview',
    visibility: 'public',
    url: 'https://cdn.example.com/public/demo-1.jpg',
    fileName: 'demo-1.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 267_000,
    width: 1200,
    height: 800,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'content_2',
    creatorId: 'creator_1',
    kind: 'video',
    title: 'Exclusive live session',
    description: 'Subscribers only',
    visibility: 'paid',
    url: 'https://cdn.example.com/private/session.mp4',
    fileName: 'session.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 4_500_000,
    durationSeconds: 184,
    createdAt: new Date().toISOString(),
  },
];

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

  const asset = {
    id: randomUUID(),
    creatorId: req.user?.id,
    ...payload.data,
    url: `https://cdn.example.com/${payload.data.objectKey}`,
    previewUrl: payload.data.kind === 'video' ? `https://cdn.example.com/previews/${payload.data.objectKey}.jpg` : undefined,
    createdAt: new Date().toISOString(),
  };

  creatorContent.push(asset as any);
  return res.status(201).json({ asset });
});

contentRouter.get('/public', async (_req: Request, res: Response) => {
  return res.json({ items: creatorContent.filter((item) => item.visibility === 'public') });
});

contentRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const items = creatorContent.filter((item) => item.creatorId === req.user?.id);
  return res.json({ items });
});

contentRouter.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const item = creatorContent.find((content) => content.id === req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Content not found' });
  }

  if (item.visibility === 'public') {
    return res.json({ item, access: 'public' });
  }

  const hasSubscription = true;
  if (!hasSubscription) {
    return res.status(403).json({ message: 'Subscription required to view this content' });
  }

  return res.json({ item, access: 'paid' });
});

export { contentRouter };
