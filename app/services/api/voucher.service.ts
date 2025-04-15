import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface IVoucher {
  id: number;
  title: string;
  description: string;
  code: string;
  amount: number;
  discountType: string;
  voucherType: string;
  freeShipping: boolean;
  usageLimit: number;
  usageLimitPerUser: number;
  minimumAmount: number;
  maximumReduction?: any;
  productBrands: any[];
  excludeProductBrands: any[];
  allowedUsers: any[];
  usedCount: number;
  isIndividualUsage: boolean;
  expiryDate: string;
  isAvailable: boolean;
}

export interface IVoucherRequest extends PaginationRequests {
  search?: string;
  shopId?: number;
  voucherType?: "shipping" | "product";
}

class VoucherService {
  async getVouchers(data: IVoucherRequest) {
    return typedAxios.get<PaginatedResponse<IVoucher>>("/vouchers", {
      params: data,
    });
  }

  async getVoucherById(id: string) {
    return typedAxios.get<IVoucher>(`/vouchers/${id}`);
  }

  async getVouchersByUserId(userId: string) {
    return typedAxios.get<IVoucher[]>(`/vouchers/my-vouchers`);
  }

  async getAvailableVouchers() {
    return typedAxios.get<IVoucher[]>(`/vouchers/available`);
  }

  async applyVoucher(voucherId: string) {
    return typedAxios.get<IVoucher>(`/cart/apply-voucher/${voucherId}`);
  }

  async removeVoucher(voucherId: string) {
    return typedAxios.delete(`/cart/remove-voucher/${voucherId}`);
  }
}

export const voucherService = new VoucherService();
