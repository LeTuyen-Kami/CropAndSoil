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
import ModalAddToCartAnimation, {
  ModalAddToCartAnimationRef,
} from "~/components/common/ModalAddToCartAnimation";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cartService } from "~/services/api/cart.service";
import {
  flashSaleService,
  IFlashSaleProduct,
} from "~/services/api/flashsale.service";
import { authAtom, selectedVoucherAtom } from "~/store/atoms";
import { getErrorMessage } from "~/utils";
import { storeAtom } from "../Order/atom";
import SelectVariation from "~/components/common/SelectVariation";
type Variation = IFlashSaleProduct["flashSaleVariation"];

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
              variation: selectedVariation,
              quantity: quantity,
              isSelected: true,
            },
          ],
        },
      ];

      setStores(data as any);
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
        onSelectVariation={(variation: any) => {
          setSelectedVariation(variation);
          setQuantity(1);
        }}
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
