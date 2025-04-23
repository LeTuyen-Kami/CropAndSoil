import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
import { IProduct } from "./product.service";

export interface Slider {
  image: string;
  url: string;
}

export interface Banner {
  image: string;
  url: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  thumbnail: string;
  totalProducts: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface TopBrand {
  title: string;
  brands: Brand[];
}

export interface Button {
  title: string;
  url: string;
  target: string;
}

export interface Repeater {
  icon: string;
  heading: string;
  productIds: number[];
  button: Button;
  banners: {
    image: string;
    url: string;
  }[];
}

export interface Button {
  title: string;
  url: string;
  target: string;
}

export interface SuggestionProduct {
  title: string;
  productIds: number[];
  button: Button;
}

export interface IHomeResponse {
  sliders: Slider[];
  banners: Banner[];
  categories: Category[];
  topBrand: TopBrand;
  repeaters: Repeater[];
  suggestionProduct: SuggestionProduct;
}

export interface ILocalRepeater extends Repeater {
  products: IProduct[];
  id: string;
}

class HomeService {
  async getHome() {
    return typedAxios.get<IHomeResponse>("/home");
  }
}

export const homeService = new HomeService();
