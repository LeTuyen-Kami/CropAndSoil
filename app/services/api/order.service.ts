import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface IOrderCheckoutRequest {
  cartId: string;
  paymentMethod: string;
  shippingAddress: string;
}

export interface IOrderSearchRequest extends PaginationRequests {
  search?: string;
  ids?: string; // comma separated
  status?: string;
}

export interface IOrderListRequest {
  page: number;
  limit: number;
}

export interface IItem {
  product: {
    id: number;
    name: string;
  };
  variation: {
    id: number;
    name: string;
  };
  quantity: number;
}

export interface IShop {
  id: number;
  shippingMethodKey: string;
  note: string;
  voucherCode: string;
  items: IItem[];
}

export interface IOrderCalculateRequest {
  paymentMethodKey: string;
  shippingAddressId: number;
  shippingVoucherCode: string;
  productVoucherCode: string;
  shops: IShop[];
  isClearCart?: boolean;
}

export interface ShippingMethod {
  key: string;
  title: string;
  total: number;
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

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Tag {
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
  unavailableLocations: any[];
  thumbnail: string;
  video: string;
  images: string[];
  properties: any[];
  categories: Category[];
  tags: Tag[];
  brands: Brand[];
  attributes: Attribute[];
  variations: Variation[];
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface Item {
  name: string;
  productId: number;
  product: Product;
  variationId: number;
  variation: Variation;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface OrderShop {
  note: string;
  shippingMethodKey: string;
  shippingMethod: ShippingMethod;
  voucherCode: string;
  shopShippingVoucher?: any;
  shippingFee: number;
  shopShippingVoucherDiscount: number;
  marketplaceShippingVoucher?: any;
  marketplaceShippingVoucherDiscount: number;
  shopProductVoucher?: any;
  shopProductVoucherDiscount: number;
  marketplaceProductVoucher?: any;
  marketplaceProductVoucherDiscount: number;
  marketplaceDiscount: number;
  shop: Shop;
  subtotal: number;
  orderTotal: number;
  items: Item[];
}

export interface ShippingAddres {
  id: number;
  name: string;
  phoneNumber: string;
  isDefault: boolean;
  addressLine: string;
  ward: Ward;
  district: District;
  province: Province;
  addressType: string;
}

export interface ICalculateResponse {
  orderShops: OrderShop[];
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingAddress: ShippingAddres;
  saveMoney: number;
  shippingFeeTotal: number;
  shippingVoucherDiscountTotal: number;
  productVoucherDiscountTotal: number;
  marketplaceDiscountTotal: number;
  marketplaceProductVoucherDiscountTotal: number;
  marketplaceShippingVoucherDiscountTotal: number;
  total: number;
}

export interface IListOrderRequest extends PaginationRequests {
  statusKey?: string;
  ids?: string; // comma separated
  search?: string;
  isNotReviewed?: boolean;
}

export interface StatusHistory {
  status: string;
  at: string;
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

export interface PaymentMethod {
  key: string;
  title: string;
}

export interface StatusHistory {
  status: string;
  at: string;
}

export interface PaymentMethod {
  type: string;
  title: string;
}

export interface Billing {
  name: string;
  email: string;
  phone: string;
  addressLineText: string;
  addressWardText: string;
  addressDistrictText: string;
  addressProvinceText: string;
  addressCountryText: string;
}

export interface Shipping {
  name: string;
  phone: string;
  addressLineText: string;
  addressWardText: string;
  addressDistrictText: string;
  addressProvinceText: string;
  addressCountryText: string;
}

export interface Attribute {
  slug: string;
  optionSlug: string;
}

export interface Item {
  name: string;
  productId: number;
  variationId: number;
  quantity: number;
  subtotal: number;
  total: number;
  attributes: Attribute[];
}

export interface Fee {
  type: string;
  name: string;
  amount: number;
  total: number;
}

export interface Info {
  id: number;
  code: string;
  discountType: string;
}

export interface Voucher {
  name: string;
  discount: number;
  info: Info;
}

export interface Variation {
  id: number;
  name: string;
  sku: string;
  regularPrice: number;
  salePrice: number;
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

export interface IOrder {
  id: number;
  note: string;
  createdAt: string;
  status: string;
  statusHistory: StatusHistory[];
  buyerId: number;
  shopId: number;
  orderCurrency: string;
  orderTotal: number;
  cartDiscount: number;
  paymentMethod: PaymentMethod;
  billing: Billing;
  shipping: Shipping;
  items: Item[];
  fees: Fee[];
  vouchers: Voucher[];
  shop: Shop;
  shippingMethod: ShippingMethod;
  isRefundable: boolean;
}

export interface Order {
  id: number;
  orderTotal: number;
}

// export interface Payload {
//   orders: Order[];
//   receiptTotal: number;
//   paymentMethod: PaymentMethod;
//   paymentUrl?: any;
// }

export interface PaymentMethod {
  key: string;
  title: string;
  description: string;
}

export interface Payload {
  receiptTotal: number;
  paymentMethod: PaymentMethod;
  paymentUrl?: any;
  paymentOrderId: string;
}

export interface IOrderCheckoutResponse {
  message: string;
  payload: Payload;
}

export interface IRefundRequest {
  reason: string;
  images: {
    uri: string;
    type: string;
    name: string;
  }[];
}

export interface IRefundResponse {
  message: string;
  payload: Payload;
}

class OrderService {
  async calculate(data: IOrderCalculateRequest) {
    return typedAxios.post<ICalculateResponse>("/orders/calculation", data);
  }

  async checkout(data: IOrderCalculateRequest) {
    return typedAxios.post<IOrderCheckoutResponse>("/orders/checkout", data);
  }

  async search(data: IOrderSearchRequest) {
    return typedAxios.get<PaginatedResponse<IOrder>>("/orders", {
      params: data,
    });
  }

  async listOrder(data: IListOrderRequest) {
    return typedAxios.get<PaginatedResponse<IOrder>>("/orders", {
      params: data,
    });
  }

  async detail(orderId: string) {
    return typedAxios.get<IOrder>(`/orders/${orderId}`);
  }

  async tracking(orderId: string) {
    return typedAxios.get(`/orders/tracking/${orderId}`);
  }

  async cancel(orderId: string) {
    return typedAxios.put(`/orders/${orderId}/cancel`);
  }

  async refund(orderId: string, data: IRefundRequest) {
    const formData = new FormData();
    formData.append("reason", data.reason);
    data.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: image.type,
        name: image.name || `image_${index}.jpg`,
      } as any);
    });

    return typedAxios.put<IRefundResponse>(
      `/orders/${orderId}/request-refund`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }
}

export const orderService = new OrderService();
