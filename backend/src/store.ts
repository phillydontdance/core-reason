import type { User, UserRole } from '@fanhaven/shared';

export type StoredUser = User & {
  passwordHash: string;
};

export const users: StoredUser[] = [];
export const creatorProfiles: Array<{
  id: string;
  userId: string;
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  monthlyPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}> = [];

export const subscriptions: Array<{
  id: string;
  creatorId: string;
  fanId: string;
  status: 'pending' | 'active' | 'cancelled' | 'expired';
  monthlyPriceKsh: number;
  currency: 'KES';
  startedAt?: string;
  expiresAt?: string;
  lastPaymentAt?: string;
  paymentProvider: 'mpesa';
  createdAt: string;
  updatedAt: string;
}> = [];

export const payments: Array<{
  id: string;
  subscriptionId?: string;
  creatorId: string;
  fanId: string;
  amountKsh: number;
  currency: 'KES';
  provider: 'mpesa';
  status: 'initiated' | 'pending' | 'paid' | 'failed' | 'expired';
  merchantRequestId?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  callbackData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}> = [];

export const createUser = (input: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  passwordHash: string;
}): StoredUser => {
  const user: StoredUser = {
    id: input.id,
    email: input.email,
    name: input.name,
    role: input.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    passwordHash: input.passwordHash,
  };

  users.push(user);
  return user;
};

export const findUserByEmail = (email: string): StoredUser | undefined => {
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase());
};

export const findUserById = (userId: string): StoredUser | undefined => {
  return users.find((user) => user.id === userId);
};
