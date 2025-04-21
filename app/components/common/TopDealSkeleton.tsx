import React from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { screen } from "~/utils";
import ContainerList from "~/screens/Home/ContainerList";

interface TopDealSkeletonProps {
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

        <View className="flex-row gap-[2] items-center mt-2">
          <View className="h-[12] w-[12] bg-neutral-200 rounded-full animate-pulse" />
          <View className="h-[10] w-[80] bg-neutral-200 rounded-full animate-pulse ml-1" />
        </View>
      </View>
    </View>
  );
};

const TopDealSkeleton = ({ count = 4 }: TopDealSkeletonProps) => {
  return (
    <View className="bg-primary-100">
      <View className="mt-4">
        <ContainerList
          bgColor="bg-primary-50"
          title="TOP DEAL - SIÊU RẺ"
          icon={
            <View className="w-[40] h-[40] bg-neutral-200 rounded-full animate-pulse" />
          }
        >
          <View className="flex flex-row flex-wrap gap-2">
            {Array(count)
              .fill(0)
              .map((_, index) => (
                <ProductGridSkeleton key={index} />
              ))}
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

export default TopDealSkeleton;
