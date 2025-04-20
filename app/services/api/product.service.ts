import { AxiosResponse } from "axios";
import { typedAxios } from "../base";
import { PaginatedResponse, PaginationRequests } from "~/types";

export interface Value {
  id: number;
  name: string;
  slug: string;
}

export interface Option {
  id: number;
  name: string;
  slug: string;
}

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
  totalReviews: number;
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

export interface IProduct {
  id: number;
  name: string;
  createdAt: string;
  slug: string;
  shopId: number;
  shop: Shop;
  isTopDeal: boolean;
  description: string;
  isLiked: boolean;
  shortDescription: string;
  totalSales: number;
  sku: string;
  regularPrice: number;
  salePrice: number;
  featured: boolean;
  onSale: boolean;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
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

export interface IProductResquest extends PaginationRequests {
  search: string;
  minPrice: number;
  maxPrice: number;
  locations: string; // comma separated
  averageRatingFrom: number;
  categoryIds: string; // comma separated
  ids: string; // comma separated
  sortBy: "salePrice" | "createdAt" | "bestSelling";
  sortDirection: "asc" | "desc";
  shopId: string;
}

class ProductService {
  async searchProducts(params: Partial<IProductResquest>) {
    return typedAxios.get<PaginatedResponse<IProduct>>("/products", {
      params,
    });
  }

  async getTopDealProducts(params: Partial<IProductResquest>) {
    return typedAxios.get<PaginatedResponse<IProduct>>(`/products/top-deals`);
  }

  async getProductDetail(id: string | number) {
    return typedAxios.get<IProduct>(`/products/${id}`);
  }

  async getRecommendedProducts() {
    return typedAxios.get<IProduct[]>(`/recommended-products`);
  }
}

export const productService = new ProductService();
