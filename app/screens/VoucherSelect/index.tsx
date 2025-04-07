import ScreenContainer from "~/components/common/ScreenContainer";
import Header from "~/components/common/Header";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
const VoucherSelectScreen = () => {
  return (
    <ScreenContainer
      header={<Header title="Chọn voucher" />}
      hasBottomTabs={false}
    >
      <View>
        <Text>Voucher</Text>
      </View>
    </ScreenContainer>
  );
};

export default VoucherSelectScreen;
