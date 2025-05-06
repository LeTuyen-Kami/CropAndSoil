import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  NavigationContainer,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { Text } from "react-native";
import Address from "~/screens/Address";
import BusinessVoucherScreen from "~/screens/BussinessVoucher";
import DetailProduct from "~/screens/DetailProduct";
import EditAddress from "~/screens/EditAddress";
import EditProfileScreen from "~/screens/EditProfile";
import { HomeScreen } from "~/screens/Home";
import LikedProductScreen from "~/screens/LikedProduct";
import LoginScreen from "~/screens/Login";
import MyOrderScreen from "~/screens/MyOrder";
import NotificationScreen from "~/screens/Notification";
import ProfileScreen from "~/screens/Profile";
import SearchScreen from "~/screens/Search";
import SearchAdvance from "~/screens/SearchAdvance";
import Settings from "~/screens/Settings";
import ShoppingCart from "~/screens/Order/ShoppingCart";
import Buttons from "~/screens/Test/Buttons";
import Inputs from "~/screens/Test/Inputs";
import TestScreen from "~/screens/TestScreen";
import VoucherSelectScreen from "~/screens/VoucherSelect";
import CustomTabBar from "./CustomTabbar";
import { RootStackParamList, TabParamList } from "./types";
import MyRating from "~/screens/MyRating";
import EditReview from "~/screens/EditReview";
import HelpCenter from "~/screens/HelpCenter";
import Shop from "~/screens/Shop";
import FAQs from "~/screens/FAQs";
import HelpCenterDetail from "~/screens/HelpCenterDetail";
import TalkWithCropee from "~/screens/TalkWithCropee";
import FAQsDetail from "~/screens/FAQsDetail";
import DetailNotification from "~/screens/DetailNotification";
import Payment from "~/screens/Order/Payment";
import SearchOrder from "~/screens/MyOrder/SearchOrder";
import Followers from "~/screens/Follow/Followers";
import Followings from "~/screens/Follow/Followings";
import ChangePassword from "~/screens/ChangePassword";
import FlashSale from "~/screens/FlashSale";
import FlashSaleProduct from "~/screens/FlashSaleProduct";
import MyVoucherScreen from "~/screens/VoucherSelect/MyVoucher";
import useFirebase from "~/hooks/useFirebase";
import useFCMNavigation from "~/hooks/useFCMNavigation";
import * as SplashScreen from "expo-splash-screen";
import AllProductReview from "~/screens/AllProductReview";
import DetailOrder from "~/screens/DetailOrder";
import useUpdateFCMToken from "~/hooks/useUpdateFCMToken";
import ProductByScreen from "~/screens/ProductBy";
const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TempSearchScreen = () => {
  return <Text>Temp Search</Text>;
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="TempSearch" component={TempSearchScreen} />
      <Tab.Screen name="Notifications" component={NotificationScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  const navigationRef = useNavigationContainerRef();
  useUpdateFCMToken();

  useEffect(() => {
    SplashScreen.setOptions({
      fade: true,
      duration: 500,
    });
    SplashScreen.hideAsync();
  }, []);

  useFCMNavigation(navigationRef);

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Buttons" component={Buttons} />
        <Stack.Screen name="Inputs" component={Inputs} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            animationDuration: 300,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen
          name="DetailProduct"
          component={DetailProduct}
          initialParams={{ id: "" }}
        />
        <Stack.Screen
          name="Search"
          component={SearchScreen}
          options={{
            animationDuration: 300,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen name="test" component={TestScreen} />
        <Stack.Screen name="LikedProduct" component={LikedProductScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ShoppingCart" component={ShoppingCart} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Address" component={Address} />
        <Stack.Screen name="VoucherSelect" component={VoucherSelectScreen} />
        <Stack.Screen
          name="SearchAdvance"
          component={SearchAdvance}
          options={{
            animationDuration: 300,
            animation: "fade_from_bottom",
          }}
        />
        <Stack.Screen name="EditAddress" component={EditAddress} />
        <Stack.Screen name="MyOrder" component={MyOrderScreen} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen
          name="BusinessVoucher"
          component={BusinessVoucherScreen}
        />
        <Stack.Screen name="MyRating" component={MyRating} />
        <Stack.Screen name="EditReview" component={EditReview} />
        <Stack.Screen name="HelpCenter" component={HelpCenter} />
        <Stack.Screen name="HelpCenterDetail" component={HelpCenterDetail} />
        <Stack.Screen name="TalkWithCropee" component={TalkWithCropee} />
        <Stack.Screen name="FAQs" component={FAQs} />
        <Stack.Screen name="FAQsDetail" component={FAQsDetail} />
        <Stack.Screen name="Shop" component={Shop} />
        <Stack.Screen
          name="DetailNotification"
          component={DetailNotification}
        />
        <Stack.Screen name="SearchOrder" component={SearchOrder} />
        <Stack.Screen name="DetailOrder" component={DetailOrder} />
        <Stack.Screen name="Followers" component={Followers} />
        <Stack.Screen name="Followings" component={Followings} />
        <Stack.Screen name="ChangePassword" component={ChangePassword} />
        <Stack.Screen name="FlashSale" component={FlashSale} />
        <Stack.Screen name="FlashSaleProduct" component={FlashSaleProduct} />
        <Stack.Screen name="MyVoucher" component={MyVoucherScreen} />
        <Stack.Screen name="AllProductReview" component={AllProductReview} />
        <Stack.Screen name="ProductBy" component={ProductByScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
