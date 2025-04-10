import RNDateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  CurvedTransition,
  FadeOut,
  JumpingTransition,
  LinearTransition,
  SequencedTransition,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated from "react-native-reanimated";
const App = () => {
  const navigation = useNavigation<any>();

  const position = useSharedValue({ x: 0, y: 0 });

  const [isExpend, setIsExpend] = useState(false);

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
    <View className="flex-1">
      <View className="bg-red-500">
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("test");
          }}
        >
          <Text>Press me!</Text>
        </TouchableOpacity>
      </View>
      {/* <View className="w-[350px] h-[300px]">
        <RNDateTimePicker value={new Date()} display="compact" />
      </View>
      <GestureHandlerRootView className="flex-1">
        <GestureDetector gesture={pan}>
          <Animated.View className="bg-blue-500 size-5" style={animatedStyle} />
        </GestureDetector>
      </GestureHandlerRootView> */}
      <View className="flex-1 bg-fuchsia-100">
        <Animated.View
          className={"pb-10 bg-cyan-300"}
          layout={LinearTransition}
        >
          <Text>Hello</Text>
          <Button title="Press me" onPress={() => setIsExpend(!isExpend)} />
          {isExpend && (
            <View className="bg-yellow-400">
              <Text>Hello123</Text>
            </View>
          )}
        </Animated.View>
        <Items />
      </View>
    </View>
  );
};

const Items = () => {
  const [data, setData] = useState<any[]>([]);

  const onRemoveItem = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setData([...Array(10)]?.map((_, index) => index));
  }, []);

  return (
    <View className="flex-row flex-wrap flex-1 gap-2">
      {data.map((value) => (
        <Animated.View
          key={value}
          className="h-10 bg-yellow-400 w-fit"
          exiting={FadeOut}
          layout={CurvedTransition}
        >
          <Text>Hello {value + 1}</Text>
          <TouchableOpacity onPress={() => onRemoveItem(value)}>
            <Text>Remove</Text>
          </TouchableOpacity>
        </Animated.View>
      ))}
      <Button
        title="reset"
        onPress={() => setData([...Array(10)]?.map((_, index) => index))}
      />
    </View>
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
