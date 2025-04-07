export interface StoreItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  type: string;
  quantity: number;
  isSelected?: boolean;
}

export interface Store {
  id: string;
  name: string;
  items: StoreItem[];
  isSelected: boolean;
}
