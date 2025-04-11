import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
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
import Payment from "~/screens/Payment";
import ProfileScreen from "~/screens/Profile";
import SearchScreen from "~/screens/Search";
import SearchAdvance from "~/screens/SearchAdvance";
import Settings from "~/screens/Settings";
import ShoppingCart from "~/screens/ShoppingCart";
import Buttons from "~/screens/Test/Buttons";
import Inputs from "~/screens/Test/Inputs";
import TestScreen from "~/screens/TestScreen";
import VoucherSelectScreen from "~/screens/VoucherSelect";
import CustomTabBar from "./CustomTabbar";
import { RootStackParamList, TabParamList } from "./types";
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
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="Buttons" component={Buttons} />
        <Stack.Screen name="Inputs" component={Inputs} />
        <Stack.Screen name="Login" component={LoginScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
