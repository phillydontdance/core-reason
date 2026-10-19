import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { authMiddleware, requireRole } from './auth.js';
import {
  createSubscription,
  getCreatorDashboardSummary,
  subscriptions,
} from '../store.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'creator' | 'fan';
    name: string;
  };
}

const subscriptionsRouter = Router();

const createSubscriptionSchema = z.object({
  creatorId: z.string().min(1),
  monthlyPriceKsh: z.number().positive(),
});

subscriptionsRouter.post('/', authMiddleware, requireRole('fan'), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createSubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid subscription request', issues: parsed.error.issues });
  }

  const subscription = createSubscription(req.user!.id, parsed.data.creatorId, parsed.data.monthlyPriceKsh);
  return res.status(201).json({ subscription });
});

subscriptionsRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const items = subscriptions.filter((sub) => sub.fanId === req.user?.id || sub.creatorId === req.user?.id);
  return res.json({ subscriptions: items });
});

subscriptionsRouter.get('/creator/:creatorId', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const creatorId = Array.isArray(req.params.creatorId) ? req.params.creatorId[0] : req.params.creatorId;
  const items = subscriptions.filter((sub) => sub.creatorId === creatorId);
  return res.json({ subscriptions: items, count: items.length, summary: getCreatorDashboardSummary(creatorId) });
});

export { subscriptionsRouter };
