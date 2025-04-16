import { IVoucher } from "~/services/api/shop.service";

export interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  type: string;
  quantity: number;
  isSelected?: boolean;
  productId: string;
  variation: {
    id: number;
    name: string;
  };
}

export interface Store {
  id: string;
  name: string;
  items: StoreItem[];
  isSelected: boolean;
  shopVoucher?: IVoucher;
}
