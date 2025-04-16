import { FlashList } from "@shopify/flash-list";
import Checkbox from "expo-checkbox";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Pressable, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import Badge from "~/components/common/Badge";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import ShoppingCartStore from "./ShoppingCartStore";
import { Store } from "../types";
import Footer from "./Footer";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cartService,
  IUpdateCartItemRequest,
} from "~/services/api/cart.service";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { RefreshControl } from "react-native-gesture-handler";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAtom } from "jotai";
import { storeAtom } from "../atom";
import { showModalConfirm, selectedVoucherAtom } from "~/store/atoms";
import { toast } from "~/components/common/Toast";
import { getErrorMessage } from "~/utils";
import Empty from "~/components/common/Empty";
import { RootStackScreenProps } from "~/navigation/types";
import { useNavigation } from "@react-navigation/native";
import { userService } from "~/services/api/user.service";
import { IOrderCalculateRequest } from "~/services/api/order.service";
import { orderService } from "~/services/api/order.service";
import ModalVoucherSelect from "~/screens/VoucherSelect/ModalVoucherSelect";
import ModalSelectShopVoucher from "~/screens/VoucherSelect/ModalSelectShopVoucher";
import { IVoucher } from "~/services/api/shop.service";
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

  const mutationRemoveCartItem = useMutation({
    mutationFn: (cartItemIds: number[]) =>
      cartService.removeCartItem({
        cartItems: cartItemIds,
      }),
  });

  useEffect(() => {
    if (detailCart) {
      // Transform detailCart data to match the Store format
      const transformedStores = detailCart.cartShops.map((shop) => ({
        id: shop.id.toString(),
        name: shop.shopName,
        isSelected: shop.items.every((item) => item.isChecked),
        items: shop.items.map((item) => ({
          id: item.id.toString(),
          productId: item.product.id.toString(),
          name: item.product.name,
          image: item.variation?.thumbnail || item.product.thumbnail,
          price: item.unitPrice,
          originalPrice: item.product.regularPrice,
          type: item.variation?.name || "",
          variation: {
            name: item.variation?.name || "",
            id: item.variation?.id,
          },
          quantity: item.quantity,
          isSelected: item.isChecked,
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
          store.isSelected = store.items.every((item) => item.isSelected);
        });

        return handleStore;
      });
    },
    []
  );

  const handleSelectAll = useCallback((selected: boolean) => {
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
  }, []);

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
    },
    []
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
    showModalConfirm({
      title: "Xóa tất cả sản phẩm",
      message: "Bạn có muốn xóa tất cả sản phẩm khỏi giỏ hàng không?",
      onConfirm: () => {
        toggleLoading(true);
        const allCartItems = stores.flatMap((store) =>
          store.items.map((item) => Number(item.id))
        );
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
  }, []);

  const allItemsSelected =
    stores.length > 0 && stores.every((store) => store.isSelected);

  useEffect(() => {
    if (isRefetching || isPending) {
      toggleLoading(true);
    } else {
      toggleLoading(false);
    }
  }, [isRefetching, isPending]);

  const onVoucherPress = () => {
    setSelectedVoucher({
      voucher: null,
      canSelect: true,
    });
    navigation.navigate("VoucherSelect");
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
          />
        )}
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
          />
        </View>
      )}
      <ModalSelectShopVoucher
        isOpen={!!voucherShopId}
        onClose={() => setVoucherShopId("")}
        shopId={voucherShopId}
        onSelectVoucher={(voucher) => {
          handleShopVoucherPress(voucherShopId, voucher);
          setVoucherShopId("");
        }}
      />
    </ScreenWrapper>
  );
};

export default ShoppingCart;
