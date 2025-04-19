import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";

type OrderItemAttribute = {
  slug: string;
  optionSlug: string;
};

type OrderItem = {
  name: string;
  productId: number;
  variationId: number;
  quantity: number;
  subtotal: number;
  total: number;
  attributes?: OrderItemAttribute[];
  product: {
    thumbnail: string;
  };
  variation: {
    thumbnail: string;
    name: string;
  };
};

type OrderItemsProps = {
  items?: OrderItem[];
  navigationToProduct: (productId: string) => void;
};

const OrderItems: React.FC<OrderItemsProps> = ({
  items,
  navigationToProduct,
}) => {
  if (!items || items.length === 0) {
    return (
      <View className="py-2">
        <Text className="text-gray-500">Không có sản phẩm</Text>
      </View>
    );
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  return (
    <View className="space-y-4">
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          className="flex-row pb-4"
          onPress={() => navigationToProduct(item.productId + "")}
        >
          <View className="overflow-hidden mr-3 w-20 h-20 bg-gray-100 rounded-md">
            <Image
              source={{
                uri: item.variation.thumbnail || item.product.thumbnail,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text className="text-sm font-medium" numberOfLines={2}>
              {item.name}
            </Text>

            {!!item.variation.name && (
              <Text className="mt-1 text-xs text-gray-500">
                Phân loại: {item.variation.name}
              </Text>
            )}

            <View className="flex-row justify-between mt-2">
              <Text className="text-sm text-gray-500">x{item.quantity}</Text>
              <Text className="text-sm font-medium">
                {formatPrice(item.total)}
              </Text>
            </View>

            {item.subtotal !== item.total && (
              <View className="flex-row justify-end mt-1">
                <Text className="text-xs text-gray-500 line-through">
                  {formatPrice(item.subtotal)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default OrderItems;
