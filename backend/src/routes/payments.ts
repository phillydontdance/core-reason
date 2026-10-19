import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { authMiddleware, requireRole } from './auth.js';
import { findCreatorByUserId, getCreatorDashboardSummary, payments, updatePaymentStatus } from '../store.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'creator' | 'fan';
    name: string;
  };
}

const paymentsRouter = Router();

const mpesaInitSchema = z.object({
  phoneNumber: z.string().min(9),
  creatorId: z.string().min(1),
  amountKsh: z.number().positive(),
  reference: z.string().optional(),
});

const callbackSchema = z.object({
  Body: z.object({
    stkCallback: z.object({
      MerchantRequestID: z.string(),
      CheckoutRequestID: z.string(),
      ResultCode: z.number(),
      ResultDesc: z.string(),
      CallbackMetadata: z.object({
        Item: z.array(z.object({ Name: z.string(), Value: z.union([z.string(), z.number()]) })).optional(),
      }).optional(),
    }),
  }),
});

paymentsRouter.post('/mpesa-initiate', authMiddleware, requireRole('fan'), async (req: AuthenticatedRequest, res: Response) => {
  const parsed = mpesaInitSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid STK request', issues: parsed.error.issues });
  }

  const creatorProfile = findCreatorByUserId(parsed.data.creatorId);
  if (!creatorProfile) {
    return res.status(404).json({ message: 'Creator not found' });
  }

  const existing = payments.find((entry) => entry.fanId === req.user!.id && entry.creatorId === parsed.data.creatorId && entry.status === 'initiated');
  const payment = existing ?? {
    id: randomUUID(),
    creatorId: parsed.data.creatorId,
    fanId: req.user!.id,
    amountKsh: parsed.data.amountKsh,
    currency: 'KES',
    provider: 'mpesa',
    status: 'initiated',
    merchantRequestId: `MR-${Date.now()}`,
    checkoutRequestId: `CR-${Date.now()}`,
    phoneNumber: parsed.data.phoneNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as typeof payments[number];

  if (!existing) {
    payments.push(payment);
  }

  return res.status(202).json({
    message: 'STK push initiated',
    payment,
    darajaRequestId: payment.checkoutRequestId,
    creatorSummary: getCreatorDashboardSummary(parsed.data.creatorId),
  });
});

paymentsRouter.post('/daraja-callback', async (req: Request, res: Response) => {
  const parsed = callbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid Daraja callback payload', issues: parsed.error.issues });
  }

  const callback = parsed.data.Body.stkCallback;

  const metadata = callback.CallbackMetadata?.Item ?? [];
  const amountItem = metadata.find((item) => item.Name === 'Amount');
  const mpesaReceiptNumber = metadata.find((item) => item.Name === 'MpesaReceiptNumber');

  const payment = updatePaymentStatus(callback.CheckoutRequestID, callback.ResultCode === 0 ? 'paid' : 'failed', {
    merchantRequestId: callback.MerchantRequestID,
    callbackData: { ResultCode: callback.ResultCode, ResultDesc: callback.ResultDesc, metadata },
    mpesaReceiptNumber: (mpesaReceiptNumber?.Value as string | undefined) ?? undefined,
    amountKsh: typeof amountItem?.Value === 'number' ? amountItem.Value : Number(amountItem?.Value ?? 0),
  });

  if (callback.ResultCode !== 0) {
    return res.json({ ResultCode: 1032, ResultDesc: 'Failed to complete payment', payment });
  }

  return res.json({
    ResultCode: 0,
    ResultDesc: 'Accepted',
    amount: amountItem?.Value ?? null,
    receipt: mpesaReceiptNumber?.Value ?? null,
    payment,
  });
});

paymentsRouter.get('/me', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  const items = payments.filter((payment) => payment.fanId === req.user!.id || payment.creatorId === req.user!.id);
  return res.json({ payments: items });
});

export { paymentsRouter };
