import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";
import { Product } from "./product.service";

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: "cod" | "card";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  items: Array<{ productId: string; quantity: number }>;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    phone: string;
  };
  paymentMethod: "cod" | "card";
}

class OrderService {
  async createOrder(
    payload: CreateOrderPayload
  ): Promise<AxiosResponse<Order>> {
    return axiosInstance.post("/orders", payload);
  }

  async getOrders(): Promise<AxiosResponse<Order[]>> {
    return axiosInstance.get("/orders");
  }

  async getOrderById(id: string): Promise<AxiosResponse<Order>> {
    return axiosInstance.get(`/orders/${id}`);
  }

  async cancelOrder(id: string): Promise<AxiosResponse<Order>> {
    return axiosInstance.post(`/orders/${id}/cancel`);
  }
}

export const orderService = new OrderService();
