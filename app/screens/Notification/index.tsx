import { useNavigation } from "@react-navigation/native";
import { atom, useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Gesture } from "react-native-gesture-handler";
import Animated, {
  CurvedTransition,
  FadeOut,
  LinearTransition,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast, ToastType } from "~/components/common/Toast";
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
    <ScreenWrapper hasGradient={false}>
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
      <View className="flex-1 mt-20 bg-fuchsia-100">
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
        <Button
          title="Show Toast"
          onPress={() => {
            const randomId = Math.random().toString(36).substring(2, 15);
            const listState = ["success", "error", "warning", "info"];
            const randomState =
              listState[Math.floor(Math.random() * listState.length)];
            toast("Hello", randomState as ToastType, "top", 3000, randomId);
          }}
        />
      </View>
    </ScreenWrapper>
  );
};

const Items = () => {
  const [data, setData] = useState<any[]>([]);

  const onRemoveItem = (index: number) => {
    console.log("remove", new Date().getTime());
    setData(data.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setData([...Array(10)]?.map((_, index) => index));
  }, []);

  useEffect(() => {
    console.log("datachange", new Date().getTime());
  }, [data]);

  return (
    <View className="flex-row flex-wrap gap-2">
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
      <ComponentA />
      <ComponentB />
    </View>
  );
};

const testAtom = atom("string");

const ComponentA = () => {
  const [test, setTest] = useAtom(testAtom);

  return (
    <View className="bg-red-500">
      <Text>ComponentA</Text>
      <Button
        title="Press me"
        onPress={() => {
          console.log("A", new Date().getTime());

          setTest(Math.random().toString());
        }}
      />
    </View>
  );
};

const ComponentB = () => {
  const [test, setTest] = useAtom(testAtom);

  useEffect(() => {
    console.log("B", new Date().getTime());
  }, [test]);

  return (
    <View className="bg-blue-500">
      <Text>ComponentB</Text>
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
