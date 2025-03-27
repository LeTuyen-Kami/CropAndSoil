import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import { MMKV } from "react-native-mmkv";
import { User } from "../types";

// Initialize MMKV
const storage = new MMKV({
  id: "auth-storage",
  encryptionKey: "auth-secret-key",
});

// Create MMKV storage adapter for Jotai
const mmkvStorage = createJSONStorage<any>(() => ({
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value ? JSON.parse(value) : null;
  },
  setItem: (key: string, value: unknown) => {
    storage.set(key, JSON.stringify(value));
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
}));

// Auth Atoms
export const atomAccessToken = atomWithStorage<string | null>(
  "accessToken",
  null,
  mmkvStorage
);
export const atomRefreshToken = atomWithStorage<string | null>(
  "refreshToken",
  null,
  mmkvStorage
);
export const atomUser = atomWithStorage<User | null>("user", null, mmkvStorage);
export const atomIsAuthenticated = atom((get) => !!get(atomAccessToken));

// Auth Hook
export const useAuth = () => {
  const [accessToken, setAccessToken] = atom(atomAccessToken);
  const [refreshToken, setRefreshToken] = atom(atomRefreshToken);
  const [user, setUser] = atom(atomUser);
  const [isAuthenticated] = atom(atomIsAuthenticated);

  const setTokens = (access: string, refresh: string) => {
    setAccessToken(access);
    setRefreshToken(refresh);
  };

  const clearTokens = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    setTokens,
    setUser,
    clearTokens,
  };
};
