import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { authRouter } from './routes/auth.js';
import { contentRouter } from './routes/content.js';
import { paymentsRouter } from './routes/payments.js';
import { subscriptionsRouter } from './routes/subscriptions.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'fanhaven-backend' });
});

app.use('/api/auth', authRouter);
app.use('/api/content', contentRouter);
app.use('/api/subscriptions', subscriptionsRouter);
app.use('/api/payments', paymentsRouter);

app.listen(config.port, () => {
  console.log(`Fanhaven API listening on http://localhost:${config.port}`);
});

export default app;
