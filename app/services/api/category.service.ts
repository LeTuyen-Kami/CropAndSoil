import { axiosInstance, typedAxios } from "../base";
import { PaginatedResponse, PaginationRequests } from "~/types";

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
}

class CategoryService {
  async getCategories(payload: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<ICategory>>("/categories", {
      params: payload,
    });
  }
}

export const categoryService = new CategoryService();
