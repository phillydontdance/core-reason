import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole } from './auth.js';
import { creatorProfiles, findCreatorByUserId, upsertCreatorProfile } from '../store.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'creator' | 'fan';
    name: string;
  };
}

const profileRouter = Router();

const profileSchema = z.object({
  username: z.string().min(3),
  displayName: z.string().min(2),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  monthlyPrice: z.number().positive(),
});

profileRouter.get('/public/:username', async (req: Request, res: Response) => {
  const profile = creatorProfiles.find((item) => item.username === req.params.username);
  if (!profile) {
    return res.status(404).json({ message: 'Creator profile not found' });
  }

  return res.json({ profile });
});

profileRouter.get('/me', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const profile = findCreatorByUserId(req.user!.id);
  return res.json({ profile: profile ?? null });
});

profileRouter.post('/me', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = profileSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid profile payload', issues: parsed.error.issues });
  }

  const profile = upsertCreatorProfile(req.user!.id, parsed.data);
  return res.status(201).json({ profile });
});

export { profileRouter };
