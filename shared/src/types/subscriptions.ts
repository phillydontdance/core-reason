export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'expired';

export interface SubscriptionTier {
  id: string;
  creatorId: string;
  name: string;
  priceKsh: number;
  currency: 'KES';
  isDefault: boolean;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  creatorId: string;
  fanId: string;
  status: SubscriptionStatus;
  monthlyPriceKsh: number;
  currency: 'KES';
  startedAt?: string;
  expiresAt?: string;
  lastPaymentAt?: string;
  paymentProvider: 'mpesa';
  createdAt: string;
  updatedAt: string;
}

export interface CreatorDashboardSummary {
  creatorId: string;
  subscriberCount: number;
  monthlyRevenueKsh: number;
  activeSubscriptions: number;
}
