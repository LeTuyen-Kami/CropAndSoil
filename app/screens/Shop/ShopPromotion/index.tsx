import { ActivityIndicator, FlatList, View } from "react-native";
import { useState } from "react";
import ShopPromotionItem from "./Item";
import useGetShopId from "../useGetShopId";
import { shopService } from "~/services/api/shop.service";
import { usePagination } from "~/hooks/usePagination";
import { formatDate, screen } from "~/utils";
import { formatCurrency } from "~/utils/format";
import { COLORS } from "~/constants/theme";
import { Text } from "~/components/ui/text";
import { toast } from "~/components/common/Toast";

const ShopPromotion = () => {
  const shopId = useGetShopId();

  const { data, hasNextPage, fetchNextPage, isFetching } = usePagination(
    shopService.getListVoucher,
    {
      queryKey: ["vouchers", (shopId || "")?.toString()],
      enabled: !!shopId,
      initialParams: {
        shopId: shopId,
      },
    }
  );

  const onPress = (id: string) => {
    toast.success("Đã lưu voucher");
  };

  if (!data || !data.length) {
    return null;
  }

  return (
    <View className="bg-white rounded-xl mb-2.5">
      <FlatList
        data={data}
        renderItem={({ item }) => (
          <ShopPromotionItem
            title={item.title}
            minOrder={`Đơn tối thiểu ${formatCurrency(
              item.minimumAmount || 0
            )}`}
            maxDiscount={`Đơn tối đa ${formatCurrency(
              item.maximumReduction || 0
            )}`}
            expiryDate={formatDate(item.expiryDate)}
            onPress={() => onPress(item.id.toString())}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 py-4"
        ItemSeparatorComponent={() => <View className="w-2" />}
        onEndReached={fetchNextPage}
        onEndReachedThreshold={0.8}
        ListFooterComponent={() =>
          hasNextPage && isFetching ? (
            <View className="justify-center items-center w-10 h-full">
              <ActivityIndicator size="small" color={COLORS.primary} />
            </View>
          ) : null
        }
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: screen.width / 2.5 - 16,
          offset: (screen.width / 2.5 - 16) * index,
          index,
        })}
      />
    </View>
  );
};

export default ShopPromotion;
