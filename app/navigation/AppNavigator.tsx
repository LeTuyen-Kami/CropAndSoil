import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TestScreen from "~/screens/TestScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, TabParamList } from "./types";
import Buttons from "~/screens/Test/Buttons";
import Inputs from "~/screens/Test/Inputs";
import { HomeScreen } from "~/screens/Home";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Test" component={TestScreen} />
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
