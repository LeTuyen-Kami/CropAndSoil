import { View, Text, TouchableOpacity, Image as RNImage } from "react-native";
import { Image } from "expo-image";
import { AntDesign } from "@expo/vector-icons";
import { imagePaths } from "~/assets/imagePath";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { isIOS } from "~/utils";
import { Button } from "~/components/ui/button";

interface ProductItemProps {
  name: string;
  type: string;
  quantity: number;
  originalPrice: string;
  discountedPrice: string;
  imageUri: string;
  productId: string | number;
}

interface ProductCartProps {
  shopName: string;
  products: ProductItemProps[];
  totalPrice?: string;
  onCancelOrder?: () => void;
  onViewDetails?: () => void;
  status?: string;
  quantity?: number;
  statusColor?: string;
  shopId: string | number;
  onReturnOrder?: () => void;
}

const ProductItem = ({
  name,
  type,
  quantity,
  originalPrice,
  discountedPrice,
  imageUri,
  productId,
}: ProductItemProps) => {
  const navigation = useSmartNavigation();

  const navigationToProduct = (productId: string) => {
    if (!productId) return;

    navigation.navigate("DetailProduct", { id: productId });
  };

  return (
    <TouchableOpacity
      className="flex-row gap-1.5 py-3"
      onPress={() => navigationToProduct(productId + "")}
    >
      <View className="flex-row p-2.5 justify-center items-center rounded-2xl border border-[#F0F0F0]">
        {isIOS ? (
          <RNImage
            source={{
              uri: imageUri,
            }}
            style={{ width: 64, height: 64, borderRadius: 8 }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={{ uri: imageUri }}
            className="w-[64px] h-[64px] rounded-lg"
            contentFit="contain"
          />
        )}
      </View>
      <View className="flex-1">
        <View className="self-stretch pb-1">
          <Text
            className="text-[#383B45] text-xs leading-[18px]"
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
        <View className="flex-row justify-between items-center self-stretch">
          <View className="flex-row items-center">
            <Text className="text-[#AEAEAE] text-[10px] leading-[14px]">
              {type}
            </Text>
          </View>
          <Text className="text-[#676767] text-[10px] leading-[14px]">
            x{quantity}
          </Text>
        </View>
        <View className="items-end self-stretch">
          <View className="flex-row items-center gap-1.5 py-1.5">
            {discountedPrice &&
              originalPrice &&
              discountedPrice !== originalPrice && (
                <View className="flex-row justify-center items-center">
                  <Text className="text-[#AEAEAE] text-xs leading-[18px] line-through">
                    {originalPrice}
                  </Text>
                </View>
              )}
            <View className="flex-row justify-center items-center">
              <Text className="text-[#676767] text-sm leading-[20px]">
                {discountedPrice || originalPrice}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ProductCart = ({
  shopName,
  products = [],
  totalPrice,
  onCancelOrder,
  onViewDetails,
  onReturnOrder,
  quantity,
  status,
  statusColor,
  shopId,
}: ProductCartProps) => {
  const navigation = useSmartNavigation();

  const onViewShop = () => {
    if (!shopId) return;

    navigation.navigate("Shop", { id: shopId });
  };

  return (
    <View className="px-2 w-full bg-white rounded-2xl">
      <View className="flex-row items-center justify-between gap-2.5 py-3">
        <TouchableOpacity
          className="flex-row gap-2 items-center"
          onPress={onViewShop}
        >
          <Image
            source={imagePaths.icShop}
            className="w-5 h-5"
            contentFit="contain"
            style={{ tintColor: "#383B45" }}
          />
          <Text
            className="text-[#383B45] text-sm font-medium leading-[20px]"
            numberOfLines={1}
          >
            {shopName}
          </Text>
        </TouchableOpacity>
        {status && (
          <View
            className="px-2 py-1 rounded-full"
            style={{ backgroundColor: statusColor }}
          >
            <Text className="text-white text-sm font-medium leading-[20px]">
              {status}
            </Text>
          </View>
        )}
      </View>

      {products.map((product, index) => (
        <ProductItem key={index} {...product} />
      ))}

      {totalPrice && (
        <View className="flex-row justify-end items-center self-stretch">
          <Text className="text-[#676767] text-sm leading-[20px]">
            Tổng số tiền ({quantity} sản phẩm):{" "}
            <Text className="text-[#383B45] text-sm leading-[20px]">
              {totalPrice}
            </Text>
          </Text>
        </View>
      )}

      <View className="flex-row justify-end items-center gap-1.5 py-1.5 pb-3">
        {!!onCancelOrder && (
          <Button
            variant="outline"
            onPress={onCancelOrder}
            className="border-red-500 active:bg-red-50"
          >
            <Text className="text-red-500 text-sm font-medium leading-[20px] text-center">
              Hủy đơn hàng
            </Text>
          </Button>
        )}

        {!!onReturnOrder && (
          <Button
            variant="outline"
            onPress={onReturnOrder}
            className="border-orange-500 active:bg-orange-50"
          >
            <Text className="text-orange-500 text-sm font-medium leading-[20px] text-center">
              Đổi trả
            </Text>
          </Button>
        )}

        {!!onViewDetails && (
          <Button
            onPress={onViewDetails}
            className="bg-primary active:bg-primary/90"
          >
            <Text className="text-white text-sm font-medium leading-[20px] text-center">
              Xem chi tiết
            </Text>
          </Button>
        )}
      </View>
    </View>
  );
};

export default ProductCart;
