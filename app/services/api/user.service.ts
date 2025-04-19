import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
export interface User {
  id: string;
  wooId: number;
  phone: string;
  name: string;
  email: string;
  gender: string;
  avatarUrl: string;
  birthday: string;
  taxNumber: string;
  taxCertificateUrl: string;
  accountType: string;
  totalFollowing: number;
  totalFollowers: number;
  isApproved: boolean;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserPayload {
  name?: string;
  phone?: string;
  email?: string;
  gender?: string;
  birthday?: string;
  taxNumber?: string;
  avatarFile?: {
    uri: string;
    type: string;
    name: string;
  };
  taxCertificateFile?: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface ChangePasswordPayload {
  password: string;
}

export interface ChangeDeviceTokenPayload {
  deviceToken: string;
}

export interface Ward {
  id: string;
  name: string;
  type: string;
  districtId: string;
}

export interface District {
  id: string;
  name: string;
  type: string;
  provinceId: string;
}

export interface Province {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface IAddress {
  id: number;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
  addressLine: string;
  ward: Partial<Ward>;
  district: Partial<District>;
  province: Partial<Province>;
  addressType: string;
}
class UserService {
  async getProfile() {
    return typedAxios.get<User>("/account/profile");
  }

  async updateProfile(payload: UpdateUserPayload) {
    const formData = new FormData();
    payload.name && formData.append("name", payload.name);
    payload.phone && formData.append("phone", payload.phone);
    payload.email && formData.append("email", payload.email);
    payload.gender && formData.append("gender", payload.gender);
    payload.birthday && formData.append("birthday", payload.birthday);
    payload.taxNumber && formData.append("taxNumber", payload.taxNumber);
    if (payload.avatarFile) {
      formData.append("avatarFile", {
        uri: payload.avatarFile.uri,
        type: payload.avatarFile.type,
        name: payload.avatarFile.name,
      } as any);
    }
    if (payload.taxCertificateFile) {
      formData.append("taxCertificateFile", {
        uri: payload.taxCertificateFile.uri,
        type: payload.taxCertificateFile.type,
        name: payload.taxCertificateFile.name,
      } as any);
    }
    return typedAxios.put<User>("/account/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async changePassword(payload: ChangePasswordPayload) {
    return typedAxios.put<{
      code: string;
      message: string;
    }>("/account/change-password", payload);
  }

  async changeDeviceToken(payload: ChangeDeviceTokenPayload) {
    return typedAxios.put<{
      code: string;
      message: string;
    }>("/account/change-device-token", payload);
  }

  async getAddress(payload: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<IAddress>>("/account/addresses", {
      params: payload,
    });
  }

  async addAddress(payload: IAddress) {
    return typedAxios.post<IAddress>("/account/addresses", payload);
  }

  async updateAddress(payload: IAddress) {
    return typedAxios.put<IAddress>(
      `/account/addresses/${payload.id}`,
      payload
    );
  }

  async deleteAddress(wooId: number) {
    return typedAxios.delete<{
      code: string;
      message: string;
    }>(`/account/addresses/${wooId}`);
  }
}

export const userService = new UserService();
