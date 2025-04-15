import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface IPaymentMethod {
  key: string;
  title: string;
  description: string;
}

class PaymentService {
  async getAvailablePaymentMethods() {
    return typedAxios.get<IPaymentMethod[]>("/payments");
  }
}

export const paymentService = new PaymentService();
