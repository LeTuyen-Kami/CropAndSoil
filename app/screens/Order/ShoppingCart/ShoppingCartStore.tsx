import { deepEqual } from "fast-equals";
import { memo, useCallback, useMemo } from "react";
import { View, ImageSourcePropType, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Text } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Checkbox from "expo-checkbox";
import ShoppingCartItem from "~/components/common/ShoppingCartItem";
import { Store } from "../types";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
import { ICalculateResponse } from "~/services/api/order.service";
import { convertToK } from "~/utils";
import { Variation } from "~/services/api/product.service";
const ShoppingCartStore = ({
  store,
  onItemSelect,
  onItemQuantityChange,
  onItemDelete,
  onSelectAllItems,
  onShopVoucherPress,
  calculatedData,
  onVariationChange,
}: {
  store: Store;
  onItemSelect: (storeId: string, itemId: string, selected: boolean) => void;
  onItemQuantityChange: (
    storeId: string,
    itemId: string,
    quantity: number
  ) => void;
  onItemDelete: (storeId: string, itemId: string) => void;
  onSelectAllItems: (storeId: string, selected: boolean) => void;
  onShopVoucherPress: (shopId: string) => void;
  calculatedData?: ICalculateResponse;
  onVariationChange: (
    storeId: string,
    itemId: string,
    variation: Variation
  ) => void;
}) => {
  const navigation = useNavigation<RootStackScreenProps<"ShoppingCart">>();

  const handleStoreSelect = useCallback(
    (selected: boolean) => {
      onSelectAllItems(store.id, selected);
    },
    [store.id, onSelectAllItems]
  );

  const handleItemSelect = useCallback(
    (id: string, selected: boolean) => {
      onItemSelect(store.id, id, selected);
    },
    [store.id, onItemSelect]
  );

  const handleQuantityChange = useCallback(
    (id: string, quantity: number) => {
      onItemQuantityChange(store.id, id, quantity);
    },
    [store.id, onItemQuantityChange]
  );

  const handleVariationChange = useCallback(
    (id: string, variation: Variation) => {
      onVariationChange(store.id, id, variation);
    },
    [store.id, onVariationChange]
  );

  const handleDeleteItem = useCallback(
    (id: string) => {
      onItemDelete(store.id, id);
    },
    [store.id, onItemDelete]
  );

  // Check if all items are selected
  const allItemsSelected =
    store.items.length > 0 && store.items.every((item) => item.isSelected);

  const orderShop = useMemo(() => {
    return calculatedData?.orderShops?.find(
      (orderShop) => orderShop.shop.id + "" === store.id + ""
    );
  }, [calculatedData]);

  return (
    <View className="overflow-hidden mx-2 bg-white rounded-2xl">
      {/* Store Header */}
      <View className="flex-row justify-between items-center p-3 border-b border-[#F5F5F5]">
        <View className="flex-row gap-2 items-center">
          <Checkbox
            value={allItemsSelected}
            onValueChange={handleStoreSelect}
            color={allItemsSelected ? "#159747" : undefined}
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "#CCC",
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          />
          <Image
            source={imagePaths.icShop}
            style={{ width: 18, height: 18, tintColor: "#676767" }}
          />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Shop", {
                id: store.id,
              });
            }}
          >
            <Text className="text-sm font-medium" numberOfLines={1}>
              {store.name}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Shop", {
              id: store.id,
            });
          }}
        >
          <Feather name="chevron-right" size={20} color="#676767" />
        </TouchableOpacity>
      </View>

      {/* Store Items */}
      {store.items.map((item, index) => (
        <ShoppingCartItem
          key={item.id}
          id={item.id}
          productId={item.productId}
          variationId={item?.variation?.id?.toString?.()}
          name={item.name}
          image={item.image}
          price={item?.variation?.salePrice || 0}
          originalPrice={item?.variation?.regularPrice || 0}
          type={item?.variation?.name || ""}
          quantity={item.quantity}
          isSelected={item.isSelected}
          onSelect={handleItemSelect}
          onQuantityChange={handleQuantityChange}
          onDelete={handleDeleteItem}
          variations={item?.variations || []}
          onVariationChange={handleVariationChange}
        />
      ))}

      {/* Voucher Section */}
      <TouchableOpacity
        className="flex-row justify-between items-center p-4"
        onPress={() => onShopVoucherPress(store.id)}
      >
        <View className="flex-row flex-1 gap-2 items-center">
          <Image
            source={imagePaths.icTicketSale}
            style={{ width: 20, height: 20, tintColor: "#159747" }}
          />
          {orderShop?.shopProductVoucherDiscount ? (
            <Text className="flex-1 text-xs text-primary" numberOfLines={1}>
              Đã giảm ₫{convertToK(orderShop?.shopProductVoucherDiscount)}k
            </Text>
          ) : (
            <Text className="text-xs text-[#676767]">
              Thêm mã khuyến mãi của Shop
            </Text>
          )}
        </View>
        <Feather name="chevron-right" size={20} color="#AEAEAE" />
      </TouchableOpacity>
    </View>
  );
};

export default memo(ShoppingCartStore, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
