import { useIsFocused, useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Empty from "~/components/common/Empty";
import Header from "~/components/common/Header";
import { toggleLoading } from "~/components/common/ScreenLoading";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Text } from "~/components/ui/text";
import { RootStackScreenProps } from "~/navigation/types";
import ModalSelectShopVoucher from "~/screens/VoucherSelect/ModalSelectShopVoucher";
import {
  cartService,
  IUpdatePatchCartItemRequest,
  Variation,
} from "~/services/api/cart.service";
import {
  ICalculateResponse,
  IOrderCalculateRequest,
  orderService,
} from "~/services/api/order.service";
import { paymentService } from "~/services/api/payment.service";
import { IVoucher } from "~/services/api/shop.service";
import { userService } from "~/services/api/user.service";
import { selectedVoucherAtom, showModalConfirm } from "~/store/atoms";
import { getErrorMessage } from "~/utils";
import { storeAtom } from "../atom";
import Footer from "./Footer";
import ShoppingCartStore from "./ShoppingCartStore";
const ShoppingCart = () => {
  const navigation = useNavigation<RootStackScreenProps<"ShoppingCart">>();
  const [stores, setStores] = useAtom(storeAtom);
  const [voucherShopId, setVoucherShopId] = useState<string>("");

  const [selectedVoucher, setSelectedVoucher] = useAtom(selectedVoucherAtom);
  const { bottom } = useSafeAreaInsets();
  const {
    data: detailCart,
    isPending,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["detail-cart"],
    queryFn: () => cartService.getDetailCart(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const isFocused = useIsFocused();

  const mutationRemoveCartItem = useMutation({
    mutationFn: (cartItemIds: number[]) =>
      cartService.removeCartItem({
        cartItems: cartItemIds,
      }),
  });

  const mutationUpdatePatchCartItem = useMutation({
    mutationFn: (data: IUpdatePatchCartItemRequest) =>
      cartService.updatePatchCartItem(data),
    onError: (error) => {
      refetch();
      toast.error(getErrorMessage(error, "Lỗi khi cập nhật giỏ hàng"));
    },
  });

  const [calculatedData, setCalculatedData] =
    useState<ICalculateResponse | null>(null);
  const { data: paymentMethods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.getAvailablePaymentMethods(),
  });

  const { data: address, refetch: refetchAddress } = useQuery({
    queryKey: ["payment-address"],
    queryFn: () => userService.getAddress({ skip: 0, take: 1 }),
    select: (data) => data.data?.[0] || null,
  });

  const mutationCalculateOrder = useMutation({
    mutationFn: (data: IOrderCalculateRequest) => orderService.calculate(data),
  });

  useEffect(() => {
    if (paymentMethods && address && stores.length > 0) {
      const selectedStore = stores.filter((store) =>
        store.items?.some((item) => item.isSelected)
      );

      if (selectedStore.length === 0) {
        return;
      }

      const params = {
        paymentMethodKey: paymentMethods[0].key,
        shippingAddressId: address?.id!,
        shippingVoucherCode:
          selectedVoucher.voucher?.voucherType === "shipping"
            ? selectedVoucher.voucher?.code!
            : "",
        productVoucherCode:
          selectedVoucher.voucher?.voucherType !== "shipping"
            ? selectedVoucher.voucher?.code!
            : "",
        shops:
          selectedStore?.map((store) => ({
            id: Number(store.id),
            shippingMethodKey: "ghtk",
            note: "",
            voucherCode: store.shopVoucher?.code || "",
            items: store.items
              ?.filter((item) => item.isSelected)
              .map((item) => ({
                product: {
                  id: Number(item.productId),
                  name: item.name,
                },
                variation: {
                  id: Number(item.variation.id),
                  name: item?.variation.name,
                },
                quantity: item.quantity,
              })),
          })) || [],
      };

      mutationCalculateOrder.mutate(params, {
        onSuccess: (data) => {
          setCalculatedData(data);
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Lỗi khi tính toán đơn hàng"));
        },
      });
    }
  }, [paymentMethods, stores, address, selectedVoucher.voucher]);

  useEffect(() => {
    if (detailCart) {
      // Transform detailCart data to match the Store format
      const transformedStores = detailCart.cartShops.map((shop) => ({
        id: shop.id.toString(),
        name: shop.shopName,
        isSelected: shop.items.every((item) => item.isChecked),
        items: shop.items.map((item) => ({
          id: item.id.toString(),
          productId: item?.product?.id.toString(),
          name: item?.product?.name || "",
          image: item?.variation?.thumbnail || item?.product?.thumbnail,
          price: item.unitPrice,
          originalPrice: item?.product?.regularPrice,
          variation: item?.variation,
          quantity: item.quantity,
          isSelected: item.isChecked,
          variations: item?.product?.variations || [],
        })),
      }));

      setStores(transformedStores);
    }
  }, [detailCart]);

  const handleItemSelect = useCallback(
    (storeId: string, itemId: string, selected: boolean) => {
      setStores((prev) => {
        const handleStore = prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.map((item) =>
                  item.id === itemId ? { ...item, isSelected: selected } : item
                ),
              }
            : store
        );

        handleStore.forEach((store) => {
          store.isSelected = store.items.some((item) => item.isSelected);
        });

        return handleStore;
      });
    },
    []
  );

  const handleSelectAll = useCallback(
    (selected: boolean) => {
      setStores((prev) =>
        prev.map((store) => ({
          ...store,
          isSelected: selected,
          items: store.items.map((item) => ({
            ...item,
            isSelected: selected,
          })),
        }))
      );

      const payload = stores.flatMap((store) =>
        store.items.map((item) => ({
          cartItemId: Number(item.id),
          productId: Number(item.productId),
          variationId: Number(item.variation.id),
          quantity: item.quantity,
          isChecked: selected,
        }))
      );

      if (payload.length === 0) {
        return;
      }

      mutationUpdatePatchCartItem.mutate({
        cartItems: payload,
      });
    },
    [stores]
  );

  const handleSelectAllItems = useCallback(
    (storeId: string, selected: boolean) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                isSelected: selected,
                items: store.items.map((item) => ({
                  ...item,
                  isSelected: selected,
                })),
              }
            : store
        )
      );

      const store = stores.find((store) => store.id === storeId);

      if (store) {
        const payload = store.items.map((item) => ({
          cartItemId: Number(item.id),
          productId: Number(item.productId),
          variationId: Number(item.variation.id),
          quantity: item.quantity,
          isChecked: selected,
        }));

        mutationUpdatePatchCartItem.mutate({
          cartItems: payload,
        });
      }
    },
    [stores]
  );

  const handleShopVoucherPress = useCallback(
    (shopId: string, voucher: IVoucher) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === shopId ? { ...store, shopVoucher: voucher } : store
        )
      );
    },
    []
  );

  const handleItemQuantityChange = useCallback(
    (storeId: string, itemId: string, quantity: number) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.map((item) =>
                  item.id === itemId ? { ...item, quantity } : item
                ),
              }
            : store
        )
      );
    },
    []
  );

  const handleVariationChange = useCallback(
    (storeId: string, itemId: string, variation: Variation) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === storeId
            ? {
                ...store,
                items: store.items.map((item) =>
                  item.id === itemId ? { ...item, variation } : item
                ),
              }
            : store
        )
      );
    },
    []
  );

  const handleItemDelete = useCallback((storeId: string, itemId: string) => {
    showModalConfirm({
      title: "Xóa sản phẩm",
      message: "Bạn có muốn xóa sản phẩm này khỏi giỏ hàng không?",
      onConfirm: () => {
        toggleLoading(true);
        mutationRemoveCartItem.mutate([Number(itemId)], {
          onSuccess: () => {
            refetch();
            toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi khi xóa sản phẩm"));
          },
          onSettled: () => {
            toggleLoading(false);
          },
        });
      },
    });
  }, []);

  const handleRemoveAll = useCallback(() => {
    const allCartItems = stores.flatMap((store) =>
      store.items.map((item) => Number(item.id))
    );

    if (allCartItems.length === 0) {
      toast.error("Hiện tại giỏ hàng không có sản phẩm");
      return;
    }

    showModalConfirm({
      title: "Xóa tất cả sản phẩm",
      message: "Bạn có muốn xóa tất cả sản phẩm khỏi giỏ hàng không?",
      onConfirm: () => {
        toggleLoading(true);
        mutationRemoveCartItem.mutate(allCartItems, {
          onSuccess: () => {
            refetch();
            toast.success("Đã xóa tất cả sản phẩm khỏi giỏ hàng");
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi khi xóa tất cả sản phẩm"));
          },
        });
      },
    });
  }, [stores]);

  const allItemsSelected = useMemo(
    () =>
      stores.length > 0 &&
      stores.every((store) => store.items.every((item) => item.isSelected)),
    [stores]
  );

  useEffect(() => {
    if (!isFocused) {
      toggleLoading(false);
      return;
    }

    if (isRefetching || isPending) {
      toggleLoading(true);
    } else {
      toggleLoading(false);
    }
  }, [isRefetching, isPending, isFocused]);

  const onVoucherPress = () => {
    setSelectedVoucher({
      voucher: null,
      canSelect: true,
    });
    navigation.navigate("VoucherSelect", {
      productIds: stores.flatMap((store) =>
        store.items.map((item) => Number(item.productId))
      ),
    });
  };

  useEffect(() => {
    setSelectedVoucher({
      voucher: null,
      canSelect: false,
    });

    return () => {
      //clear stores when unmount
      setStores([]);
      setSelectedVoucher({
        voucher: null,
        canSelect: false,
      });
      refetch();
    };
  }, []);

  return (
    <ScreenWrapper
      hasGradient={false}
      backgroundColor="#EEE"
      hasSafeTop={false}
    >
      <Header
        title="Giỏ hàng"
        titleClassName="font-bold"
        leftClassName="w-10"
        className="border-0"
        rightComponent={
          <TouchableOpacity className="relative flex-row justify-end w-10">
            <Image
              source={imagePaths.icMessages}
              style={{ width: 20, height: 20, tintColor: "#393B45" }}
            />
            {/* <View className="absolute -top-3 -right-3">
              <Badge count={9} className="bg-primary" />
            </View> */}
          </TouchableOpacity>
        }
      />
      <View className="flex-row justify-between px-5 pb-4 bg-white rounded-b-2xl">
        <Pressable
          className="flex-row gap-2 items-center"
          onPress={() => handleSelectAll(!allItemsSelected)}
        >
          <Checkbox
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 2,
              borderColor: "#ccc",
            }}
            color={allItemsSelected ? "#159747" : undefined}
            value={allItemsSelected}
            onValueChange={handleSelectAll}
          />
          <Text className="text-sm font-medium leading-tight text-[#0A0A0A]">
            Tất cả
          </Text>
        </Pressable>
        <TouchableOpacity onPress={() => handleRemoveAll()}>
          <Image
            source={imagePaths.icTrash}
            style={{ width: 24, height: 24, tintColor: "#AEAEAE" }}
          />
        </TouchableOpacity>
      </View>
      <FlashList
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
        }
        data={stores}
        ItemSeparatorComponent={() => <View className="h-[10px]" />}
        renderItem={({ item }) => (
          <ShoppingCartStore
            key={item.id}
            store={item}
            onItemSelect={handleItemSelect}
            onItemQuantityChange={handleItemQuantityChange}
            onItemDelete={handleItemDelete}
            onSelectAllItems={handleSelectAllItems}
            onShopVoucherPress={setVoucherShopId}
            calculatedData={calculatedData!}
            onVariationChange={handleVariationChange}
          />
        )}
        extraData={calculatedData}
        estimatedItemSize={200}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
        className="pt-[10px]"
        ListEmptyComponent={() => (
          <Empty title="Giỏ hàng trống" isLoading={isRefetching} />
        )}
      />
      {!!stores && stores.length > 0 && (
        <View
          className="absolute right-0 bottom-0 left-0 bg-white rounded-t-2xl"
          style={{ paddingBottom: bottom }}
        >
          <Footer
            onVoucherPress={onVoucherPress}
            voucher={selectedVoucher.voucher}
            stores={stores}
            calculatedData={calculatedData!}
          />
        </View>
      )}
      <ModalSelectShopVoucher
        isOpen={!!voucherShopId}
        onClose={() => setVoucherShopId("")}
        shopId={voucherShopId}
        productIds={stores.flatMap((store) =>
          store.items.map((item) => Number(item.productId))
        )}
        onSelectVoucher={(voucher) => {
          handleShopVoucherPress(voucherShopId, voucher);
          setVoucherShopId("");
        }}
      />
    </ScreenWrapper>
  );
};

export default ShoppingCart;
