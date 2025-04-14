import { axiosInstance, typedAxios } from "../base";
import { PaginatedResponse, PaginationRequests } from "~/types";

export interface ICategory {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
}

export interface IShopCategory extends ICategory {
  totalProducts: number;
}

export interface IGetCategoryByShopIdPayload extends PaginationRequests {
  shopId: string | number;
}

class CategoryService {
  async getCategories(payload: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<ICategory>>("/categories", {
      params: payload,
    });
  }

  async getCategoryByShopId(payload: IGetCategoryByShopIdPayload) {
    return typedAxios.get<PaginatedResponse<IShopCategory>>(`/categories`, {
      params: payload,
    });
  }
}

export const categoryService = new CategoryService();
