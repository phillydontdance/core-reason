export type UserRole = 'creator' | 'fan';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  userId: string;
  role: UserRole;
  token: string;
  expiresAt: string;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
