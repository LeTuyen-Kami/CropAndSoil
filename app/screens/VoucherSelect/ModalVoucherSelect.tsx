import { FlashList } from "@shopify/flash-list";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import ModalBottom from "~/components/common/ModalBottom";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { IVoucher } from "~/services/api/shop.service";
import { screen } from "~/utils";
import { ProductVoucher } from ".";
import Empty from "~/components/common/Empty";

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

  const handleApplyVoucher = () => {
    console.log("applyVoucher", applyVoucher);
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
