import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ModalBottom from "~/components/common/ModalBottom";
import { toggleLoading } from "~/components/common/ScreenLoading";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import useDisclosure from "~/hooks/useDisclosure";
import { useOrderCalculation } from "~/hooks/useOrderCalculation";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import ModalSelectShopVoucher from "~/screens/VoucherSelect/ModalSelectShopVoucher";
import {
  IOrderCalculateRequest,
  IOrderCheckoutResponse,
  orderService,
} from "~/services/api/order.service";
import { paymentService } from "~/services/api/payment.service";
import { IVoucher } from "~/services/api/shop.service";
import { selectedAddressAtom, selectedVoucherAtom } from "~/store/atoms";
import { ENV, getErrorMessage } from "~/utils";
import { storeAtom } from "../atom";
import AddressItem from "./AddressItem";
import DetailPayment from "./DetailPayment";
import ModalFailed from "./ModalFailed";
import ModalSuccess from "./ModalSuccess";
import PaymentMenu from "./PaymentMenu";
import PaymentMethod from "./PaymentMethod";
import PaymentStore from "./PaymentStore";
import * as WebBrowser from "expo-web-browser";

const Payment = () => {
  const navigation = useNavigation<RootStackScreenProps<"Payment">>();
  const route = useRoute<RootStackRouteProp<"Payment">>();
  const isClearCart = route.params?.isClearCart;

  const [voucherShopId, setVoucherShopId] = useState<string>();
  const [openShopVoucherModal, setOpenShopVoucherModal] = useState(false);

  const [voucherState, setVoucherState] = useAtom(selectedVoucherAtom);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [checkoutData, setCheckoutData] = useState<IOrderCheckoutResponse>();

  const selectedAddress = useAtomValue(selectedAddressAtom);
  const {
    isOpen: isOpenSuccess,
    onOpen: onOpenSuccess,
    onClose: onCloseSuccess,
  } = useDisclosure();

  const { data: paymentMethods } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: () => paymentService.getAvailablePaymentMethods(),
  });

  const queryClient = useQueryClient();

  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");

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

  const [storeMessage, setStoreMessage] = useState<Record<string, string>>({});

  const { calculatedData, setJustAddedVoucher } = useOrderCalculation({
    selectedVoucher: voucherState,
    stores,
    selectedPaymentMethod: selectedPaymentMethod,
    storeMessage,
    onVoucherError: (type) => {
      if (type === "croppeeVoucher") {
        setVoucherState({
          voucher: null,
          canSelect: true,
        });
      }

      if (type === "storeVoucher" && voucherShopId) {
        setStores((prev) =>
          prev.map((store) =>
            store.id === voucherShopId
              ? { ...store, shopVoucher: undefined }
              : store
          )
        );
      }
    },
  });

  const onPressOrder = () => {
    if (!calculatedData) {
      return;
    }

    toggleLoading(true);
    mutationCheckoutOrder.mutate(
      {
        paymentMethodKey: selectedPaymentMethod,
        shippingAddressId: selectedAddress?.id!,
        shippingVoucherCode:
          voucherState?.voucher?.voucherType === "shipping"
            ? voucherState?.voucher?.code
            : "",
        productVoucherCode:
          voucherState?.voucher?.voucherType !== "shipping"
            ? voucherState?.voucher?.code!
            : "",
        isClearCart: !!isClearCart,
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
          setCheckoutData(data);
          onOpenSuccess();
          queryClient.invalidateQueries({
            predicate: (query) =>
              query.queryKey.includes("flash-sale") ||
              query.queryKey.includes("home") ||
              query.queryKey.includes("private-offer-products") ||
              query.queryKey.includes("recently-viewed-products"),
          });
        },
        onError: (error) => {
          const message = getErrorMessage(error, "Lỗi khi đặt hàng");
          setErrorMessage(message);
          onOpenFailed();
        },
        onSettled: () => {
          toggleLoading(false);
        },
      }
    );
  };

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
    navigation.navigate("VoucherSelect", {
      productIds: selectedStore?.flatMap((store) =>
        store.items.map((item) => Number(item.productId))
      ),
    });
  };

  const handlePressContinueOrder = () => {
    onCloseSuccess();
    navigation.goBack();
  };

  const handleShopVoucherPress = useCallback(
    (shopId: string, voucher: IVoucher) => {
      setStores((prev) =>
        prev.map((store) =>
          store.id === shopId ? { ...store, shopVoucher: voucher } : store
        )
      );

      setJustAddedVoucher("storeVoucher");
    },
    [setJustAddedVoucher]
  );

  const handlePressViewOrder = () => {
    onCloseSuccess();
    navigation.reset({
      index: 1,
      routes: [
        { name: "MainTabs", params: { screen: "Profile" } },
        {
          name: "MyOrder",
        },
      ],
    });
  };

  useEffect(() => {
    if (voucherState?.voucher?.id) {
      setJustAddedVoucher("croppeeVoucher");
    }
  }, [voucherState?.voucher?.id, setJustAddedVoucher]);

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
        <AddressItem address={selectedAddress!} />
        {calculatedData?.orderShops?.map((store) => (
          <PaymentStore
            key={store?.shop?.id}
            store={store}
            calculatedData={calculatedData!}
            onMessagePress={() => handleOpenMessageModal(store?.shop?.id + "")}
            message={storeMessage[store?.shop?.id + ""]}
            onShopVoucherPress={() => {
              setVoucherShopId(store?.shop?.id + "");
              setOpenShopVoucherModal(true);
            }}
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
                WebBrowser.openBrowserAsync(ENV.EXPO_PUBLIC_TERMS_LINK);
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
      <ModalFailed
        isOpen={isOpenFailed}
        onClose={onCloseFailed}
        content={errorMessage}
      />

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
        isOpen={openShopVoucherModal}
        onClose={() => setOpenShopVoucherModal(false)}
        shopId={voucherShopId}
        productIds={selectedStore?.flatMap((store) =>
          store.items.map((item) => Number(item.productId))
        )}
        onSelectVoucher={(voucher) => {
          handleShopVoucherPress(voucherShopId!, voucher);
          setOpenShopVoucherModal(false);
        }}
      />
    </ScreenWrapper>
  );
};

export default Payment;
