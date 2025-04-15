// /recently-viewed-products
import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
import { IProduct } from "./product.service";

class CommonService {
  async getRecentlyViewedProducts() {
    return typedAxios.get<IProduct[]>("/recently-viewed-products");
  }
}

export const commonService = new CommonService();
