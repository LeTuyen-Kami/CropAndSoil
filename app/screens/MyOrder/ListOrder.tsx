import { FlashList } from "@shopify/flash-list";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { ActivityIndicator, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import Empty from "~/components/common/Empty";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import { usePagination } from "~/hooks/usePagination";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { orderService } from "~/services/api/order.service";
import { confirmAtom } from "~/store/atoms";
import { formatPrice, getErrorMessage } from "~/utils";
import {
  ORDER_STATUS,
  ORDER_STATUS_COLOR,
  ORDER_STATUS_TEXT,
} from "~/utils/contants";
import ProductCart from "./ProductCart";
import { modalRefundAtom } from "./atoms";
const ListOrder = ({ status }: { status?: string }) => {
  const navigation = useSmartNavigation();
  const queryClient = useQueryClient();
  const setModalRefund = useSetAtom(modalRefundAtom);

  const {
    data,
    isLoading,
    isFetching,
    isRefresh,
    refresh,
    hasNextPage,
    fetchNextPage,
  } = usePagination(orderService.listOrder, {
    queryKey: ["my-order", status || ""],
    initialParams: {
      skip: 0,
      take: 10,
      statusKey: status,
    },
  });

  const setConfirmState = useSetAtom(confirmAtom);

  const mutationCancelOrder = useMutation({
    mutationFn: (orderId: number) => orderService.cancel(orderId.toString()),
  });

  const onViewDetails = (orderId: number) => {
    navigation.navigate("DetailOrder", { orderId });
  };

  const handleCancelOrder = (orderId: number) => {
    setConfirmState({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      onConfirm: () => {
        toggleLoading(true);
        mutationCancelOrder.mutate(orderId, {
          onSuccess: () => {
            toast.success("Đơn hàng đã được hủy");
            refresh();
            queryClient.invalidateQueries({
              predicate: (query) =>
                query.queryKey?.includes("home") ||
                query.queryKey?.includes("flash-sale"),
            });
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi khi hủy đơn hàng"));
          },
          onSettled: () => {
            toggleLoading(false);
          },
        });
      },
      onCancel: () => {
        console.log("Cancel order");
      },
      isOpen: true,
    });
  };

  const getStatusInfo = (status?: string) => {
    if (!status) return { label: "Không xác định", color: "bg-gray-500" };

    const statusInfo = Object.keys(ORDER_STATUS_TEXT).find((key) => {
      return key.includes(status);
    });

    return {
      label: ORDER_STATUS_TEXT[statusInfo as keyof typeof ORDER_STATUS_TEXT],
      color: ORDER_STATUS_COLOR[statusInfo as keyof typeof ORDER_STATUS_COLOR],
    };
  };

  return (
    <View className="flex-1 mt-3">
      <FlashList
        data={data}
        ListEmptyComponent={() => (
          <Empty title="Không có đơn hàng" isLoading={isLoading} />
        )}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-2.5" />}
        renderItem={({ item }) => (
          <ProductCart
            shopName={item.shop?.shopName}
            products={item.items.map((item) => ({
              name: item.product?.name,
              type: item.variation?.name,
              quantity: item.quantity,
              originalPrice: formatPrice(item.variation?.regularPrice),
              discountedPrice: formatPrice(item.variation?.salePrice),
              imageUri: item.variation?.thumbnail || item?.product?.thumbnail,
              productId: item.product?.id,
            }))}
            status={!status ? getStatusInfo(item?.status).label : undefined}
            statusColor={
              !status ? getStatusInfo(item?.status).color : undefined
            }
            totalPrice={formatPrice(item.orderTotal)}
            quantity={item.items.length}
            onCancelOrder={
              status === ORDER_STATUS.PENDING ||
              status === ORDER_STATUS.PROCESSING ||
              ORDER_STATUS.PENDING?.includes(item?.status) ||
              ORDER_STATUS.PROCESSING?.includes(item?.status)
                ? () => handleCancelOrder(item.id)
                : undefined
            }
            onViewDetails={() => onViewDetails(item.id)}
            shopId={item.shop?.id}
            onReturnOrder={
              item?.status &&
              (status === ORDER_STATUS.DELIVERED ||
                ORDER_STATUS.DELIVERED?.includes(item?.status)) &&
              item?.isRefundable
                ? () => {
                    setModalRefund({
                      visible: true,
                      orderId: item.id,
                      onSuccess: () => {
                        refresh();
                        queryClient.invalidateQueries({
                          queryKey: ["my-order", ORDER_STATUS.RETURNED],
                        });
                      },
                    });
                  }
                : undefined
            }
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
