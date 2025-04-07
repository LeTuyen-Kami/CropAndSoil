import { ScrollView, View } from "react-native";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import AddressItem from "./AddressItem";
import DetailPayment from "./DetailPayment";
import PaymentMenu from "./PaymentMenu";
import PaymentMethod from "./PaymentMethod";
import PaymentStore from "./PaymentStore";

const Payment = () => {
  return (
    <ScreenContainer
      scrollable={false}
      hasBottomTabs={false}
      paddingBottom={0}
      paddingHorizontal={0}
      paddingVertical={0}
      header={
        <Header
          title="Thanh toán"
          titleClassName="font-bold"
          className="pb-6 border-0"
        />
      }
      backgroundColor="white"
    >
      <ScrollView
        className="flex-1 bg-[#F5F5F5] px-[10px] pt-[10px]"
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        <AddressItem />
        <PaymentStore />
        <PaymentMethod />
        <DetailPayment />
        <View className="py-3">
          <Text className="text-sm font-normal leading-tight">
            Nhấn “đặt hàng” đồng nghĩa với việc bạn đồng ý tuân theo{" "}
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
      <View className="absolute right-0 bottom-0 left-0">
        <PaymentMenu
          totalPrice="1.901.300đ"
          savedAmount="331.300đ"
          onVoucherPress={() => {}}
          onOrderPress={() => {}}
        />
      </View>
    </ScreenContainer>
  );
};

export default Payment;
