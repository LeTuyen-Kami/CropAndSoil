import { Image } from "expo-image";
import {
  FlatList,
  Pressable,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { imagePaths } from "~/assets/imagePath";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Gallery, { GalleryItem } from "~/components/common/Galery";
import { screen } from "~/utils";
import Info from "./Info";
import Rating from "./Rating";
const Header = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View className="absolute z-10 px-4 w-full" style={{ top: top }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 bg-[#E3E3E3] rounded-full items-center justify-center"
      >
        <Image
          source={imagePaths.backArrow}
          cachePolicy="memory"
          style={{
            width: 8,
            height: 16,
            tintColor: "#AEAEAE",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const DetailProduct = () => {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState<GalleryItem[]>([]);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setImages([
      { url: "https://picsum.photos/seed/seed1/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed2/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed3/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed4/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed5/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed6/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed7/200/200", type: "image" },
      { url: "https://picsum.photos/seed/seed8/200/200", type: "image" },
    ]);
  }, []);

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

  console.log("render");

  return (
    <ScreenContainer
      safeArea={false}
      paddingHorizontal={0}
      paddingVertical={0}
      paddingBottom={0}
      scrollable={false}
    >
      <Header />
      <ScrollView>
        <View>
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
        </View>
        <Info />
        <Rating />
      </ScrollView>
      <Gallery
        visible={isGalleryVisible}
        images={images}
        initialIndex={currentIndex}
        onChangeIndex={(index) => setCurrentIndex(index)}
        onClose={() => setIsGalleryVisible(false)}
      />
    </ScreenContainer>
  );
};

export default DetailProduct;
