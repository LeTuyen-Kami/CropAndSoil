import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useAtomValue, useSetAtom } from "jotai";
import { useRef, useState } from "react";
import {
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cartService } from "~/services/api/cart.service";
import { authAtom, selectedVoucherAtom } from "~/store/atoms";
import { getErrorMessage } from "~/utils";
import { storeAtom } from "../Order/atom";
import {
  flashSaleService,
  IFlashSaleProduct,
} from "~/services/api/flashsale.service";
import ModalAddToCartAnimation, {
  ModalAddToCartAnimationRef,
} from "~/components/common/ModalAddToCartAnimation";
type Variation = IFlashSaleProduct["flashSaleVariation"];

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
                        !selectedVariation ||
                        quantity >= selectedVariation.stock
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
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const formatPrice = (price: number | undefined) => {
  if (price === undefined) return "₫0";
  return "₫" + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const BottomButton = ({
  flashSaleProductId,
}: {
  flashSaleProductId: number | string;
}) => {
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
  const setStores = useSetAtom(storeAtom);
  const setVoucherState = useSetAtom(selectedVoucherAtom);
  const modalRef = useRef<ModalAddToCartAnimationRef>(null);

  const { data: flashSaleProductDetail } = useQuery({
    queryKey: ["flash-sale-product-detail", flashSaleProductId],
    queryFn: () => flashSaleService.getFlashItemDetail(flashSaleProductId),
    staleTime: 1000 * 60 * 5,
    enabled: !!flashSaleProductId,
    select: (data) => {
      return {
        ...data.flashSaleProduct,
        flashSaleVariation: [data.flashSaleVariation],
      };
    },
  });

  const mutationAddToCart = useMutation({
    mutationFn: () => {
      if (!selectedVariation) return Promise.reject("No variation selected");
      return cartService.addToCart({
        productId: +flashSaleProductDetail?.id!,
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

  // useEffect(() => {
  //   if (detailCart) {
  //     // Transform detailCart data to match the Store format
  //     const transformedStores = detailCart.cartShops.map((shop) => ({
  //       id: shop.id.toString(),
  //       name: shop.shopName,
  //       isSelected: shop.items.every((item) => item.isChecked),
  //       items: shop.items.map((item) => ({
  //         id: item.id.toString(),
  //         productId: item.product.id.toString(),
  //         name: item.product.name,
  //         image: item.variation?.thumbnail || item.product.thumbnail,
  //         price: item.unitPrice,
  //         originalPrice: item.product.regularPrice,
  //         type: item.variation?.name || "",
  //         variation: {
  //           name: item.variation?.name || "",
  //           id: item.variation?.id,
  //         },
  //         quantity: item.quantity,
  //         isSelected: item.isChecked,
  //       })),
  //     }));

  //     setStores(transformedStores);
  //   }
  // }, [detailCart]);

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
      setTimeout(() => {
        modalRef.current
          ?.startAnimation(selectedVariation?.thumbnail!, {
            x: screen.width - 70,
            y: 30,
          })
          .then(() => {
            queryClient.invalidateQueries({
              queryKey: ["detail-cart"],
            });
          });
      }, 1000);

      mutationAddToCart.mutate();
    } else {
      // Handle buy now action
      const data = [
        {
          id: flashSaleProductDetail?.shop?.id?.toString() || "",
          name: flashSaleProductDetail?.shop?.shopName || "",
          isSelected: true,
          items: [
            {
              id: flashSaleProductDetail?.id?.toString() || "",
              productId: flashSaleProductDetail?.id?.toString() || "",
              name: flashSaleProductDetail?.name || "",
              image:
                selectedVariation?.thumbnail! ||
                flashSaleProductDetail?.thumbnail!,
              price: (flashSaleProductDetail?.salePrice ||
                flashSaleProductDetail?.regularPrice ||
                0)!,
              originalPrice: (flashSaleProductDetail?.regularPrice || 0)!,
              type: selectedVariation?.name || "",
              variation: {
                name: selectedVariation?.name!,
                id: selectedVariation?.id!,
              },
              quantity: quantity,
              isSelected: true,
            },
          ],
        },
      ];

      setStores(data);
      setVoucherState({
        voucher: null,
        canSelect: false,
      });

      setShowVariations(false);

      navigation.smartNavigate("Payment");
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
        variations={flashSaleProductDetail?.flashSaleVariation}
        isVisible={showVariations}
        onClose={() => setShowVariations(false)}
        onSelectVariation={setSelectedVariation}
        selectedVariation={selectedVariation}
        onConfirm={handleConfirmAction}
        quantity={quantity}
        setQuantity={setQuantity}
      />
      <ModalAddToCartAnimation ref={modalRef} />
    </View>
  );
};

export default BottomButton;
