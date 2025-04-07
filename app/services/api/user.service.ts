import { axiosInstance } from "../base";

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatar?: string;
  phone?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  fullName?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

class UserService {
  async getCurrentUser() {
    return axiosInstance.get<User>("/users/me").then((res) => res?.data);
  }

  async updateProfile(payload: UpdateUserPayload) {
    return axiosInstance
      .patch<User>("/users/me", payload)
      .then((res) => res?.data);
  }

  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    return axiosInstance.post("/users/change-password", {
      oldPassword,
      newPassword,
    });
  }
}

export const userService = new UserService();
