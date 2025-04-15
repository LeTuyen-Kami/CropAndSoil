import { Image } from "expo-image";
import { FlatList, Modal, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "~/services/api/cart.service";
import { IProduct, productService } from "~/services/api/product.service";
import { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import ModalBottom from "~/components/common/ModalBottom";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import { getErrorMessage } from "~/utils";
import { useAtomValue } from "jotai";
import { authAtom } from "~/store/atoms";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";

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
  quantity: number;
  setQuantity: (quantity: number) => void;
}) => {
  const { bottom } = useSafeAreaInsets();

  if (!variations) return null;

  const incrementQuantity = () => {
    if (selectedVariation && quantity < selectedVariation.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
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
                  !selectedVariation || quantity >= selectedVariation.stock
                }
              >
                <AntDesign
                  name="plus"
                  size={16}
                  color={
                    !selectedVariation || quantity >= selectedVariation.stock
                      ? "#D3D3D3"
                      : "black"
                  }
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className="w-full py-3 rounded-full bg-[#FF424E]"
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
      </View>
    </Modal>
  );
};

const formatPrice = (price: number | undefined) => {
  if (price === undefined) return "₫0";
  return "₫" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const BottomButton = ({ productId }: { productId: number | string }) => {
  const auth = useAtomValue(authAtom);
  const navigation = useSmartNavigation();
  const { bottom } = useSafeAreaInsets();
  const [showVariations, setShowVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    null
  );
  const [quantity, setQuantity] = useState(1);
  const queryClient = useQueryClient();
  const [actionType, setActionType] = useState<"add" | "buy">("add");

  const { data: productDetail } = useQuery({
    queryKey: ["product-detail", productId],
    queryFn: () => productService.getProductDetail(productId),
    staleTime: 1000 * 60 * 5,
    enabled: !!productId,
  });

  const mutationAddToCart = useMutation({
    mutationFn: () => {
      if (!selectedVariation) return Promise.reject("No variation selected");
      return cartService.addToCart({
        productId: productId,
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

  const handleAction = (type: "add" | "buy") => {
    if (!auth?.isLoggedIn) {
      navigation.smartNavigate("Login");
      return;
    }

    setActionType(type);
    setQuantity(1);
    setShowVariations(true);
  };

  const handleConfirmAction = () => {
    if (actionType === "add") {
      mutationAddToCart.mutate();
    } else {
      // Handle buy now action
      console.log("Buy now with variation:", selectedVariation);
      setShowVariations(false);
    }
  };

  return (
    <View
      className="w-full h-[60px] bg-[#159747] rounded-t-[32px] flex-row"
      style={{
        bottom: bottom,
      }}
    >
      <TouchableOpacity className="flex-row gap-2 items-center py-[10px] px-[20px] border-r border-[#12853E]">
        <Image
          source={imagePaths.chatIcon}
          className="size-6"
          style={{
            tintColor: "white",
          }}
        />
        <Text className="text-sm font-medium leading-tight text-white">
          Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row gap-2 items-center py-[10px] px-[20px]"
        onPress={() => handleAction("add")}
      >
        <Image
          source={imagePaths.icCart}
          className="size-6"
          style={{
            tintColor: "white",
          }}
        />
        <Text className="text-sm font-medium leading-tight text-white">
          Thêm sản phẩm
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-row gap-2 items-center py-[10px] px-[20px] bg-[#FCBA26] flex-1 justify-center rounded-tr-[32px]"
        onPress={() => handleAction("buy")}
      >
        <Text className="text-sm font-bold leading-tight text-white">
          Mua ngay
        </Text>
      </TouchableOpacity>

      <SelectVariation
        variations={productDetail?.variations}
        isVisible={showVariations}
        onClose={() => setShowVariations(false)}
        onSelectVariation={setSelectedVariation}
        selectedVariation={selectedVariation}
        onConfirm={handleConfirmAction}
        quantity={quantity}
        setQuantity={setQuantity}
      />
    </View>
  );
};

export default BottomButton;
