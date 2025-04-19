import { View } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { userService } from "~/services/api/user.service";
import { useQuery } from "@tanstack/react-query";
import AddressItem from "./AddressItem";

const DetailOrder = () => {
  const { data: address, refetch: refetchAddress } = useQuery({
    queryKey: ["payment-address"],
    queryFn: () => userService.getAddress({ skip: 0, take: 1 }),
    select: (data) => data?.data?.[0] || null,
  });

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        textColor="white"
        title="Chi tiết đơn hàng"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />
      <View className="rounded-t-[16px] overflow-hidden bg-[#F5F5F5] flex-1 px-2 py-3">
        <AddressItem address={address} />
      </View>
    </ScreenWrapper>
  );
};

export default DetailOrder;
