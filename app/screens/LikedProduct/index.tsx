import { TouchableOpacity, View } from "react-native";
import GradientBackground from "~/components/common/GradientBackground";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import Badge from "~/components/common/Badge";
import { FlashList } from "@shopify/flash-list";
import ProductItem from "~/components/common/ProductItem";
import { screen } from "~/utils";
import { cn } from "~/lib/utils";
const LikedProductScreen = () => {
  const { top } = useSafeAreaInsets();

  return (
    <ScreenContainer
      safeArea={false}
      paddingHorizontal={0}
      paddingVertical={0}
      paddingBottom={0}
    >
      <GradientBackground
        gradientStyle={{ paddingTop: top, paddingBottom: 24 }}
      >
        <Header
          title="Lượt thích"
          className="bg-transparent border-0"
          textColor="white"
          leftClassName="w-10"
          rightComponent={
            <TouchableOpacity>
              <View className="relative items-end w-10">
                <Image
                  source={imagePaths.icMessages}
                  style={{ width: 24, height: 24 }}
                />
                <Badge count={9} className="absolute -top-[10] -right-[10]" />
              </View>
            </TouchableOpacity>
          }
        />
      </GradientBackground>
      <View className="flex-1  pt-5 pb-3 bg-[#EEE] rounded-t-[28px] -mt-6">
        <FlashList
          data={[...Array(10)]}
          ItemSeparatorComponent={() => <View className="h-2" />}
          numColumns={2}
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <ProductItem
              className={index % 2 === 0 ? "ml-2 mr-1" : "ml-3"}
              width={(screen.width - 24) / 2}
              name={
                "Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123 "
              }
              price={100000}
              originalPrice={150000}
              discount={20}
              footer={
                <View className="flex-row gap-2 justify-between items-center">
                  <TouchableOpacity hitSlop={20}>
                    <Image
                      source={imagePaths.icTrash}
                      className="size-5"
                      style={{ tintColor: "#545454" }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    hitSlop={20}
                    className="p-1 rounded-full bg-primary"
                  >
                    <Image source={imagePaths.icCart} className="size-4" />
                  </TouchableOpacity>
                </View>
              }
            />
          )}
          ListFooterComponent={() => (
            <View className="rounded-[28px] bg-white">
              <Text className="px-2 py-3 text-sm font-medium leading-tight">
                Có thể bạn cũng thích
              </Text>
              <View className="flex-row flex-wrap gap-2 px-2 mt-2">
                {Array.from({ length: 10 }).map((_, index) => (
                  <ProductItem
                    key={index}
                    width={(screen.width - 24) / 2}
                    name={
                      "Voluptate irure in laboris sit sunt pariatur. Sit  Voluptate irure in 123 "
                    }
                    price={100000}
                    originalPrice={150000}
                    discount={20}
                    footer={
                      <View className="flex-row gap-2 justify-between items-center">
                        <TouchableOpacity hitSlop={20}>
                          <Image
                            source={imagePaths.icTrash}
                            className="size-5"
                            style={{ tintColor: "#545454" }}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          hitSlop={20}
                          className="p-1 rounded-full bg-primary"
                        >
                          <Image
                            source={imagePaths.icCart}
                            className="size-4"
                          />
                        </TouchableOpacity>
                      </View>
                    }
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </ScreenContainer>
  );
};

export default LikedProductScreen;
