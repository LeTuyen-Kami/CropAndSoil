import { Image } from "expo-image";
import {
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import { FlashList } from "@shopify/flash-list";
import { orderService } from "~/services/api/order.service";
import { usePagination } from "~/hooks/usePagination";
import { useEffect, useState } from "react";
import { useDebounce } from "~/hooks/useDebounce";
import Empty from "~/components/common/Empty";
import ProductCart from "../ProductCart";
import { formatPrice } from "~/utils";
import { ORDER_STATUS_COLOR } from "~/utils/contants";
import { ORDER_STATUS_TEXT } from "~/utils/contants";
const SearchOrder = () => {
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const {
    data,
    isLoading,
    isFetching,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
    updateParams,
  } = usePagination(orderService.search, {
    queryKey: ["my-order-search"],
  });

  useEffect(() => {
    updateParams({ search: debouncedSearch });
  }, [debouncedSearch]);

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        hasSafeTop={false}
        title="Tìm kiếm đơn hàng"
        className="bg-transparent border-0"
        textColor="white"
        rightComponent={
          <TouchableOpacity className="flex-row justify-end w-10">
            <Image
              source={imagePaths.icMessages}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        }
      />
      <View className="flex-1 bg-[#EEE] rounded-t-2xl">
        <View className="m-2">
          <Input
            placeholder="Tìm Mã đơn hàng, Nhà bán, Tên sản phẩm"
            textInputClassName="text-sm leading-4"
            leftIcon={<Feather name="search" size={18} color="#AEAEAE" />}
            value={search}
            onChangeText={setSearch}
            clearable
          />
        </View>
        <FlashList
          data={data}
          ListEmptyComponent={() => (
            <Empty title="Không có đơn hàng" isLoading={isLoading} />
          )}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          renderItem={({ item }) => (
            <ProductCart
              shopName={item.shop.shopName}
              products={item.items.map((item) => ({
                name: item.product.name,
                type: item.variation.name,
                quantity: item.quantity,
                originalPrice: formatPrice(item.variation.regularPrice),
                discountedPrice: formatPrice(item.variation.salePrice),
                imageUri: item.variation.thumbnail,
              }))}
              status={ORDER_STATUS_TEXT[item.status]}
              statusColor={ORDER_STATUS_COLOR[item.status]}
              totalPrice={formatPrice(item.orderTotal)}
              quantity={item.items.length}
              onCancelOrder={() => {}}
              onViewDetails={() => {}}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
          }
          estimatedItemSize={200}
          ListFooterComponent={() => (
            <View className="h-2.5 items-center justify-center">
              {hasNextPage && isFetching && <ActivityIndicator />}
            </View>
          )}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
        />
      </View>
    </ScreenWrapper>
  );
};

export default SearchOrder;
