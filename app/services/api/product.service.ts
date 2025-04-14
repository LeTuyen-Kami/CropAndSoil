import { AxiosResponse } from "axios";
import { typedAxios } from "../base";
import { PaginatedResponse } from "~/types";

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
  name: string;
}

export interface IProduct {
  id: number;
  name: string;
  slug: string;
  sellerId: number;
  description: string;
  shortDescription: string;
  totalSales: number;
  sku: string;
  regularPrice: number;
  salePrice: number;
  featured: boolean;
  onSale: boolean;
  stock?: any;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  purchaseNote: string;
  shopId: number;
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

export interface IProductResquest {
  skip: number;
  take: number;
  search: string;
  categoryId: number;
  minPrice: number;
  maxPrice: number;
  location: string;
  averageRatingFrom: number;
  ids: number[];
}

class ProductService {
  async searchProducts(params: Partial<IProductResquest>) {
    return typedAxios.get<PaginatedResponse<IProduct>>("/products", {
      params,
    });
  }

  async getProductDetail(id: string | number) {
    return typedAxios.get<IProduct>(`/products/${id}`);
  }

  async getRecommendedProducts() {
    return typedAxios.get<IProduct[]>(`/recommended-products`);
  }
}

export const productService = new ProductService();
