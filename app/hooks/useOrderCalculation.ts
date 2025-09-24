import { useIsFocused } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";
import { Store } from "~/screens/Order/types";
import {
  ICalculateResponse,
  IOrderCalculateRequest,
  orderService,
} from "~/services/api/order.service";
import { selectedAddressAtom } from "~/store/atoms";
import { getErrorMessage } from "~/utils";
import { ERROR_CODE } from "~/utils/contants";

interface PaymentMethod {
  key: string;
}

interface UseOrderCalculationProps {
  selectedVoucher: any;
  stores: Store[];
  selectedPaymentMethod: string;
  storeMessage?: Record<string, string>;
  onVoucherError?: (
    type: "croppeeVoucher" | "storeVoucher",
    shopId?: string
  ) => void;
  enableLoading?: boolean;
}

export const useOrderCalculation = ({
  selectedVoucher,
  stores,
  selectedPaymentMethod,
  storeMessage,
  onVoucherError,
  enableLoading = true,
}: UseOrderCalculationProps) => {
  const [calculatedData, setCalculatedData] =
    useState<ICalculateResponse | null>(null);
  const justAddedVoucher = useRef<"storeVoucher" | "croppeeVoucher">();

  const isFocused = useIsFocused();

  const mutationCalculateOrder = useMutation({
    mutationFn: (data: IOrderCalculateRequest) => orderService.calculate(data),
  });

  const selectedAddress = useAtomValue(selectedAddressAtom);

  const recallCalculated = useRef(false);

  const setJustAddedVoucher = useCallback(
    (type: "storeVoucher" | "croppeeVoucher") => {
      justAddedVoucher.current = type;
    },
    []
  );

  const resetJustAddedVoucher = useCallback(() => {
    justAddedVoucher.current = undefined;
  }, []);

  const setLoading = (loading: boolean) => {
    if (enableLoading) {
      toggleLoading(loading);
    }
  };

  useEffect(() => {
    if (
      !isFocused ||
      !selectedPaymentMethod ||
      !selectedAddress ||
      stores.length === 0
    ) {
      return;
    }

    const selectedStore = stores.filter((store) =>
      store.items?.some((item) => item.isSelected)
    );

    if (selectedStore.length === 0) {
      return;
    }

    setLoading(true);

    const params: IOrderCalculateRequest = {
      paymentMethodKey: selectedPaymentMethod,
      shippingAddressId: selectedAddress?.id!,
      shippingVoucherCode:
        selectedVoucher?.voucher?.voucherType === "shipping"
          ? selectedVoucher?.voucher?.code
          : "",
      productVoucherCode:
        selectedVoucher?.voucher?.voucherType !== "shipping"
          ? selectedVoucher?.voucher?.code!
          : "",
      shops:
        selectedStore?.map((store) => ({
          id: Number(store.id),
          shippingMethodKey: "supership",
          note: storeMessage?.[store?.id] || "",
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
        // resetJustAddedVoucher();
        recallCalculated.current = false;
      },
      onSettled: () => {
        if (!recallCalculated.current) {
          setLoading(false);
        }
      },
      onError: (error: any) => {
        const message = getErrorMessage(error, "Lỗi khi tính toán đơn hàng");
        const code = error?.response?.data?.code;

        if (code === ERROR_CODE.MINIMUM_AMOUNT_APPLYING_VOUCHER) {
          console.log("error", justAddedVoucher.current);

          if (justAddedVoucher.current === "croppeeVoucher") {
            onVoucherError?.("croppeeVoucher");
          }

          if (justAddedVoucher.current === "storeVoucher") {
            onVoucherError?.("storeVoucher");
          }
          recallCalculated.current = true;
          //   resetJustAddedVoucher();
        }

        toast.error(message);
      },
    });
  }, [
    selectedAddress,
    selectedVoucher?.voucher,
    stores,
    selectedPaymentMethod,
    isFocused,
    storeMessage,
  ]);

  return {
    calculatedData,
    mutationCalculateOrder,
    setJustAddedVoucher,
    resetJustAddedVoucher,
  };
};
