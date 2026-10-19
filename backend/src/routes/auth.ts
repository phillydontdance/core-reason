import { Router, type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { getUserRole, hashPassword, signToken, verifyPassword } from '../lib/auth.js';
import { createUser, findUserByEmail, findUserById } from '../store.js';

interface AuthenticatedUser {
  id: string;
  email: string;
  role: 'creator' | 'fan';
  name: string;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const authRouter = Router();

const signUpSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['creator', 'fan']),
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const jwt = await import('../lib/auth.js');
    const payload = jwt.verifyToken(token);
    const user = findUserById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Invalid session' });
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

const requireRole = (role: 'creator' | 'fan') => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: `Requires ${role} role` });
    }
    next();
  };
};

authRouter.post('/signup', async (req, res) => {
  const parsed = signUpSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid signup payload', issues: parsed.error.issues });
  }

  const existingUser = findUserByEmail(parsed.data.email);
  if (existingUser) {
    return res.status(409).json({ message: 'User already exists' });
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = createUser({
    id: randomUUID(),
    email: parsed.data.email,
    name: parsed.data.name,
    role: getUserRole(parsed.data.role),
    passwordHash,
  });

  const token = signToken({ id: user.id, role: user.role });

  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  });
});

authRouter.post('/signin', async (req, res) => {
  const parsed = signInSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: 'Invalid signin payload', issues: parsed.error.issues });
  }

  const user = findUserByEmail(parsed.data.email);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const valid = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = signToken({ id: user.id, role: user.role });

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
  });
});

authRouter.get('/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

export { authRouter, authMiddleware, requireRole };
