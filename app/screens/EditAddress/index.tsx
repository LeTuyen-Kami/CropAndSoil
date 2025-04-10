import { TextInput, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GradientBackground from "~/components/common/GradientBackground";
import Header from "~/components/common/Header";
import SelectAdress from "~/components/common/SelectAdress";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  AddressSection,
  AddressTypeSection,
  ContactSection,
  DefaultAddressSection,
} from "~/screens/EditAddress/component";

const EditAddress = () => {
  const { top, bottom } = useSafeAreaInsets();

  console.log("render");

  return (
    <GradientBackground
      style={{ flex: 1 }}
      gradientStyle={{ flex: 1, paddingTop: top }}
    >
      <Header
        title="Sửa sổ địa chỉ"
        className="bg-transparent border-0"
        textColor="white"
        titleClassName="font-bold"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl overflow-hidden ">
        <KeyboardAwareScrollView
          bottomOffset={50}
          contentContainerClassName="pt-4"
        >
          <ContactSection />
          <AddressSection />
          <AddressTypeSection />
          <DefaultAddressSection />
        </KeyboardAwareScrollView>
        <View
          className="flex-col gap-2.5 px-2"
          style={{
            paddingBottom: bottom,
          }}
        >
          <Button
            variant={"outline"}
            className="border-[#CCC] active:bg-[#ffffff] active:opacity-50"
          >
            <Text className="text-[#575964] text-base font-medium">
              Xóa địa chỉ
            </Text>
          </Button>
          <Button className="bg-secondary">
            <Text className="text-base font-medium">Hoàn thành</Text>
          </Button>
        </View>
      </View>
      <SelectAdress />
    </GradientBackground>
  );
};

export default EditAddress;
