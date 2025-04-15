import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
import { IProduct } from "./product.service";

// Danh sách sản phẩm yêu thích	GET /api/wishlist	GET /wishlist
// Thêm sản phẩm yêu thích	POST /api/wishlist/{productId}	POST /wishlist/{productId}
// Xóa sản phẩm yêu thích	DELETE /api/wishlist/{productId}	DELETE /wishlist/{productId}

class WishlistService {
  async getWishlist() {
    return typedAxios.get<IProduct[]>("/wishlist");
  }

  async addWishlist(productId: string) {
    return typedAxios.post<string[]>(`/wishlist/${productId}`);
  }

  async removeWishlist(productId: string) {
    return typedAxios.delete<string[]>(`/wishlist/${productId}`);
  }
}

export const wishlistService = new WishlistService();
