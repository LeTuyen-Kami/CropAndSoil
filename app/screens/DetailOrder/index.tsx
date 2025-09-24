import {
  View,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { userService } from "~/services/api/user.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import { RootStackRouteProp } from "~/navigation/types";
import { orderService } from "~/services/api/order.service";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderItems from "./OrderItems";
import OrderSummary from "./OrderSummary";
import PaymentInfo from "./PaymentInfo";
import ShippingInfo from "./ShippingInfo";
import AddressItem from "./AddressItem";
import { formatDate, getErrorMessage } from "~/utils";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { ORDER_STATUS } from "~/utils/contants";
import { useMemo, useState } from "react";
import ModalOrderRefund from "~/components/common/ModalOrderRefund";
import { confirmAtom } from "~/store/atoms";
import { useSetAtom } from "jotai";
import { toast } from "~/components/common/Toast";
import { toggleLoading } from "~/components/common/ScreenLoading";

const DetailOrder = () => {
  const route = useRoute<RootStackRouteProp<"DetailOrder">>();
  const { orderId } = route.params;
  const navigation = useSmartNavigation();

  const {
    data: order,
    refetch: refetchOrder,
    isRefetching,
    isLoading,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderService.detail(orderId!.toString()),
    enabled: !!orderId,
  });
  const [isVisibleModalRefund, setIsVisibleModalRefund] = useState(false);
  const setConfirmState = useSetAtom(confirmAtom);
  const queryClient = useQueryClient();

  const mutationCancelOrder = useMutation({
    mutationFn: (orderId: number) => orderService.cancel(orderId.toString()),
  });

  const navigationToShop = () => {
    navigation.navigate("Shop", { id: order?.shop?.id });
  };

  const navigationToProduct = (productId: string) => {
    navigation.navigate("DetailProduct", { id: productId });
  };

  const handleCancelOrder = () => {
    setConfirmState({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      onConfirm: () => {
        toggleLoading(true);
        mutationCancelOrder.mutate(orderId, {
          onSuccess: () => {
            toast.success("Đơn hàng đã được hủy");
            refetchOrder();
            navigation.smartGoBack();

            queryClient.invalidateQueries({
              queryKey: ["my-order", ORDER_STATUS.PENDING],
            });

            queryClient.invalidateQueries({
              queryKey: ["my-order", ORDER_STATUS.CANCELLED],
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

  const handleReturnOrder = () => {
    setIsVisibleModalRefund(true);
  };

  // Helper function to determine which buttons to show based on order status
  const actionButtons = useMemo(() => {
    const buttons = [];

    // Show cancel button for pending/processing orders
    if (
      (order?.status && ORDER_STATUS.PENDING?.includes(order.status)) ||
      (order?.status && ORDER_STATUS.PROCESSING?.includes(order.status))
    ) {
      buttons.push({
        key: "cancel",
        title: "Hủy đơn hàng",
        onPress: handleCancelOrder,
        variant: "outline" as const,
        className: "border-red-500 active:bg-red-50",
        textClassName: "text-red-500",
      });
    }

    // Show return button for delivered orders (check if refundable)
    if (
      order?.status &&
      ORDER_STATUS.DELIVERED?.includes(order.status) &&
      order?.isRefundable
    ) {
      buttons.push({
        key: "return",
        title: "Đổi trả",
        onPress: handleReturnOrder,
        variant: "outline" as const,
        className: "border-orange-500 active:bg-orange-50",
        textClassName: "text-orange-500",
      });
    }

    return buttons;
  }, [order]);

  const renderLoadingScreen = () => (
    <View className="rounded-t-[16px] overflow-hidden bg-white flex-1 items-center justify-center pt-10">
      <ActivityIndicator size="large" color="#2D946E" />
      <Text className="mt-4 text-gray-600">Đang tải thông tin đơn hàng...</Text>
    </View>
  );

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        textColor="white"
        title="Chi tiết đơn hàng"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />

      {isLoading ? (
        renderLoadingScreen()
      ) : (
        <ScrollView
          className="rounded-t-[16px] overflow-hidden bg-white flex-1"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetchOrder}
            />
          }
        >
          {/* Order Header with ID and Status */}
          <View className="bg-[#F5F5F5] p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-base font-medium">
                Đơn hàng #{order?.id}
              </Text>
              <OrderStatusBadge status={order?.status} />
            </View>
            {!!order?.createdAt && (
              <Text className="text-sm text-gray-500">
                Ngày đặt: {formatDate(order.createdAt, "DD/MM/YYYY HH:mm")}
              </Text>
            )}
          </View>

          {/* Shipping Address */}
          {!!order?.shipping && (
            <View className="p-4 bg-white border-b border-gray-100">
              <Text className="mb-2 text-base font-medium">
                Địa chỉ giao hàng
              </Text>
              <AddressItem
                address={{
                  name: order.shipping.name,
                  phone: order.shipping.phone,
                  addressLineText: order.shipping.addressLineText,
                  addressWardText: order.shipping.addressWardText,
                  addressDistrictText: order.shipping.addressDistrictText,
                  addressProvinceText: order.shipping.addressProvinceText,
                }}
              />
            </View>
          )}

          {/* Order Items */}
          <View className="p-4 bg-white border-b border-gray-100">
            <TouchableOpacity
              className="flex-row gap-2 items-center mb-2"
              onPress={navigationToShop}
            >
              <Image
                source={imagePaths.icShop}
                style={{ width: 20, height: 20, tintColor: "#383B45" }}
              />
              <Text className="font-medium ext-base">
                {order?.shop?.shopName}
              </Text>
            </TouchableOpacity>
            <OrderItems
              items={order?.items}
              navigationToProduct={navigationToProduct}
            />
          </View>

          {/* Shipping Method */}
          <View className="p-4 bg-white border-b border-gray-100">
            <ShippingInfo shippingMethod={order?.shippingMethod} />
          </View>

          {/* Payment Method */}
          <View className="p-4 bg-white border-b border-gray-100">
            <PaymentInfo
              paymentMethod={order?.paymentMethod}
              orderStatus={order?.status}
              paymentToken={order?.paymentToken}
            />
          </View>

          {/* Note */}
          {!!order?.note && (
            <View className="p-4 bg-white border-b border-gray-100">
              <Text className="mb-2 text-base font-medium">Ghi chú</Text>
              <Text className="text-sm">{order.note}</Text>
            </View>
          )}

          {/* Order Summary */}
          <View className="p-4 bg-white">
            <OrderSummary
              items={order?.items}
              fees={order?.fees}
              vouchers={order?.vouchers}
              orderTotal={order?.orderTotal}
              cartDiscount={order?.cartDiscount}
              shippingFee={order?.shippingMethod?.total}
            />
          </View>

          {/* Action Buttons */}
          {actionButtons.length > 0 && (
            <View className="p-4 bg-white border-t border-gray-100">
              <View className="flex-row justify-end items-center gap-1.5">
                {actionButtons.map((button) => (
                  <Button
                    key={button.key}
                    variant={button.variant}
                    onPress={button.onPress}
                    className={button.className}
                  >
                    <Text
                      className={`text-sm font-medium leading-[20px] text-center ${button.textClassName}`}
                    >
                      {button.title}
                    </Text>
                  </Button>
                ))}
              </View>
            </View>
          )}

          <View className="h-[100px]" />
        </ScrollView>
      )}
      <ModalOrderRefund
        visible={isVisibleModalRefund}
        onClose={() => {
          setIsVisibleModalRefund(false);
        }}
        orderId={orderId!}
        onSuccess={() => {
          refetchOrder();
        }}
      />
    </ScreenWrapper>
  );
};

export default DetailOrder;
