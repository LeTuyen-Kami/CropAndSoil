export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
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
