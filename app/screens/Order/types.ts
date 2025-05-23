import { Variation } from "~/services/api/product.service";
import { IVoucher } from "~/services/api/shop.service";

export interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  quantity: number;
  isSelected?: boolean;
  productId: string;
  variation: Variation;
  variations: Variation[];
}

export interface Store {
  id: string;
  name: string;
  items: StoreItem[];
  isSelected: boolean;
  shopVoucher?: IVoucher;
}
