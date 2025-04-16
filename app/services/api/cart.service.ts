import { typedAxios } from "../base";

export interface ICartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

export interface Province {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface District {
  id: string;
  name: string;
  type: string;
  provinceId: string;
}

export interface Ward {
  id: string;
  name: string;
  type: string;
  districtId: string;
}

export interface ShopWarehouseLocation {
  province: Province;
  district: District;
  ward: Ward;
  addressLine: string;
}

export interface Province {
  id: string;
  name: string;
  type: string;
  slug: string;
}

export interface District {
  id: string;
  name: string;
  type: string;
  provinceId: string;
}

export interface Ward {
  id: string;
  name: string;
  type: string;
  districtId: string;
}

export interface ShopWarehouseLocation {
  province: Province;
  district: District;
  ward: Ward;
  addressLine: string;
}

export interface Shop {
  id: number;
  shopName: string;
  shopLogoUrl: string;
  shopCoverUrl: string;
  shopRating: number;
  isOfficial: boolean;
  totalProducts: number;
  totalReviews: number;
  totalFollowers: number;
  totalFollowing: number;
  lastOnlineAt: string;
  createdAt: string;
  replyRate: string;
  replyIn: string;
  shopWarehouseLocation: ShopWarehouseLocation;
}

export interface Value {
  id: number;
  name: string;
  slug: string;
}

export interface Property {
  name: string;
  key: string;
  values: Value[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface Option {
  id: number;
  name: string;
  slug: string;
}

export interface Attribute {
  id: number;
  name: string;
  slug: string;
  options: Option[];
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface Variation {
  id: number;
  name: string;
  regularPrice: number;
  salePrice?: any;
  description: string;
  totalSales: number;
  weight: number;
  length?: any;
  width?: any;
  height?: any;
  thumbnail: string;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  attributes: Attribute[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  shopId: number;
  shop: Shop;
  description: string;
  shortDescription: string;
  totalSales: number;
  sku: string;
  regularPrice: number;
  salePrice: number;
  featured: boolean;
  onSale: boolean;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  purchaseNote: string;
  weight?: any;
  length?: any;
  width?: any;
  height?: any;
  upsellIds: any[];
  unavailableLocations: string[];
  thumbnail: string;
  video: string;
  images: string[];
  properties: Property[];
  categories: Category[];
  tags: any[];
  brands: Brand[];
  attributes: Attribute[];
  variations: Variation[];
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface Variation {
  id: number;
  name: string;
  regularPrice: number;
  salePrice?: any;
  description: string;
  totalSales: number;
  weight: number;
  length?: any;
  width?: any;
  height?: any;
  thumbnail: string;
  stock: number;
  stockStatus: string;
  averageRating: number;
  reviewCount: number;
  attributes: Attribute[];
}

export interface Item {
  id: number;
  productId: number;
  product: Product;
  variationId: number;
  variation: Variation;
  shopId: number;
  quantity: number;
  isChecked: boolean;
  createdAt: string;
  updatedAt: string;
  unitPrice: number;
  subtotal: number;
}

export interface CartShop {
  id: number;
  shopName: string;
  shopLogoUrl: string;
  shopCoverUrl: string;
  shopRating: number;
  isOfficial: boolean;
  totalProducts: number;
  totalReviews: number;
  totalFollowers: number;
  totalFollowing: number;
  lastOnlineAt: string;
  createdAt: string;
  replyRate: string;
  replyIn: string;
  shopWarehouseLocation: ShopWarehouseLocation;
  items: Item[];
  subtotal: number;
  voucher?: any;
  voucherDiscount: number;
  total: number;
}

export interface ICart {
  cartShops: CartShop[];
  subtotal: number;
  shippingVoucher?: any;
  productVoucher?: any;
  productVoucherDiscount: number;
  voucherDiscountTotal: number;
  marketplaceDiscount: number;
  total: number;
}

export interface IAddToCartRequest {
  productId: number | string;
  variationId: number | string;
  quantity: number | string;
  isChecked: boolean;
}

export interface IUpdateCartItemRequest extends IAddToCartRequest {}

export interface IRemoveCartItemRequest {
  cartItems: number[];
}

class CartService {
  async getDetailCart() {
    return typedAxios.get<ICart>("/cart");
  }

  async addToCart(data: IAddToCartRequest) {
    return typedAxios.post<ICartItem>("/cart", data);
  }

  async updateCartItem({
    cartItemId,
    data,
  }: {
    cartItemId: number;
    data: IUpdateCartItemRequest;
  }) {
    return typedAxios.put<ICartItem>(`/cart/${cartItemId}`, data);
  }

  async removeCartItem(data: IRemoveCartItemRequest) {
    return typedAxios.delete<void>(`/cart/remove-cart-item`, {
      data,
    });
  }
}

export const cartService = new CartService();
