import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  categoryId: string;
  stock: number;
  rating: number;
  numReviews: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface ProductResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
}

class ProductService {
  async getProducts(
    query: ProductQuery = {}
  ): Promise<AxiosResponse<ProductResponse>> {
    return axiosInstance.get("/products", { params: query });
  }

  async getProductById(id: string): Promise<AxiosResponse<Product>> {
    return axiosInstance.get(`/products/${id}`);
  }

  async getRelatedProducts(id: string): Promise<AxiosResponse<Product[]>> {
    return axiosInstance.get(`/products/${id}/related`);
  }
}

export const productService = new ProductService();
