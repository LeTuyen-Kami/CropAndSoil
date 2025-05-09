import { View } from "react-native";
import { IVoucher, shopService } from "~/services/api/shop.service";
import ModalVoucherSelect from "./ModalVoucherSelect";
import { useQuery } from "@tanstack/react-query";
import { usePagination } from "~/hooks/usePagination";

interface ModalSelectShopVoucherProps {
  isOpen: boolean;
  onClose: () => void;
  shopId?: string;
  productIds?: number[];
  onSelectVoucher: (voucher: IVoucher) => void;
}

const ModalSelectShopVoucher = ({
  isOpen,
  onClose,
  shopId,
  onSelectVoucher,
  productIds,
}: ModalSelectShopVoucherProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["vouchers", shopId?.toString()],
    queryFn: () =>
      shopService.getListVoucher({
        shopId,
        take: 100,
        productIds: productIds?.join(","),
      }),
    enabled: !!shopId,
  });

  const vouchers = data?.data || [];

  return (
    <ModalVoucherSelect
      isOpen={isOpen}
      onClose={onClose}
      listVoucher={vouchers}
      onSelectVoucher={onSelectVoucher}
      isLoading={isLoading}
    />
  );
};

export default ModalSelectShopVoucher;
