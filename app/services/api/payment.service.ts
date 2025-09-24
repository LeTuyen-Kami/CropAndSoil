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

export interface IPaymentStatus {
  status: string;
  amount: number;
  paymentMethod: string;
  paymentUrl: string;
  expiredAt: string;
  orderIds: number[];
  paymentMeta: {
    orderCode: string;
    expiredAtTz: string;
    amount: number;
    bankName: string;
    bankLogo: string;
    accountNumber: string;
    accountHolderName: string;
    qrCodeUrl: string;
  };
}

class PaymentService {
  async getAvailablePaymentMethods() {
    return typedAxios.get<IPaymentMethod[]>("/payments");
  }

  async getPaymentStatus(paymentOrderId?: string, paymentToken?: string) {
    const searchParams = new URLSearchParams();
    searchParams.append("paymentOrderId", paymentOrderId || "");
    searchParams.append("paymentToken", paymentToken || "");

    return typedAxios.get<IPaymentStatus>(
      `/payments/payment-status?${searchParams.toString()}`
    );
  }
}

export const paymentService = new PaymentService();
