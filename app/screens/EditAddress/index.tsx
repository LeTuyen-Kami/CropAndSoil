import { ActivityIndicator, View } from "react-native";
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
import { editAddressAtom, showModalConfirm } from "~/store/atoms";
import { useAtomValue, useSetAtom, useStore } from "jotai";
import { userService, IAddress } from "~/services/api/user.service";
import { useMutation } from "@tanstack/react-query";
import { formStateAtom, clearFormAtom } from "./formAtom";
import { useEffect } from "react";
import { toast } from "~/components/common/Toast";
import { useNavigation } from "@react-navigation/native";
import { getErrorMessage } from "~/utils";
const EditAddress = () => {
  const { bottom } = useSafeAreaInsets();
  const store = useStore();
  const setClearForm = useSetAtom(clearFormAtom);
  const navigation = useNavigation();
  const mutationAddAddress = useMutation({
    mutationFn: (address: IAddress) => {
      return userService.addAddress(address);
    },
  });

  const mutationUpdateAddress = useMutation({
    mutationFn: (address: IAddress) => {
      return userService.updateAddress(address);
    },
  });

  const mutationDeleteAddress = useMutation({
    mutationFn: (wooId: number) => {
      return userService.deleteAddress(wooId);
    },
  });

  const setFormState = useSetAtom(formStateAtom);
  const editAddress = useAtomValue(editAddressAtom);

  const title = editAddress.isEdit ? "Sửa sổ địa chỉ" : "Thêm sổ địa chỉ";

  const handleAddAddress = () => {
    const data = store.get(formStateAtom);
    //checking none
    if (
      !data.fullName ||
      !data.phoneNumber ||
      !data.streetAddress ||
      !data.ward.id ||
      !data.district.id ||
      !data.province.id
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    const params = {
      id: editAddress.id,
      name: data.fullName,
      phoneNumber: data.phoneNumber,
      isDefault: data.addressType.isDefault,
      addressLine: data.streetAddress,
      ward: {
        id: data.ward.id,
        name: data.ward.name,
      },
      district: {
        id: data.district.id,
        name: data.district.name,
      },
      province: {
        id: data.province.id,
        name: data.province.name,
      },
      addressType: data.addressType?.type,
    };

    const mutation = editAddress.isEdit
      ? mutationUpdateAddress
      : mutationAddAddress;

    mutation.mutate(params, {
      onSuccess: () => {
        const message = editAddress.isEdit
          ? "Cập nhật địa chỉ thành công"
          : "Thêm địa chỉ thành công";

        toast.success(message);
        navigation.goBack();
      },
      onError: (error) => {
        const defaultMessage = editAddress.isEdit
          ? "Cập nhật địa chỉ thất bại"
          : "Thêm địa chỉ thất bại";

        const message = getErrorMessage(error, defaultMessage);
        toast.error(message);
      },
    });
  };

  const handleDeleteAddress = () => {
    showModalConfirm({
      title: "Xóa địa chỉ",
      message: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      onConfirm: () => {
        if (!editAddress.id) {
          toast.error("Địa chỉ không tồn tại");
          return;
        }

        mutationDeleteAddress.mutate(editAddress.id, {
          onSuccess: () => {
            toast.success(
              "Xóa địa chỉ thành công",
              "top",
              3000,
              "delete-address"
            );
            navigation.goBack();
          },
          onError: (error) => {
            const message = getErrorMessage(error, "Xóa địa chỉ thất bại");
            toast.error(message);
          },
        });
      },
    });
  };

  useEffect(() => {
    setFormState({
      fullName: editAddress.name,
      phoneNumber: editAddress.phoneNumber,
      streetAddress: editAddress.addressLine,
      ward: {
        id: editAddress.ward?.id || "",
        name: editAddress.ward?.name || "",
      },
      district: {
        id: editAddress.district?.id || "",
        name: editAddress.district?.name || "",
      },
      province: {
        id: editAddress.province?.id || "",
        name: editAddress.province?.name || "",
      },
      addressType: {
        type: editAddress.addressType || "",
        isDefault: editAddress.isDefault,
      },
    });
  }, [editAddress]);

  useEffect(() => {
    return () => {
      setClearForm();
    };
  }, []);

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
          {editAddress.isEdit && (
            <Button
              onPress={handleDeleteAddress}
              variant={"outline"}
              className="border-[#CCC] active:bg-[#ffffff] active:opacity-50"
            >
              <Text className="text-[#575964] text-base font-medium">
                {mutationDeleteAddress.isPending ? (
                  <ActivityIndicator size="small" color="#575964" />
                ) : (
                  "Xóa địa chỉ"
                )}
              </Text>
            </Button>
          )}
          <Button className="bg-secondary" onPress={handleAddAddress}>
            {mutationAddAddress.isPending || mutationUpdateAddress.isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text className="text-base font-medium">
                {editAddress.isEdit ? "Cập nhật" : "Hoàn thành"}
              </Text>
            )}
          </Button>
        </View>
      </View>
      <SelectAdress />
    </ScreenWrapper>
  );
};

export default EditAddress;
