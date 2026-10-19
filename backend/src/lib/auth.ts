import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { User, UserRole } from '@fanhaven/shared';
import { config } from '../config.js';

export const hashPassword = async (plain: string): Promise<string> => {
  return bcrypt.hash(plain, 10);
};

export const verifyPassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};

export const signToken = (user: Pick<User, 'id' | 'role'>): string => {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      type: 'access',
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] },
  );
};

export const getUserRole = (role: string): UserRole => {
  if (role === 'creator' || role === 'fan') {
    return role;
  }

  throw new Error('Invalid user role');
};

export const verifyToken = (token: string): { sub: string; role: UserRole } => {
  const decoded = jwt.verify(token, config.jwtSecret) as {
    sub: string;
    role: UserRole;
  };

  return {
    sub: decoded.sub,
    role: decoded.role,
  };
};
