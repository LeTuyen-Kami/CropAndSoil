import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface ISearchTrending {
  id: string;
  name: string;
  image: string;
}

class SearchService {
  async getTrending() {
    return typedAxios.get<string[]>("/search/trending");
  }

  async searchSuggestions(search: string) {
    return typedAxios.get<string[]>("/search/suggestions", {
      params: { search },
    });
  }
}

export const searchService = new SearchService();
