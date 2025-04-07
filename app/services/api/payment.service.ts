import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";

export interface PaymentMethod {
  id: string;
  type: "card" | "cod";
  cardInfo?: {
    last4: string;
    brand: string;
    expiryMonth: number;
    expiryYear: number;
  };
  isDefault: boolean;
}

export interface CreatePaymentIntentPayload {
  orderId: string;
  paymentMethodId?: string;
}

export interface PaymentIntent {
  id: string;
  clientSecret: string;
  amount: number;
  currency: string;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "succeeded"
    | "canceled";
}

class PaymentService {
  async getPaymentMethods(): Promise<AxiosResponse<PaymentMethod[]>> {
    return axiosInstance.get("/payments/methods");
  }

  async createPaymentIntent(
    payload: CreatePaymentIntentPayload
  ): Promise<AxiosResponse<PaymentIntent>> {
    return axiosInstance.post("/payments/create-intent", payload);
  }

  async confirmPayment(
    paymentIntentId: string
  ): Promise<AxiosResponse<PaymentIntent>> {
    return axiosInstance.post(`/payments/confirm/${paymentIntentId}`);
  }

  async cancelPayment(
    paymentIntentId: string
  ): Promise<AxiosResponse<PaymentIntent>> {
    return axiosInstance.post(`/payments/cancel/${paymentIntentId}`);
  }
}

export const paymentService = new PaymentService();
