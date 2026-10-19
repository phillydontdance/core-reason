import type { User, UserRole } from '@fanhaven/shared';

export type StoredUser = User & {
  passwordHash: string;
};

export type CreatorProfileRecord = {
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
};

export type ContentRecord = {
  id: string;
  creatorId: string;
  kind: 'image' | 'video';
  title: string;
  description?: string;
  visibility: 'public' | 'paid';
  url: string;
  previewUrl?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  createdAt: string;
};

export type SubscriptionRecord = {
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
};

export type PaymentRecord = {
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
};

export const users: StoredUser[] = [];

export const creatorProfiles: CreatorProfileRecord[] = [
  {
    id: 'creator_1',
    userId: 'creator_1',
    username: 'niabcreative',
    displayName: 'Nia B.',
    bio: 'Lifestyle, behind-the-scenes stories, and honest creator life from Nairobi.',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80',
    monthlyPrice: 1500,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'creator_2',
    userId: 'creator_2',
    username: 'kairofm',
    displayName: 'Kairo',
    bio: 'Music, stories, and exclusive sessions for true fans.',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    monthlyPrice: 2200,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const contentItems: ContentRecord[] = [
  {
    id: 'content_1',
    creatorId: 'creator_1',
    kind: 'image',
    title: 'Behind the scenes',
    description: 'Public preview',
    visibility: 'public',
    url: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    fileName: 'behind-the-scenes.jpg',
    mimeType: 'image/jpeg',
    sizeBytes: 267000,
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
    url: 'https://www.w3schools.com/html/mov_bbb.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80',
    fileName: 'exclusive-live-session.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 4500000,
    durationSeconds: 184,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'content_3',
    creatorId: 'creator_2',
    kind: 'video',
    title: 'Member Q&A',
    description: 'Members only',
    visibility: 'paid',
    url: 'https://www.w3schools.com/html/movie.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80',
    fileName: 'member-qa.mp4',
    mimeType: 'video/mp4',
    sizeBytes: 2900000,
    durationSeconds: 145,
    createdAt: new Date().toISOString(),
  },
];

export const subscriptions: SubscriptionRecord[] = [
  {
    id: 'sub_1',
    creatorId: 'creator_1',
    fanId: 'fan_1',
    status: 'active',
    monthlyPriceKsh: 1500,
    currency: 'KES',
    startedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastPaymentAt: new Date().toISOString(),
    paymentProvider: 'mpesa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const payments: PaymentRecord[] = [];

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

export const findCreatorByUserId = (userId: string): CreatorProfileRecord | undefined => {
  return creatorProfiles.find((profile) => profile.userId === userId);
};

export const findCreatorByUsername = (username: string): CreatorProfileRecord | undefined => {
  return creatorProfiles.find((profile) => profile.username.toLowerCase() === username.toLowerCase());
};

export const upsertCreatorProfile = (userId: string, input: {
  username: string;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  monthlyPrice: number;
}) => {
  const existing = findCreatorByUserId(userId);
  const now = new Date().toISOString();

  if (existing) {
    existing.username = input.username;
    existing.displayName = input.displayName;
    existing.bio = input.bio;
    existing.avatarUrl = input.avatarUrl;
    existing.monthlyPrice = input.monthlyPrice;
    existing.updatedAt = now;
    return existing;
  }

  const profile: CreatorProfileRecord = {
    id: `creator_${Date.now()}`,
    userId,
    username: input.username,
    displayName: input.displayName,
    bio: input.bio,
    avatarUrl: input.avatarUrl,
    monthlyPrice: input.monthlyPrice,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  };

  creatorProfiles.push(profile);
  return profile;
};

export const hasActiveSubscription = (fanId: string, creatorId: string): boolean => {
  return subscriptions.some(
    (subscription) =>
      subscription.fanId === fanId &&
      subscription.creatorId === creatorId &&
      subscription.status === 'active' &&
      (!subscription.expiresAt || new Date(subscription.expiresAt) > new Date()),
  );
};

export const createSubscription = (fanId: string, creatorId: string, monthlyPriceKsh: number): SubscriptionRecord => {
  const existing = subscriptions.find(
    (subscription) =>
      subscription.fanId === fanId &&
      subscription.creatorId === creatorId &&
      (subscription.status === 'active' || subscription.status === 'pending'),
  );

  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const subscription: SubscriptionRecord = {
    id: `sub_${Date.now()}`,
    creatorId,
    fanId,
    status: 'active',
    monthlyPriceKsh,
    currency: 'KES',
    startedAt: now,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    lastPaymentAt: now,
    paymentProvider: 'mpesa',
    createdAt: now,
    updatedAt: now,
  };

  subscriptions.push(subscription);
  return subscription;
};

export const getCreatorDashboardSummary = (creatorId: string) => {
  const creatorSubs = subscriptions.filter((subscription) => subscription.creatorId === creatorId && subscription.status === 'active');
  const monthlyRevenueKsh = creatorSubs.reduce((sum, item) => sum + item.monthlyPriceKsh, 0);

  return {
    creatorId,
    subscriberCount: creatorSubs.length,
    monthlyRevenueKsh,
    activeSubscriptions: creatorSubs.length,
  };
};

export const listPublicContent = () => contentItems.filter((content) => content.visibility === 'public');

export const listCreatorContent = (creatorId: string) => contentItems.filter((content) => content.creatorId === creatorId);

export const findContentById = (contentId: string) => contentItems.find((content) => content.id === contentId);

export const addContentRecord = (input: Omit<ContentRecord, 'createdAt'>) => {
  const now = new Date().toISOString();
  const record: ContentRecord = {
    ...input,
    createdAt: now,
  };
  contentItems.push(record);
  return record;
};

export const updatePaymentStatus = (checkoutRequestId: string, status: PaymentRecord['status'], extras?: Partial<PaymentRecord>) => {
  const payment = payments.find((entry) => entry.checkoutRequestId === checkoutRequestId || entry.merchantRequestId === checkoutRequestId);
  if (!payment) return undefined;

  payment.status = status;
  payment.updatedAt = new Date().toISOString();
  if (extras) {
    Object.assign(payment, extras);
  }

  return payment;
};
