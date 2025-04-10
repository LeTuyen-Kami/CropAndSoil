import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
const App = () => {
  const navigation = useNavigation<any>();

  const position = useSharedValue({ x: 0, y: 0 });

  const pan = Gesture.Pan().onUpdate((event) => {
    console.log(event.translationX, event.translationY);
    position.value = {
      x: event.translationX,
      y: event.translationY,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: position.value.x },
        { translateY: position.value.y },
      ],
    };
  });

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
        <View className="w-[350px] h-[300px]">
          <RNDateTimePicker value={new Date()} display="compact" />
        </View>
        <GestureHandlerRootView className="flex-1">
          <GestureDetector gesture={pan}>
            <Animated.View
              className="bg-blue-500 size-5"
              style={animatedStyle}
            />
          </GestureDetector>
        </GestureHandlerRootView>
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
