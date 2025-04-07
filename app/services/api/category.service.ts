import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

class CategoryService {
  async getCategories(): Promise<AxiosResponse<Category[]>> {
    return axiosInstance.get("/categories");
  }

  async getCategoryById(id: string): Promise<AxiosResponse<Category>> {
    return axiosInstance.get(`/categories/${id}`);
  }

  async getCategoryProducts(id: string): Promise<AxiosResponse<Category>> {
    return axiosInstance.get(`/categories/${id}/products`);
  }
}

export const categoryService = new CategoryService();
