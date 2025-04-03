import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const App = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={style.container}>
        <View className="bg-red-500">
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("test");
            }}
          >
            <Text>Press me!</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    gap: 16,
  },
  tile: {
    backgroundColor: "lightgrey",
    borderWidth: 0.5,
    borderColor: "#d6d7da",
    padding: 4,
  },
});

export default App;
