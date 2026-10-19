export interface FeedItem {
  id: string;
  creatorId: string;
  creatorName: string;
  title: string;
  contentType: 'image' | 'video';
  previewUrl?: string;
  publicUrl?: string;
  isPaid: boolean;
  isUnlocked: boolean;
}

export interface CreatorOnboardingState {
  profileComplete: boolean;
  payoutConfigured: boolean;
  firstUploadDone: boolean;
}
