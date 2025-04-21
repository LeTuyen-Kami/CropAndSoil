import React from "react";
import { View, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { screen } from "~/utils";
import ContainerList from "~/screens/Home/ContainerList";

interface FlashSaleSkeletonProps {
  count?: number;
}

const ProductSkeleton = () => {
  return (
    <View
      style={{ width: 150 }}
      className="overflow-hidden bg-white rounded-2xl border shadow-sm border-neutral-200"
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
        <View className="flex-row gap-[6] items-center justify-between">
          <View className="h-[16] w-[70] bg-neutral-200 rounded-full animate-pulse" />
          <View className="h-[12] w-[40] bg-neutral-200 rounded-full animate-pulse" />
        </View>
        <View className="bg-neutral-200 rounded-full h-[14] w-full animate-pulse mt-1" />
      </View>
    </View>
  );
};

const FlashSaleSkeleton = ({ count = 5 }: FlashSaleSkeletonProps) => {
  return (
    <View>
      <View className="relative mt-10">
        <View className="mx-2 top-[-15] absolute left-0 right-0 h-[76] rounded-[40] bg-secondary-50 opacity-20" />
        <ContainerList
          bgColor="bg-primary-100"
          title="Flash Sale"
          icon={
            <View className="w-[40] h-[40] bg-neutral-200 rounded-full animate-pulse" />
          }
        >
          <View>
            <FlatList
              data={Array(count).fill(0)}
              horizontal
              renderItem={() => <ProductSkeleton />}
              ItemSeparatorComponent={() => <View className="w-2" />}
              keyExtractor={(_, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </ContainerList>
      </View>
    </View>
  );
};

export default FlashSaleSkeleton;
