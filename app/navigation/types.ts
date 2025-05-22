import { NavigatorScreenParams, RouteProp } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { IReview } from "~/services/api/review.service";

// Define the param list for the tab navigator
export type TabParamList = {
  Home: undefined;
  TempSearch: undefined;
  Notifications: undefined;
  Profile: undefined;
};

// Define the param list for the root stack navigator
export type RootStackParamList = {
  // The main tab navigator is a screen in the root stack
  MainTabs: NavigatorScreenParams<TabParamList>;
  // Add other root stack screens here
  Buttons: undefined;
  Inputs: undefined;
  Search?: {
    shopId?: string;
  };
  Login: undefined;
  SearchAdvance: {
    searchText?: string;
    shopId?: string;
    categoryId?: string;
    categoryName?: string;
  };
  DetailProduct: {
    id: string | number;
  };
  test: undefined;
  LikedProduct: undefined;
  EditProfile: undefined;
  ShoppingCart: undefined;
  Payment: {
    isClearCart?: boolean;
  };
  Address: undefined;
  VoucherSelect: {
    productIds?: number[];
  };
  EditAddress: undefined;
  MyOrder: {
    tabIndex: number;
  };
  Settings: undefined;
  BusinessVoucher: undefined;
  MyRating: undefined;
  EditReview: {
    orderId: number;
    productId: number;
    variationId: number;
    thumbnail: string;
    productName: string;
    variationName: string;
    review?: IReview;
    isEdit?: boolean;
  };
  HelpCenter: undefined;
  HelpCenterDetail: undefined;
  TalkWithCropee: undefined;
  FAQs: undefined;
  FAQsDetail: undefined;
  Shop: {
    id: string | number;
    tabIndex?: number;
  };
  DetailNotification: {
    id: string | number;
  };
  SearchOrder: undefined;
  Followers: undefined;
  Followings: undefined;
  ChangePassword: undefined;
  FlashSale: undefined;
  FlashSaleProduct: {
    id: string | number;
  };
  MyVoucher: undefined;
  AllProductReview: {
    id: string | number;
  };
  DetailOrder: {
    orderId: number;
  };
  ProductBy: {
    productIds: string[];
    title: string;
  };
};

// Create a type for the navigation prop for stack screens
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>["navigation"];

export type RootStackRouteProp<T extends keyof RootStackParamList> = RouteProp<
  RootStackParamList,
  T
>;

// Create a type for the navigation prop for tab screens
export type TabScreenProps<T extends keyof TabParamList> = BottomTabScreenProps<
  TabParamList,
  T
>;

// Create a helper type for useNavigation hook
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
