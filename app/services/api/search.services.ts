import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface ISearchTrending {
  id: string;
  name: string;
  image: string;
}

class SearchService {
  async getTrending() {
    return typedAxios.get<ISearchTrending[]>("/search/trending");
  }

  async searchSuggestions(search: string) {
    return typedAxios.get<string[]>("/search/suggestions", {
      params: { search },
    });
  }

  async searchProducts(params: { search: string; skip: number; take: number }) {
    return typedAxios.get<PaginatedResponse<string>>("/products", {
      params,
    });
  }
}

export const searchService = new SearchService();
