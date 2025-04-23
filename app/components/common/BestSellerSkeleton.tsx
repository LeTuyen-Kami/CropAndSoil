import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { screen } from "~/utils";

interface BestSellerSkeletonProps {
  count?: number;
}

const ProductGridSkeleton = () => {
  const width = (screen.width - 24) / 2 - 4;

  return (
    <View
      style={{ width: width }}
      className="overflow-hidden flex-grow bg-white rounded-2xl border shadow-sm border-neutral-200"
    >
      <View className="w-full bg-neutral-100 aspect-square">
        <LinearGradient
          colors={["#f0f0f0", "#e0e0e0", "#f0f0f0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-full animate-pulse"
        />
      </View>
      <View className="p-[10] flex-col gap-[6]">
        <View className="h-[12] w-[100] bg-neutral-200 rounded-full animate-pulse" />
        <View className="h-[12] w-[80] bg-neutral-200 rounded-full animate-pulse" />
        <View className="flex-row gap-[6] items-center justify-between">
          <View className="h-[16] w-[70] bg-neutral-200 rounded-full animate-pulse" />
          <View className="h-[12] w-[40] bg-neutral-200 rounded-full animate-pulse" />
        </View>

        <View className="flex-row items-center mt-2">
          <View className="flex-row">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <View
                  key={i}
                  className="h-[10] w-[10] bg-neutral-200 rounded-full animate-pulse mr-[2]"
                />
              ))}
          </View>
          <View className="h-[10] w-[40] bg-neutral-200 rounded-full animate-pulse ml-2" />
        </View>

        <View className="flex-row gap-[2] items-center mt-1">
          <View className="h-[12] w-[12] bg-neutral-200 rounded-full animate-pulse" />
          <View className="h-[10] w-[80] bg-neutral-200 rounded-full animate-pulse ml-1" />
        </View>
      </View>
    </View>
  );
};

const BestSellerSkeleton = ({ count = 2 }: BestSellerSkeletonProps) => {
  return (
    <View className="bg-primary-50">
      <View className="mt-2">
        <View className="pb-20 mx-2">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row gap-2 items-center">
              <View className="w-[40] h-[40] bg-neutral-200 rounded-full animate-pulse" />
              <View className="h-[20] w-[180] bg-neutral-200 rounded-full animate-pulse" />
            </View>
          </View>

          <View className="flex flex-row flex-wrap gap-2">
            {Array(count)
              .fill(0)
              .map((_, index) => (
                <ProductGridSkeleton key={index} />
              ))}
          </View>
        </View>
      </View>
    </View>
  );
};

export default BestSellerSkeleton;
