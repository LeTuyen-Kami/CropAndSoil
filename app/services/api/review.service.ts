import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";
import mime from "mime";

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
  createdAt: string;
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

export interface Reply {
  id: number;
  authorName: string;
  authorAvatar?: any;
  rating?: any;
  isAnonymous: boolean;
  comment: string;
  totalLikes?: any;
  totalReplies: number;
  gallery: any[];
  shop?: any;
  productId?: any;
  product?: any;
  variationId?: any;
  variation?: any;
  orderId?: any;
  createdAt: string;
  replies: any[];
}

export interface IGallery {
  id: string;
  type: string;
  mimeType: string;
  thumbnail: string;
  width: number;
  height: number;
  fileSize: number;
  src: string;
}

export interface IReview {
  id: number;
  authorName: string;
  authorAvatar: string;
  rating: number;
  isAnonymous: boolean;
  quality: string;
  comment: string;
  totalLikes: number;
  totalReplies: number;
  gallery: IGallery[];
  shop: Shop;
  productId: number;
  product: Product;
  packaging: string;
  variationId: number;
  variation: Variation;
  orderId?: any;
  createdAt: string;
  replies: Reply[];
}

export interface IProductReviewRequest extends PaginationRequests {
  rating?: number;
}

export interface ICreateReviewRequest {
  rating: number;
  quality: string;
  package: string;
  comment: string;
  isAnonymous: boolean;
  orderId: string;
  productId: string;
  variationId: string;
  images: {
    uri: string;
    type: string;
    name: string;
  }[];
  video: {
    uri: string;
    type: string;
    name: string;
  };
}

export interface IUpdateReviewRequest extends ICreateReviewRequest {
  oldGallery: string[];
}

class ReviewService {
  async getProductReviews(
    productId: number | string,
    data: IProductReviewRequest
  ) {
    return typedAxios.get<PaginatedResponse<IReview>>(
      `/reviews/products/${productId}`,
      {
        params: data,
      }
    );
  }

  async getMyReviews(data: IProductReviewRequest) {
    Object.keys(data).forEach((key) => {
      if (data[key as keyof IProductReviewRequest] === "") {
        delete data[key as keyof IProductReviewRequest];
      }
    });

    return typedAxios.get<PaginatedResponse<IReview>>(`/reviews/my-reviews`, {
      params: data,
    });
  }

  async createReview(data: ICreateReviewRequest) {
    const formData = new FormData();

    data.rating && formData.append("rating", String(data.rating));
    data.quality && formData.append("quality", data.quality);
    data.package && formData.append("package", data.package);
    data.comment && formData.append("comment", data.comment);
    formData.append("isAnonymous", String(data.isAnonymous));
    data.orderId && formData.append("orderId", data.orderId);
    data.productId && formData.append("productId", data.productId);
    data.variationId && formData.append("variationId", data.variationId);

    data.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: mime.getType(image.name) || "image/jpeg",
        name: image.name || `image_${index}.jpg`,
      } as any);
    });

    if (data.video?.uri) {
      formData.append("video", {
        uri: data.video.uri,
        type: mime.getType(data.video.name) || "video/mp4",
        name: data.video.name || "video.mp4",
      } as any);
    }

    return typedAxios.post<IReview>("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async updateReview(reviewId: string | number, data: IUpdateReviewRequest) {
    const formData = new FormData();

    data.rating && formData.append("rating", String(data.rating));
    data.quality && formData.append("quality", data.quality);
    data.package && formData.append("package", data.package);
    data.comment && formData.append("comment", data.comment);
    formData.append("isAnonymous", String(data.isAnonymous));
    data.orderId && formData.append("orderId", data.orderId);
    data.productId && formData.append("productId", data.productId);
    data.variationId && formData.append("variationId", data.variationId);

    data.oldGallery.forEach((image) => {
      formData.append("oldGallery[]", image);
    });

    data.images.forEach((image, index) => {
      formData.append("images", {
        uri: image.uri,
        type: mime.getType(image.name) || "image/jpeg",
        name: image.name || `image_${index}.jpg`,
      } as any);
    });

    if (data.video?.uri) {
      formData.append("video", {
        uri: data.video.uri,
        type: mime.getType(data.video.name) || "video/mp4",
        name: data.video.name || "video.mp4",
      } as any);
    }

    return typedAxios.put<IReview>(`/reviews/${reviewId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const reviewService = new ReviewService();
