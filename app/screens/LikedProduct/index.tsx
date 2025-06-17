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
import {
  calculateDiscount,
  calculateOnSale,
  checkCanRender,
  getErrorMessage,
  getItemWidth,
  preHandleFlashListData,
  screen,
} from "~/utils";
import { cn } from "~/lib/utils";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "~/services/api/wishlist.service";
import { IProduct, productService } from "~/services/api/product.service";
import { toast } from "~/components/common/Toast";
import Empty from "~/components/common/Empty";
import { RefreshControl } from "react-native-gesture-handler";
import React, { useMemo, useState } from "react";
import { deepEqual } from "fast-equals";
import { IFlashSaleProduct } from "~/services/api/flashsale.service";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { useAtomValue } from "jotai";
import { authAtom } from "~/store/atoms";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cartService } from "~/services/api/cart.service";
import SelectVariation from "~/components/common/SelectVariation";

const MaybeLike = () => {
  const { top, bottom } = useSafeAreaInsets();

  const { data: recommendedProduct, isFetching: isFetchingRecommendedProduct } =
    useQuery({
      queryKey: ["recommended-product"],
      queryFn: () => productService.getRecommendedProducts(),
    });

  if (!checkCanRender(recommendedProduct)) return null;

  return (
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
            onSale={calculateOnSale(item)}
          />
        ))}
      </View>
    </View>
  );
};

const TwoProductItem = ({
  items,
  onRemove,
  onAddToCart,
}: {
  items: IProduct[];
  onRemove: (productId: string) => void;
  onAddToCart: (product: IProduct) => void;
}) => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View
      className="flex-row gap-2 px-2 bg-[#EEE] pb-2"
      style={{
        alignItems: "stretch",
      }}
    >
      {items.map((item, index) => (
        <ProductItem
          key={item?.id}
          className="flex-1"
          width={width}
          name={item?.name}
          id={item?.id}
          price={item?.salePrice}
          originalPrice={item?.regularPrice}
          discount={calculateDiscount(item)}
          image={item?.thumbnail}
          onSale={calculateOnSale(item)}
          footer={
            <View className="flex-row gap-2 justify-between items-center mt-auto">
              <TouchableOpacity
                hitSlop={20}
                onPress={() => onRemove(String(item?.id))}
              >
                <Image
                  source={imagePaths.icTrash}
                  className="size-5"
                  style={{ tintColor: "#545454" }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                hitSlop={20}
                onPress={() => onAddToCart(item)}
                className="p-1 rounded-full bg-primary"
              >
                <Image source={imagePaths.icCart} className="size-4" />
              </TouchableOpacity>
            </View>
          }
        />
      ))}
    </View>
  );
};

const MemoizedMaybeLike = React.memo(MaybeLike, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});

type Variation = IProduct["variations"][0];

const LikedProductScreen = () => {
  const {
    data,
    refetch,
    isFetching: isFetchingWishlist,
    isLoading: isLoadingWishlist,
    isRefetching: isRefetchingWishlist,
  } = useQuery({
    queryKey: ["wishlist"],
    queryFn: () => wishlistService.getWishlist(),
  });

  const auth = useAtomValue(authAtom);
  const navigation = useSmartNavigation();
  const [showVariations, setShowVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const [currentProduct, setCurrentProduct] = useState<IProduct | null>(null);

  const mutationAddToCart = useMutation({
    mutationFn: () => {
      if (!selectedVariation) return Promise.reject("No variation selected");
      return cartService.addToCart({
        productId: currentProduct?.id!,
        quantity: quantity,
        isChecked: true,
        variationId: selectedVariation.id,
      });
    },
    onMutate: () => {
      toggleLoading(true);
    },
    onSuccess: () => {
      toast.success("Thêm vào giỏ hàng thành công");
      setShowVariations(false);
      setQuantity(1);
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Thêm vào giỏ hàng thất bại"));
    },
    onSettled: () => {
      toggleLoading(false);
    },
  });

  const mutationRemoveWishlist = useMutation({
    mutationFn: (productId: string) =>
      wishlistService.removeWishlist(productId),
    onMutate: () => {
      toggleLoading(true);
    },
    onSuccess: async () => {
      toast.success("Đã xóa sản phẩm khỏi danh sách yêu thích");
      await refetch();
      toggleLoading(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Lỗi khi xóa sản phẩm khỏi danh sách yêu thích")
      );
      toggleLoading(false);
    },
  });

  const handleAddToCart = (product: IProduct) => {
    if (!auth?.isLoggedIn) {
      navigation.smartNavigate("Login");
      return;
    }

    setQuantity(1);

    setCurrentProduct(product);

    setShowVariations(true);
  };

  const handleConfirmAction = () => {
    mutationAddToCart.mutate();
  };

  const handledData = useMemo(() => {
    if (!data) return [];

    return preHandleFlashListData(data, "product");
  }, [data]);

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
          data={handledData}
          ItemSeparatorComponent={() => <View className="h-2" />}
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
          showsVerticalScrollIndicator={false}
          contentContainerClassName="pt-2"
          estimatedItemSize={200}
          renderItem={({ item, index }) => (
            <TwoProductItem
              items={item.items}
              onRemove={mutationRemoveWishlist.mutate}
              onAddToCart={handleAddToCart}
            />
          )}
          ListFooterComponent={<MemoizedMaybeLike />}
        />
      </View>

      <SelectVariation
        variations={currentProduct?.variations}
        isVisible={showVariations}
        onClose={() => setShowVariations(false)}
        onSelectVariation={(variation: Variation) => {
          setSelectedVariation(variation);
          setQuantity(1);
        }}
        selectedVariation={selectedVariation}
        onConfirm={handleConfirmAction}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </ScreenWrapper>
  );
};

export default LikedProductScreen;
