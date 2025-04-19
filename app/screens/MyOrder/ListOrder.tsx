import { FlashList } from "@shopify/flash-list";
import ProductCart from "./ProductCart";
import { ActivityIndicator, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { usePagination } from "~/hooks/usePagination";
import { orderService } from "~/services/api/order.service";
import { formatPrice } from "~/utils";
import Empty from "~/components/common/Empty";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";

const ListOrder = ({ status }: { status?: string }) => {
  const {
    data,
    isLoading,
    isFetching,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
  } = usePagination(orderService.listOrder, {
    queryKey: ["my-order"],
    initialParams: {
      skip: 0,
      take: 10,
      status: status,
    },
  });

  const navigation = useSmartNavigation();

  const onViewDetails = (orderId: number) => {
    navigation.navigate("DetailOrder", { orderId });
  };

  return (
    <View className="flex-1 mt-3">
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
              imageUri: item.variation.thumbnail || item?.product?.thumbnail,
            }))}
            totalPrice={formatPrice(item.orderTotal)}
            quantity={item.items.length}
            onCancelOrder={() => {}}
            onViewDetails={() => onViewDetails(item.id)}
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
  );
};

export default ListOrder;
