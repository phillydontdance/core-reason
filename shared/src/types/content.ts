export type MediaKind = 'image' | 'video';

export type ContentVisibility = 'public' | 'paid';

export interface CreatorProfile {
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
}

export interface ContentAsset {
  id: string;
  creatorId: string;
  kind: MediaKind;
  title: string;
  description?: string;
  visibility: ContentVisibility;
  url: string;
  previewUrl?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  createdAt: string;
}

export interface ContentAccess {
  contentId: string;
  userId: string;
  grantedAt: string;
}

export interface UploadUrlRequest {
  kind: MediaKind;
  fileName: string;
  mimeType: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  objectKey: string;
  publicUrl?: string;
}
