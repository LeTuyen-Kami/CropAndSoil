export interface Token {
  accessToken: string;
  accessTokenExpiresIn?: string;
  refreshToken: string;
  refreshTokenExpiresIn?: string;
}
export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface PaginationRequests {
  skip: number;
  take: number;
  search?: string;
}

export interface PaginatedResponse<T> {
  skip: number;
  take: number;
  total: number;
  data: T[];
}

export interface Environment {
  EXPO_PUBLIC_BASE_URL: string;
  EXPO_PUBLIC_IDENTITY_BASE_URL: string;
}
