import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { screen } from "~/utils";

const CarouselSkeleton = () => {
  return (
    <View
      className="overflow-hidden mx-3 my-4 rounded-lg animate-pulse bg-neutral-200"
      style={{ height: screen.width / 2 }}
    ></View>
  );
};

export default CarouselSkeleton;
