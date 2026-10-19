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

const subscriptionsRouter = Router();

const createSubscriptionSchema = z.object({
  creatorId: z.string().min(1),
  monthlyPriceKsh: z.number().positive(),
});

const subscriptions = [
  {
    id: 'sub_1',
    creatorId: 'creator_1',
    fanId: 'fan_1',
    status: 'active',
    monthlyPriceKsh: 1500,
    currency: 'KES',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    paymentProvider: 'mpesa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

subscriptionsRouter.post('/', authMiddleware, requireRole('fan'), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = createSubscriptionSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid subscription request', issues: parsed.error.issues });
  }

  const subscription = {
    id: randomUUID(),
    creatorId: parsed.data.creatorId,
    fanId: req.user?.id,
    status: 'pending',
    monthlyPriceKsh: parsed.data.monthlyPriceKsh,
    currency: 'KES',
    paymentProvider: 'mpesa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  subscriptions.push(subscription as any);
  return res.status(201).json({ subscription });
});

subscriptionsRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const items = subscriptions.filter((sub) => sub.fanId === req.user?.id || sub.creatorId === req.user?.id);
  return res.json({ subscriptions: items });
});

subscriptionsRouter.get('/creator/:creatorId', authMiddleware, requireRole('creator'), async (req: AuthenticatedRequest, res: Response) => {
  const items = subscriptions.filter((sub) => sub.creatorId === req.params.creatorId);
  return res.json({ subscriptions: items, count: items.length });
});

export { subscriptionsRouter };
