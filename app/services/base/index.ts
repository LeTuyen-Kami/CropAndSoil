import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { Platform } from "react-native";
import { authAtom } from "~/store/atoms";
import { jotaiStore } from "~/store/store";
import { ENV, getDeviceId } from "~/utils";

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// const BASE_URL = ENV.EXPO_PUBLIC_BASE_URL;
const BASE_URL = "https://cropee-api.faster.asia/api/v1";
const IDENTITY_BASE_URL = "https://cropee-api.faster.asia/api/v1";
// const IDENTITY_BASE_URL = ENV.EXPO_PUBLIC_IDENTITY_BASE_URL;

export const identityAxiosInstance = axios.create({
  baseURL: IDENTITY_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "device-id": getDeviceId(),
    "platform-os-type": Platform.OS,
  },
});

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "device-id": getDeviceId(),
    "platform-os-type": Platform.OS,
  },
});

// Create a separate instance for refresh token requests
const identityInstance = axios.create({
  baseURL: IDENTITY_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

// Function to refresh token
const refreshTokenFn = async () => {
  const auth = jotaiStore.get(authAtom);
  try {
    const refreshToken = auth.token?.refreshToken;

    if (!refreshToken) throw new Error("No refresh token");

    const response = await identityInstance.post(
      "/auth/extend",
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken}`,
          "device-id": getDeviceId(),
          "platform-os-type": Platform.OS,
        },
      }
    );

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    jotaiStore.set(authAtom, {
      ...auth,
      token: {
        ...auth.token,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      },
    });

    return newAccessToken;
  } catch (error) {
    jotaiStore.set(authAtom, {
      ...auth,
      accessToken: null,
      refreshToken: null,
    });
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = jotaiStore.get(authAtom).token?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse<any>) => response.data,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosConfig;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refreshing, wait and retry original request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const newAccessToken = await refreshTokenFn();
        processQueue();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const typedAxios = axiosInstance as {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
};
