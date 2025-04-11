import { Text } from "~/components/ui/text";
import ScreenContainer from "~/components/common/ScreenContainer";
import Header from "~/components/common/Header";
import GradientBackground from "~/components/common/GradientBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddressItem from "./AddressItem";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Button } from "~/components/ui/button";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { RootStackScreenProps } from "~/navigation/types";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useQuery } from "@tanstack/react-query";
import { userService, IAddress } from "~/services/api/user.service";
import { PaginationRequets } from "~/types";
import { usePagination } from "~/hooks/usePagination";
import { screen } from "~/utils";
import { editAddressAtom, initialAddress } from "~/store/atoms";
import { useSetAtom } from "jotai";

const Address = () => {
  const { top, bottom } = useSafeAreaInsets();
  const setEditAddress = useSetAtom(editAddressAtom);

  const navigation = useNavigation<RootStackScreenProps<"EditAddress">>();

  const { data: addressData } = usePagination<IAddress, PaginationRequets>(
    userService.getAddress,
    {
      queryKey: ["address"],
      initialPagination: { skip: 0, take: 10 },
    }
  );

  const handleEditAddress = (address: IAddress) => {
    setEditAddress({ ...address, isEdit: true });
    navigation.navigate("EditAddress");
  };

  const navigateAddAddress = () => {
    setEditAddress({ ...initialAddress, isEdit: false });
    navigation.navigate("EditAddress");
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Chọn địa chỉ nhận hàng"
        titleClassName="font-bold"
        className="bg-transparent border-0"
        textColor="white"
        hasSafeTop={false}
      />
      <View className="flex-1 px-5 bg-[#EEE] rounded-t-3xl overflow-hidden">
        <FlashList
          className="pt-3"
          data={addressData || []}
          renderItem={({ item }) => (
            <AddressItem
              name={item.name}
              phone={item.phoneNumber}
              address={item.addressLine}
              isDefault={item.isDefault}
              type={item.addressType}
              onEdit={() => handleEditAddress(item)}
            />
          )}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View
              className="flex-1 justify-center items-center"
              style={{
                height: screen.height / 2,
              }}
            >
              <AntDesign name="folderopen" size={40} color="#6B7280" />
              <Text className="text-center text-gray-500">
                Không có địa chỉ nào
              </Text>
            </View>
          )}
        />
      </View>
      <View
        className="px-2 bg-[#EEE]"
        style={{
          paddingBottom: bottom,
        }}
      >
        <Button className="w-full bg-[#FCBA26]" onPress={navigateAddAddress}>
          <View className="flex-row gap-1 items-center">
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-base font-medium"> Thêm địa chỉ</Text>
          </View>
        </Button>
      </View>
    </ScreenWrapper>
  );
};

export default Address;
