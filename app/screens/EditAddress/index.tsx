import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import SelectAdress from "~/components/common/SelectAdress";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  AddressSection,
  AddressTypeSection,
  ContactSection,
  DefaultAddressSection,
} from "~/screens/EditAddress/component";
import { editAddressAtom } from "~/store/atoms";
import { useAtomValue, useStore } from "jotai";
import { IAddress, userService } from "~/services/api/user.service";
import { useMutation } from "@tanstack/react-query";
import { formStateAtom } from "./formAtom";
const EditAddress = () => {
  const { bottom } = useSafeAreaInsets();
  const store = useStore();

  const mutationAddAddress = useMutation({
    mutationFn: (address: IAddress) => {
      return userService.addAddress(address);
    },
  });

  const editAddress = useAtomValue(editAddressAtom);

  const title = editAddress.isEdit ? "Sửa sổ địa chỉ" : "Thêm sổ địa chỉ";

  const handleAddAddress = () => {
    const data = store.get(formStateAtom);

    console.log(data);

    // mutationAddAddress.mutate(editAddress);
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title={title}
        className="bg-transparent border-0"
        textColor="white"
        titleClassName="font-bold"
        hasSafeTop={false}
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
      <SelectAdress
        isOpen={true}
        onClose={() => {}}
        initialValue={{
          province: null,
          district: null,
          ward: null,
        }}
        onSelect={() => {}}
      />
    </ScreenWrapper>
  );
};

export default EditAddress;
