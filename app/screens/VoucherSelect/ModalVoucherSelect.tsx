import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ModalBottom from "~/components/common/ModalBottom";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { IVoucher } from "~/services/api/shop.service";
import { getErrorMessage, screen } from "~/utils";
import { ProductVoucher } from ".";
import Empty from "~/components/common/Empty";
import { useMutation } from "@tanstack/react-query";
import { voucherService } from "~/services/api/voucher.service";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";

interface ModalVoucherSelectProps {
  isOpen: boolean;
  onClose: () => void;
  listVoucher: IVoucher[];
  onSelectVoucher: (voucher: IVoucher) => void;
  isLoading: boolean;
}

const ModalVoucherSelect = ({
  isOpen,
  onClose,
  listVoucher,
  onSelectVoucher,
  isLoading,
}: ModalVoucherSelectProps) => {
  const [applyVoucher, setApplyVoucher] = useState<string>("");

  const mutateApplyVoucher = useMutation({
    mutationFn: (voucherCode: string) => voucherService.findByCode(voucherCode),
    onMutate: () => {
      toggleLoading(true);
    },
    onSuccess: (data) => {
      onSelectVoucher(data as any);
      onClose();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Lỗi khi áp dụng voucher"));
    },
    onSettled: () => {
      toggleLoading(false);
    },
  });

  const handleApplyVoucher = () => {
    mutateApplyVoucher.mutate(applyVoucher);
  };

  return (
    <ModalBottom isOpen={isOpen} onClose={onClose}>
      <View
        style={{
          height: screen.height * 0.8,
        }}
      >
        <Input
          placeholder="Nhập mã Cropee Voucher"
          className="mt-5 bg-white mb-2.5 mx-2 border border-[#E0E0E0] rounded-full"
          textInputClassName="text-sm leading-4"
          placeholderTextColor="gray"
          value={applyVoucher}
          onChangeText={setApplyVoucher}
          rightIcon={
            <TouchableOpacity onPress={handleApplyVoucher}>
              <Text className="text-primary">Áp dụng</Text>
            </TouchableOpacity>
          }
        />
        <View className="flex-1">
          <FlashList
            data={listVoucher}
            renderItem={({ item }) => (
              <ProductVoucher voucher={item} onPressVoucher={onSelectVoucher} />
            )}
            estimatedItemSize={200}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 140 }}
            className="pt-[10px]"
            ListEmptyComponent={() => (
              <Empty title="Không có voucher" isLoading={isLoading} />
            )}
          />
        </View>
      </View>
    </ModalBottom>
  );
};

export default ModalVoucherSelect;
