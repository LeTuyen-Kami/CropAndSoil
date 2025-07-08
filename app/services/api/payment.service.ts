import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface IPaymentMethod {
  key: string;
  title: string;
  description: string;
  accounts: {
    bankName: string;
    accountNumber: string;
    accountName: string;
    iBan: string;
    bic: string;
    sortCode: string;
  }[];
}

class PaymentService {
  async getAvailablePaymentMethods() {
    return typedAxios.get<IPaymentMethod[]>("/payments");
  }
}

export const paymentService = new PaymentService();
