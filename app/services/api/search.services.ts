import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface ISearchTrending {
  id: string;
  name: string;
  image: string;
}

export interface ISearchSuggestion {
  id: string;
  name: string;
  count: number;
}

class SearchService {
  async getTrending() {
    return typedAxios.get<string[]>("/search/trending");
  }

  async searchSuggestions(search: string) {
    return typedAxios.get<ISearchSuggestion[]>("/search/suggestions", {
      params: { search },
    });
  }
}

export const searchService = new SearchService();
