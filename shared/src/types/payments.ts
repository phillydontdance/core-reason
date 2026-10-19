export type PaymentStatus = 'initiated' | 'pending' | 'paid' | 'failed' | 'expired';

export interface MpesaPaymentRequest {
  phoneNumber: string;
  amountKsh: number;
  creatorId: string;
  fanId: string;
  reference: string;
}

export interface MpesaCallbackPayload {
  Body: {
    stkCallback: {
      MerchantRequestID: string;
      CheckoutRequestID: string;
      ResultCode: number;
      ResultDesc: string;
      CallbackMetadata?: {
        Item?: Array<{
          Name: string;
          Value: string | number;
        }>;
      };
    };
  };
}

export interface PaymentTransaction {
  id: string;
  subscriptionId?: string;
  creatorId: string;
  fanId: string;
  amountKsh: number;
  currency: 'KES';
  provider: 'mpesa';
  status: PaymentStatus;
  merchantRequestId?: string;
  checkoutRequestId?: string;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  callbackData?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface DarajaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortCode: string;
  initiatorName: string;
  securityCredential: string;
  callbackUrl: string;
  passkey: string;
  environment: 'sandbox' | 'production';
}
