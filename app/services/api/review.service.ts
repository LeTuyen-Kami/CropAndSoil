import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";
import { User } from "./user.service";

export interface Review {
  id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  comment: string;
  images?: string[];
}

export interface UpdateReviewPayload {
  rating?: number;
  comment?: string;
  images?: string[];
}

class ReviewService {
  async getProductReviews(productId: string): Promise<AxiosResponse<Review[]>> {
    return axiosInstance.get(`/products/${productId}/reviews`);
  }

  async createReview(
    payload: CreateReviewPayload
  ): Promise<AxiosResponse<Review>> {
    return axiosInstance.post("/reviews", payload);
  }

  async updateReview(
    reviewId: string,
    payload: UpdateReviewPayload
  ): Promise<AxiosResponse<Review>> {
    return axiosInstance.patch(`/reviews/${reviewId}`, payload);
  }

  async deleteReview(reviewId: string): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(`/reviews/${reviewId}`);
  }
}

export const reviewService = new ReviewService();
