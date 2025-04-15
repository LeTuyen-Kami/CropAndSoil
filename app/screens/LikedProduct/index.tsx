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
import { calculateDiscount, getErrorMessage, screen } from "~/utils";
import { cn } from "~/lib/utils";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useMutation, useQuery } from "@tanstack/react-query";
import { wishlistService } from "~/services/api/wishlist.service";
import { productService } from "~/services/api/product.service";
import { toast } from "~/components/common/Toast";
import Empty from "~/components/common/Empty";
import { RefreshControl } from "react-native-gesture-handler";
const LikedProductScreen = () => {
  const { top, bottom } = useSafeAreaInsets();

  const {
    data,
    refetch,
    isFetching: isFetchingWishlist,
    isLoading: isLoadingWishlist,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
  });

  const { data: recommendedProduct, isFetching: isFetchingRecommendedProduct } =
    useQuery({
      queryKey: ["recommended-product"],
      queryFn: () => productService.getRecommendedProducts(),
    });

  const mutationRemoveWishlist = useMutation({
    mutationFn: (productId: string) =>
      wishlistService.removeWishlist(productId),
    onSuccess: () => {
      toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích");
      refetch();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Lỗi khi xóa sản phẩm khỏi danh sách yêu thích")
      );
    },
  });

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Lượt thích"
        className="bg-transparent border-0"
        textColor="white"
        leftClassName="w-10"
        hasSafeTop={false}
        rightComponent={
          <TouchableOpacity>
            <View className="relative items-end w-10">
              <Image
                source={imagePaths.icMessages}
                style={{ width: 24, height: 24 }}
              />
              {/* <Badge count={9} className="absolute -top-[10] -right-[10]" /> */}
            </View>
          </TouchableOpacity>
        }
      />
      <View className="flex-1 bg-[#EEE] rounded-t-2xl overflow-hidden">
        <FlashList
          data={data}
          ItemSeparatorComponent={() => <View className="h-2" />}
          numColumns={2}
          ListEmptyComponent={() => (
            <Empty
              title="Không có sản phẩm yêu thích"
              isLoading={isLoadingWishlist}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingWishlist}
              onRefresh={refetch}
            />
          }
          contentContainerClassName="pt-2"
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <ProductItem
              className={index % 2 === 0 ? "ml-2 mr-1" : "ml-3"}
              width={(screen.width - 24) / 2}
              name={item?.name}
              id={item?.id}
              price={item?.salePrice}
              originalPrice={item?.regularPrice}
              discount={calculateDiscount(item)}
              image={item?.thumbnail}
              footer={
                <View className="flex-row gap-2 justify-between items-center">
                  <TouchableOpacity
                    hitSlop={20}
                    onPress={() =>
                      mutationRemoveWishlist.mutate(String(item?.id))
                    }
                  >
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
            <View
              className="rounded-[28px] bg-white mt-2"
              style={{ marginBottom: bottom }}
            >
              <Text className="px-2 py-0 pt-3 text-base font-medium leading-tight">
                Có thể bạn cũng thích
              </Text>
              <View className="flex-row flex-wrap gap-2 px-2 py-3">
                {recommendedProduct?.map((item, index) => (
                  <ProductItem
                    width={(screen.width - 24) / 2}
                    key={item.id}
                    name={item.name}
                    price={item.salePrice}
                    originalPrice={item.regularPrice}
                    discount={calculateDiscount(item)}
                    rating={item.averageRating}
                    soldCount={item.totalSales}
                    location={item.shop?.shopWarehouseLocation?.province?.name}
                    id={item.id}
                    image={item.thumbnail}
                    className="flex-grow"
                  />
                ))}
              </View>
            </View>
          )}
        />
      </View>
    </ScreenWrapper>
  );
};

export default LikedProductScreen;
