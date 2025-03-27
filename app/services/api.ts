import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { atomAccessToken, atomRefreshToken } from "../store/useStore";
import { getDefaultStore } from "jotai";
import { ENV } from "~/utils";

interface CustomAxiosConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const BASE_URL = ENV.EXPO_PUBLIC_BASE_URL;
const IDENTITY_BASE_URL = ENV.EXPO_PUBLIC_IDENTITY_BASE_URL;

// Create axios instance
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
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
  try {
    const store = getDefaultStore();
    const refreshToken = store.get(atomRefreshToken);

    if (!refreshToken) throw new Error("No refresh token");

    const response = await identityInstance.post("/auth/refresh", {
      refreshToken,
    });

    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      response.data;

    store.set(atomAccessToken, newAccessToken);
    store.set(atomRefreshToken, newRefreshToken);

    return newAccessToken;
  } catch (error) {
    const store = getDefaultStore();
    store.set(atomAccessToken, null);
    store.set(atomRefreshToken, null);
    throw error;
  }
};

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const store = getDefaultStore();
    const token = store.get(atomAccessToken);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
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
