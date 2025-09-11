import { Image } from "expo-image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Pressable } from "react-native";

import { FlatList } from "react-native";

import { useNavigation } from "@react-navigation/native";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deepEqual } from "fast-equals";
import { View } from "react-native";
import Gallery, { GalleryItem } from "~/components/common/Galery";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { getErrorMessage, screen } from "~/utils";
import { flashSaleService } from "~/services/api/flashsale.service";
import { productService } from "~/services/api/product.service";
const ListImage = ({ id }: { id: string | number }) => {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const queryClient = useQueryClient();
  const { data: productDetail, error } = useQuery({
    queryKey: ["flash-sale-product-detail", id],
    queryFn: () => flashSaleService.getFlashItemDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    select: (data) => {
      return {
        images: data?.flashSaleProduct?.images,
        upsellIds: data?.flashSaleProduct?.upsellIds,
        variations: data?.flashSaleProduct?.variations,
      };
    },
  });

  useQuery({
    queryKey: ["topProducts", id, ...(productDetail?.upsellIds || [])],
    queryFn: () =>
      productService.searchProducts({
        ids: productDetail?.upsellIds?.join(","),
        take: 10,
      }),
    enabled: !!productDetail?.upsellIds && productDetail?.upsellIds.length > 0,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    setImages(
      productDetail?.images?.map((image) => ({
        url: image,
        type: "image",
      })) ?? []
    );
  }, [productDetail]);

  useEffect(() => {
    if (
      flatListRef.current &&
      currentIndex !== undefined &&
      images.length > 0 &&
      !isGalleryVisible
    ) {
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: false,
      });
    }
  }, [isGalleryVisible]);

  useEffect(() => {
    if (error) {
      const errorMessage = getErrorMessage(error, "Sản phẩm không tồn tại");
      toast.error(errorMessage);
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey.includes("flash-sale") ||
          query.queryKey.includes("home"),
      });
      navigation.goBack();
    }
  }, [error]);

  const isSoldOut = useMemo(() => {
    const totalStock = productDetail?.variations?.reduce(
      (acc, variation) => acc + (variation.stock ?? 0),
      0
    );
    return totalStock === 0;
  }, [productDetail]);

  return (
    <View
      style={{
        minHeight: screen.width,
      }}
      className="bg-white relative"
    >
      <FlatList
        ref={flatListRef}
        className="rounded-b-[32px] overflow-hidden"
        data={images}
        horizontal
        viewabilityConfig={{
          itemVisiblePercentThreshold: 100,
        }}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
          }
        }}
        keyExtractor={(item, index) => index.toString()}
        getItemLayout={(data, index) => ({
          length: screen.width,
          offset: screen.width * index,
          index,
        })}
        windowSize={3}
        initialNumToRender={3}
        maxToRenderPerBatch={3}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        renderItem={({ item, index }) => (
          <Pressable
            key={index}
            onPress={() => {
              setCurrentIndex(index);
              setIsGalleryVisible(true);
            }}
          >
            <Image
              source={{
                uri: item.url,
              }}
              style={{
                width: screen.width,
                aspectRatio: 1,
              }}
              contentFit="cover"
            />
          </Pressable>
        )}
      />
      <View className="absolute right-3 bottom-3 rounded-2xl bg-[#E3E3E3] px-3 py-1">
        <Text>
          {currentIndex + 1}/{images.length}
        </Text>
      </View>
      <Gallery
        visible={isGalleryVisible}
        images={images}
        initialIndex={currentIndex}
        onChangeIndex={(index) => setCurrentIndex(index)}
        onClose={() => setIsGalleryVisible(false)}
      />
      {isSoldOut && (
        <View className="absolute inset-0 flex justify-center items-center z-10">
          <View className="bg-black/50 rounded-full p-4">
            <Text className="text-white text-center text-2xl font-bold">
              Hết hàng
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default React.memo(ListImage, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
