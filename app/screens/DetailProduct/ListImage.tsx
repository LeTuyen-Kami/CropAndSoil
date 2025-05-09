import { Image } from "expo-image";
import React, { useEffect, useRef, useState } from "react";
import { Pressable } from "react-native";

import { FlatList } from "react-native";

import { useQuery } from "@tanstack/react-query";
import { deepEqual } from "fast-equals";
import { View } from "react-native";
import Gallery, { GalleryItem } from "~/components/common/Galery";
import { Text } from "~/components/ui/text";
import { productService } from "~/services/api/product.service";
import { shopService } from "~/services/api/shop.service";
import { getErrorMessage, screen } from "~/utils";
import { AxiosError } from "axios";
import { useNavigation } from "@react-navigation/native";
import { toast } from "~/components/common/Toast";
const ListImage = ({ id }: { id: string | number }) => {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation();
  const { data: productDetail, error } = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => productService.getProductDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    select: (data) => {
      return {
        images: data?.images,
        upsellIds: data?.upsellIds,
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
      navigation.goBack();
    }
  }, [error]);

  return (
    <View
      style={{
        minHeight: screen.width,
      }}
      className="bg-white"
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
    </View>
  );
};

export default React.memo(ListImage, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
