import { identityAxiosInstance, typedAxios } from "../base";

export interface LoginPayload {
  phone: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterSendOtpPayload {
  flow: "REGISTER";
  phone: string;
}

export interface RegisterVerifyOtpPayload {
  flow: "REGISTER";
  phone: string;
  transactionId: string;
  otp: string;
  password?: string;
  deviceToken?: string;
}

export interface SendSmsOtpResponse {
  transactionId: string;
  createdAt: string;
  retryAfter: number;
}

export interface Token {
  refreshToken: string;
  refreshTokenExpiresIn: string;
  accessToken: string;
  accessTokenExpiresIn: string;
}

export interface AuthResponse {
  id: string;
  wooId: number;
  phone: string;
  name: string;
  email: string;
  gender?: any;
  avatarUrl?: any;
  birthday?: any;
  taxNumber?: any;
  taxCertificateUrl?: any;
  accountType: string;
  createdAt: string;
  updatedAt: string;
  token: Token;
}

class AuthService {
  async login(payload: LoginPayload) {
    return identityAxiosInstance
      .post<AuthResponse>("/auth/login", payload)
      .then((res) => res.data);
  }

  async registerSendOtp(payload: RegisterSendOtpPayload) {
    return identityAxiosInstance
      .post<SendSmsOtpResponse>("/auth/send-sms-otp", payload)
      .then((res) => res.data);
  }

  async registerVerifyOtp(payload: RegisterVerifyOtpPayload) {
    return identityAxiosInstance
      .post<AuthResponse>("/auth/verify-sms-otp", payload)
      .then((res) => res.data);
  }

  async logout() {
    return typedAxios.post("/auth/logout");
  }

  async refreshToken() {
    return identityAxiosInstance
      .post<{ token: string }>("/auth/refresh-token")
      .then((res) => res.data);
  }
}

export const authService = new AuthService();
