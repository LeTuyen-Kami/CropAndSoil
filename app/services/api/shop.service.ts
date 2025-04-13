import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface Province {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface District {
  id: string;
  name: string;
  type: string;
  provinceId: string;
}

export interface Ward {
  id: string;
  name: string;
  type: string;
  districtId: string;
}

export interface ShopWarehouseLocation {
  province: Province;
  district: District;
  ward: Ward;
  addressLine: string;
}

export interface IShop {
  id: number;
  shopName: string;
  shopLogoUrl: string;
  shopCoverUrl: string;
  shopRating: number;
  isOfficial: boolean;
  totalProducts: number;
  totalReviews: number;
  totalFollowers: number;
  lastOnlineAt: string;
  createdAt: string;
  replyRate: string;
  replyIn: string;
  shopWarehouseLocation: ShopWarehouseLocation;
}

export interface IListShopRequest extends PaginationRequests {
  ids?: string[];
}

class ShopService {
  async getShopDetail(id: string | number) {
    return typedAxios.get<IShop>(`/shops/${id}`);
  }

  async getListShop(params: IListShopRequest) {
    return typedAxios.get<PaginatedResponse<IShop>>("/shops", {
      params,
    });
  }
}

export const shopService = new ShopService();
