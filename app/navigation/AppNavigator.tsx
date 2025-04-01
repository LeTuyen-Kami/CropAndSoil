import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text } from "react-native";
import { HomeScreen } from "~/screens/Home";
import LoginScreen from "~/screens/Login";
import NotificationScreen from "~/screens/Notification";
import ProfileScreen from "~/screens/Profile";
import SearchScreen from "~/screens/Search";
import Buttons from "~/screens/Test/Buttons";
import Inputs from "~/screens/Test/Inputs";
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
          name="Search"
          component={SearchScreen}
          options={{
            animationDuration: 300,
            animation: "fade_from_bottom",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
