import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";
import { Product } from "./product.service";

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddToCartPayload {
  productId: string;
  quantity: number;
}

class CartService {
  async getCart(): Promise<AxiosResponse<Cart>> {
    return axiosInstance.get("/cart");
  }

  async addToCart(payload: AddToCartPayload): Promise<AxiosResponse<Cart>> {
    return axiosInstance.post("/cart/items", payload);
  }

  async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<AxiosResponse<Cart>> {
    return axiosInstance.patch(`/cart/items/${itemId}`, { quantity });
  }

  async removeCartItem(itemId: string): Promise<AxiosResponse<Cart>> {
    return axiosInstance.delete(`/cart/items/${itemId}`);
  }

  async clearCart(): Promise<AxiosResponse<void>> {
    return axiosInstance.delete("/cart");
  }
}

export const cartService = new CartService();
