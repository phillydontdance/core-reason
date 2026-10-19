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

const paymentsRouter = Router();

const mpesaInitSchema = z.object({
  phoneNumber: z.string().min(9),
  creatorId: z.string().min(1),
  amountKsh: z.number().positive(),
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

  const payment = {
    id: randomUUID(),
    creatorId: parsed.data.creatorId,
    fanId: req.user?.id,
    amountKsh: parsed.data.amountKsh,
    currency: 'KES',
    provider: 'mpesa',
    status: 'initiated',
    merchantRequestId: `MR-${Date.now()}`,
    checkoutRequestId: `CR-${Date.now()}`,
    phoneNumber: parsed.data.phoneNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return res.status(202).json({
    message: 'STK push initiated',
    payment,
    darajaRequestId: payment.checkoutRequestId,
  });
});

paymentsRouter.post('/daraja-callback', async (req: Request, res: Response) => {
  const parsed = callbackSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid Daraja callback payload', issues: parsed.error.issues });
  }

  const callback = parsed.data.Body.stkCallback;

  if (callback.ResultCode !== 0) {
    return res.json({ ResultCode: 1032, ResultDesc: 'Failed to complete payment' });
  }

  const metadata = callback.CallbackMetadata?.Item ?? [];
  const amountItem = metadata.find((item) => item.Name === 'Amount');
  const mpesaReceiptNumber = metadata.find((item) => item.Name === 'MpesaReceiptNumber');

  return res.json({
    ResultCode: 0,
    ResultDesc: 'Accepted',
    amount: amountItem?.Value ?? null,
    receipt: mpesaReceiptNumber?.Value ?? null,
  });
});

export { paymentsRouter };
