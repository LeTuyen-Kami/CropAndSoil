import { NavigatorScreenParams } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

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
  Search: undefined;
  Login: undefined;
};

// Create a type for the navigation prop for stack screens
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

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
