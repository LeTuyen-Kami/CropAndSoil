import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { IProduct } from "~/services/api/product.service";
import { formatPrice } from "~/utils";
type Variation = IProduct["variations"][0];

const SelectVariation = ({
  variations,
  isVisible,
  onClose,
  onSelectVariation,
  selectedVariation,
  onConfirm,
  quantity,
  setQuantity,
}: {
  variations?: Variation[];
  isVisible: boolean;
  onClose: () => void;
  onSelectVariation: (variation: Variation) => void;
  selectedVariation: Variation | null;
  onConfirm: () => void;
  quantity?: number;
  setQuantity?: (quantity: number) => void;
}) => {
  const { bottom } = useSafeAreaInsets();

  const incrementQuantity = () => {
    if (!quantity || !setQuantity) return;

    if (selectedVariation && quantity < selectedVariation.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (!quantity || !setQuantity) return;

    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const disabled = useMemo(() => {
    if (!quantity) return true;
    if (!selectedVariation) return true;
    if (quantity > selectedVariation.stock) return true;
    return false;
  }, [quantity, setQuantity, selectedVariation]);

  if (!variations) return null;

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/50">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View
              className="bg-white rounded-t-[24px] p-4"
              style={{ paddingBottom: bottom || 16 }}
            >
              <View className="flex-row items-start mb-4">
                {selectedVariation?.thumbnail && (
                  <Image
                    source={{ uri: selectedVariation.thumbnail }}
                    className="mr-3 w-20 h-20 rounded-lg"
                  />
                )}
                <View className="flex-1">
                  <Text className="mb-1 text-base font-medium">
                    {selectedVariation?.salePrice !== null ? (
                      <Text className="text-[#FF424E] font-semibold">
                        {formatPrice(selectedVariation?.salePrice)}
                      </Text>
                    ) : (
                      <Text className="text-[#FF424E] font-semibold">
                        {formatPrice(selectedVariation?.regularPrice)}
                      </Text>
                    )}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Kho: {selectedVariation?.stock || 0}
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500">
                    Đã chọn: {selectedVariation?.name || "Chưa chọn"}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} className="p-1">
                  <AntDesign name="close" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Text className="mb-3 text-base font-medium">Phân loại</Text>

              <View className="flex-row flex-wrap mb-4">
                {variations.map((item) => (
                  <TouchableOpacity
                    key={item.id.toString()}
                    className={`mr-2 mb-2 px-2 py-2 rounded-full border ${
                      selectedVariation?.id === item.id
                        ? "border-[#FF424E] bg-[#FFF1F0]"
                        : "border-gray-300"
                    }`}
                    onPress={() => onSelectVariation(item)}
                  >
                    <Text
                      className={`text-xs ${
                        selectedVariation?.id === item.id
                          ? "text-[#FF424E]"
                          : "text-gray-700"
                      }`}
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {!!quantity && !!setQuantity && (
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="mb-3 text-base font-medium">Số lượng</Text>
                  <View className="flex-row items-center">
                    <TouchableOpacity
                      onPress={decrementQuantity}
                      className="justify-center items-center w-8 h-8 rounded-md border border-gray-300"
                      disabled={quantity <= 1}
                    >
                      <AntDesign
                        name="minus"
                        size={16}
                        color={quantity <= 1 ? "#D3D3D3" : "black"}
                      />
                    </TouchableOpacity>

                    <Text className="mx-4 text-base">{quantity}</Text>

                    <TouchableOpacity
                      onPress={incrementQuantity}
                      className="justify-center items-center w-8 h-8 rounded-md border border-gray-300"
                      disabled={
                        !selectedVariation ||
                        quantity >= selectedVariation.stock
                      }
                    >
                      <AntDesign
                        name="plus"
                        size={16}
                        color={
                          !selectedVariation ||
                          quantity >= selectedVariation.stock
                            ? "#D3D3D3"
                            : "black"
                        }
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <TouchableOpacity
                className="w-full py-3 rounded-full bg-[#FF424E] disabled:opacity-50"
                disabled={disabled}
                onPress={() => {
                  if (selectedVariation) {
                    onClose();
                    onConfirm();
                  }
                }}
              >
                <Text className="font-semibold text-center text-white">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectVariation;
