import { ScrollView, View } from "react-native";
import Header from "~/components/common/Header";
import { Text } from "~/components/ui/text";
import useDisclosure from "~/hooks/useDisclosure";
import AddressItem from "./AddressItem";
import DetailPayment from "./DetailPayment";
import ModalSuccess from "./ModalSuccess";
import PaymentMenu from "./PaymentMenu";
import PaymentMethod from "./PaymentMethod";
import PaymentStore from "./PaymentStore";
import ModalFailed from "./ModalFailed";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useAtom, useSetAtom } from "jotai";
import { storeAtom } from "../atom";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPrice, getErrorMessage } from "~/utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMutation, useQuery } from "@tanstack/react-query";
import { paymentService } from "~/services/api/payment.service";
import {
  IOrderCalculateRequest,
  ICalculateResponse,
} from "~/services/api/order.service";
import { orderService } from "~/services/api/order.service";
import { userService } from "~/services/api/user.service";
import { useIsFocused } from "@react-navigation/native";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import ModalBottom from "~/components/common/ModalBottom";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Image } from "expo-image";
import { useNavigation } from "@react-navigation/native";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { selectedVoucherAtom } from "~/store/atoms";
import ModalSelectShopVoucher from "~/screens/VoucherSelect/ModalSelectShopVoucher";
import { IVoucher } from "~/services/api/shop.service";
const Payment = () => {
  const navigation = useNavigation<RootStackScreenProps<"Payment">>();
  const [voucherShopId, setVoucherShopId] = useState<string>();

  const [voucherState, setVoucherState] = useAtom(selectedVoucherAtom);

  const isFocused = useIsFocused();
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();
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
    enabled: false,
  });

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

  const mutationCalculateOrder = useMutation({
    mutationFn: (data: IOrderCalculateRequest) => orderService.calculate(data),
  });

  const mutationCheckoutOrder = useMutation({
    mutationFn: (data: IOrderCalculateRequest) => orderService.checkout(data),
  });

  const { bottom } = useSafeAreaInsets();

  const [stores, setStores] = useAtom(storeAtom);

  const selectedStore = useMemo(() => {
    return stores.filter((store) =>
      store.items.some((item) => item.isSelected)
    );
  }, [stores]);

  useEffect(() => {
    if (selectedPaymentMethod && address) {
      toggleLoading(true);
      mutationCalculateOrder.mutate(
        {
          paymentMethodKey: selectedPaymentMethod,
          shippingAddressId: address?.id!,
          shippingVoucherCode:
            voucherState?.voucher?.voucherType === "shipping"
              ? voucherState?.voucher?.code
              : "",
          productVoucherCode:
            voucherState?.voucher?.voucherType !== "shipping"
              ? voucherState?.voucher?.code!
              : "",
          shops:
            selectedStore?.map((store) => ({
              id: Number(store.id),
              shippingMethodKey: "ghtk",
              note: storeMessage[store.id] || "",
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
        },
        {
          onSuccess: (data) => {
            setCalculatedData(data);
          },
          onSettled: () => {
            toggleLoading(false);
          },
          onError: (error) => {
            toast.error(getErrorMessage(error, "Lỗi khi tính toán đơn hàng"));
          },
        }
      );
    }
  }, [selectedPaymentMethod, voucherState.voucher, address, stores]);

  const onPressOrder = () => {
    if (!calculatedData) {
      return;
    }

    toggleLoading(true);
    mutationCheckoutOrder.mutate(
      {
        paymentMethodKey: selectedPaymentMethod,
        shippingAddressId: address?.id!,
        shippingVoucherCode:
          voucherState?.voucher?.voucherType === "shipping"
            ? voucherState?.voucher?.code
            : "",
        productVoucherCode:
          voucherState?.voucher?.voucherType !== "shipping"
            ? voucherState?.voucher?.code!
            : "",
        shops: selectedStore?.map((store) => ({
          id: Number(store.id),
          shippingMethodKey: "ghtk",
          note: storeMessage[store.id] || "",
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
        })),
      },
      {
        onSuccess: (data) => {
          onOpenSuccess();
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Lỗi khi đặt hàng"));
          onOpenFailed();
        },
        onSettled: () => {
          toggleLoading(false);
        },
      }
    );
  };

  useEffect(() => {
    if (isFocused) {
      refetchAddress();
    }
  }, [isFocused]);

  const {
    isOpen: isOpenFailed,
    onOpen: onOpenFailed,
    onClose: onCloseFailed,
  } = useDisclosure();

  useEffect(() => {
    if (paymentMethods) {
      setSelectedPaymentMethod(paymentMethods[0].key);
    }
  }, [paymentMethods]);

  const {
    isOpen: isMessageModalOpen,
    onOpen: openMessageModal,
    onClose: closeMessageModal,
  } = useDisclosure();

  const [messageText, setMessageText] = useState("");
  const [storeMessage, setStoreMessage] = useState<Record<string, string>>({});
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  const handleOpenMessageModal = (storeId: string) => {
    setSelectedStoreId(storeId);
    setMessageText(storeMessage[storeId] || "");
    openMessageModal();
  };

  const handleSaveMessage = () => {
    if (selectedStoreId) {
      setStoreMessage((prev) => ({
        ...prev,
        [selectedStoreId]: messageText,
      }));
    }
    closeMessageModal();
  };

  const onVoucherPress = () => {
    setVoucherState({
      voucher: null,
      canSelect: true,
    });
    navigation.navigate("VoucherSelect");
  };

  const handlePressContinueOrder = () => {
    onCloseSuccess();
    navigation.replace("MyOrder", {
      tabIndex: 2,
    });
  };

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

  const handlePressViewOrder = () => {
    onCloseSuccess();
    navigation.replace("MyOrder", {
      tabIndex: 2,
    });
  };

  return (
    <ScreenWrapper
      hasGradient={false}
      backgroundColor="white"
      hasSafeTop={false}
    >
      <Header
        title="Thanh toán"
        titleClassName="font-bold"
        className="pb-6 border-0"
      />
      <ScrollView
        className="flex-1 bg-[#F5F5F5] px-[10px] pt-[10px]"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <AddressItem address={address} />
        {selectedStore?.map((store) => (
          <PaymentStore
            key={store.id}
            store={store}
            onMessagePress={() => handleOpenMessageModal(store.id)}
            message={storeMessage[store.id]}
            onShopVoucherPress={() => setVoucherShopId(store.id)}
          />
        ))}
        <PaymentMethod
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          onSelectPaymentMethod={setSelectedPaymentMethod}
        />
        <DetailPayment calculatedData={calculatedData!} />
        <View className="py-3">
          <Text className="text-sm font-normal leading-tight">
            Nhấn "đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo{" "}
            <Text
              className="text-sm leading-tight text-primary"
              onPress={() => {
                console.log("pressed");
              }}
            >
              Điều khoản Cropee.
            </Text>
          </Text>
        </View>
      </ScrollView>
      <View
        className="absolute right-0 bottom-0 left-0"
        style={{ paddingBottom: bottom }}
      >
        <PaymentMenu
          calculatedData={calculatedData!}
          onVoucherPress={onVoucherPress}
          onOrderPress={onPressOrder}
          voucher={voucherState.voucher}
        />
      </View>
      <ModalSuccess
        isOpen={isOpenSuccess}
        calculatedData={calculatedData!}
        onContinueOrder={handlePressContinueOrder}
        onViewOrder={handlePressViewOrder}
      />
      <ModalFailed isOpen={isOpenFailed} onClose={onCloseFailed} />

      {/* Message Modal */}
      <ModalBottom isOpen={isMessageModalOpen} onClose={closeMessageModal}>
        <View className="p-4">
          <Text className="mb-2 text-sm text-gray-600">
            Hãy để lại lời nhắn cho cửa hàng về đơn hàng của bạn
          </Text>

          <Input
            placeholder="Nhập lời nhắn của bạn"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            textAlignVertical="top"
            className="min-h-[100px] p-3 mb-4"
          />

          <Button onPress={handleSaveMessage} className="w-full">
            <Text className="font-medium text-white">Lưu</Text>
          </Button>
        </View>
      </ModalBottom>
      <ModalSelectShopVoucher
        isOpen={!!voucherShopId}
        onClose={() => setVoucherShopId("")}
        shopId={voucherShopId}
        onSelectVoucher={(voucher) => {
          handleShopVoucherPress(voucherShopId!, voucher);
          setVoucherShopId("");
        }}
      />
    </ScreenWrapper>
  );
};

export default Payment;
