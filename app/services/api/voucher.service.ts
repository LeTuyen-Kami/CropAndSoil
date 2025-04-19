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
  isAvailable?: boolean;
  productIds?: string; //comma separated
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

  async getMyVouchers(params: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<IVoucher>>(
      `/vouchers/my-vouchers`,
      {
        params,
      }
    );
  }

  async getAvailableVouchers(params: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<IVoucher>>(`/vouchers/available`, {
      params,
    });
  }

  async applyVoucher(code: string) {
    return typedAxios.post<IVoucher>(`/cart/apply-voucher`, {
      code,
    });
  }

  async findByCode(code: string) {
    return typedAxios.get<IVoucher>(`/vouchers/find-by-code`, {
      params: {
        code,
      },
    });
  }

  async removeVoucher(code: string) {
    return typedAxios.delete(`/cart/remove-voucher`, {
      data: {
        code,
      },
    });
  }
}

export const voucherService = new VoucherService();
