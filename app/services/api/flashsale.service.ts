import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
import { IProduct } from "./product.service";

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

export interface Shop {
  id: number;
  shopName: string;
  shopLogoUrl: string;
  shopCoverUrl: string;
  shopRating: number;
  isOfficial: boolean;
  totalProducts: number;
  totalReviews?: any;
  totalFollowers: number;
  totalFollowing: number;
  lastOnlineAt: string;
  createdAt: string;
  replyRate: string;
  replyIn: string;
  shopWarehouseLocation: ShopWarehouseLocation;
}

export interface Value {
  id: number;
  name: string;
  slug: string;
}

export interface Property {
  name: string;
  key: string;
  values: Value[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Option {
  id: number;
  name: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  options: Option[];
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface Variation {
  id: number;
  name: string;
  sku: string;
  regularPrice: number;
  salePrice?: any;
  description: string;
  totalSales: number;
  weight: number;
  length?: any;
  width?: any;
  height?: any;
  thumbnail: string;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  attributes: Attribute[];
}

export interface FlashSaleProduct {
  id: number;
  name: string;
  slug: string;
  shopId: number;
  shop: Shop;
  isLiked: boolean;
  description: string;
  shortDescription: string;
  totalSales: number;
  sku: string;
  regularPrice: number;
  salePrice: number;
  featured: boolean;
  onSale: boolean;
  stock: number;
  stockStatus: string;
  averageRating?: any;
  reviewCount?: any;
  purchaseNote: string;
  weight?: any;
  length?: any;
  width?: any;
  height?: any;
  upsellIds: any[];
  unavailableLocations: string[];
  thumbnail: string;
  video: string;
  images: string[];
  properties: Property[];
  categories: Category[];
  tags: any[];
  brands: Brand[];
  attributes: Attribute[];
  variations: Variation[];
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface FlashSaleVariation {
  id: number;
  name: string;
  sku: string;
  regularPrice: number;
  salePrice?: any;
  description: string;
  totalSales: number;
  weight: number;
  length?: any;
  width?: any;
  height?: any;
  thumbnail: string;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  attributes: Attribute[];
}

export interface IFlashSaleProduct {
  id: number;
  flashSaleProduct: FlashSaleProduct;
  flashSaleVariation: FlashSaleVariation;
  flashSaleStartAt: string;
  flashSaleEndAt: string;
  purchaseLimit: number;
  campaignStock: number;
  discountPercent: number;
  salePrice: number;
  bought: number;
}

class FlashSaleService {
  async getFlashSaleTimeSlot() {
    return typedAxios.get<string[]>("/flash-sales/time-slots");
  }

  async getFlashSale(params: PaginationRequests, timeSlot?: string) {
    if (!timeSlot) {
      return typedAxios.get<PaginatedResponse<IFlashSaleProduct>>(
        `/flash-sales/items`,
        {
          params,
        }
      );
    }

    return typedAxios.get<PaginatedResponse<IFlashSaleProduct>>(
      `/flash-sales/items?timeSlot=${timeSlot}`,
      {
        params,
      }
    );
  }

  async getFlashItemDetail(id: string | number) {
    return typedAxios.get<IFlashSaleProduct>(`/flash-sales/items/${id}`);
  }
}

export const flashSaleService = new FlashSaleService();
