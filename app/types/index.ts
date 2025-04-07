export interface Token {
  accessToken: string;
  accessTokenExpiresIn: string;
  refreshToken: string;
  refreshTokenExpiresIn: string;
}

export interface User {
  accountType: string;
  avatarUrl?: any;
  birthday?: any;
  createdAt: string;
  email: string;
  gender?: any;
  id: string;
  name: string;
  phone: string;
  taxCertificateUrl?: any;
  taxNumber?: any;
  updatedAt: string;
  wooId: number;
}
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface Environment {
  EXPO_PUBLIC_BASE_URL: string;
  EXPO_PUBLIC_IDENTITY_BASE_URL: string;
}
