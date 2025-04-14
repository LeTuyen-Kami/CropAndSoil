import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { useEffect } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { toast } from "~/components/common/Toast";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { usePagination } from "~/hooks/usePagination";
import { RootStackScreenProps } from "~/navigation/types";
import { IAddress, userService } from "~/services/api/user.service";
import {
  editAddressAtom,
  initialAddress,
  showModalConfirm,
} from "~/store/atoms";
import { PaginationRequests } from "~/types";
import { getErrorMessage, screen } from "~/utils";
import { ADDRESS_TYPE_OPTIONS } from "~/utils/contants";
import AddressItem from "./AddressItem";
import Empty from "~/components/common/Empty";

const Address = () => {
  const { top, bottom } = useSafeAreaInsets();
  const setEditAddress = useSetAtom(editAddressAtom);

  const navigation = useNavigation<RootStackScreenProps<"EditAddress">>();

  const {
    data: addressData,
    isRefresh,
    refresh,
    hasNextPage,
    isFetching,
    fetchNextPage,
  } = usePagination<IAddress, PaginationRequests>(userService.getAddress, {
    queryKey: ["address"],
    initialPagination: { skip: 0, take: 10 },
  });

  const mutationDeleteAddress = useMutation({
    mutationFn: (id: number) => userService.deleteAddress(id),
  });

  const handleEditAddress = (address: IAddress) => {
    setEditAddress({ ...address, isEdit: true });
    navigation.navigate("EditAddress");
  };

  const navigateAddAddress = () => {
    setEditAddress({ ...initialAddress, isEdit: false });
    navigation.navigate("EditAddress");
  };

  const handleDeleteAddress = (address: IAddress) => {
    showModalConfirm({
      title: "Xóa địa chỉ",
      message: "Bạn có chắc chắn muốn xóa địa chỉ này không?",
      onConfirm: () => {
        if (!address.id) {
          toast.error("Địa chỉ không tồn tại");
          return;
        }

        toast.info("Đang xóa địa chỉ...", "top", Infinity, "delete-address");
        mutationDeleteAddress.mutate(address.id, {
          onSuccess: () => {
            toast.success("Xóa địa chỉ thành công");
            refresh();
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
    const unsubscribe = navigation.addListener("focus", () => {
      refresh();
    });
    return () => {
      unsubscribe();
    };
  }, [navigation, refresh]);

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
          refreshControl={
            <RefreshControl refreshing={isRefresh} onRefresh={refresh} />
          }
          className="pt-3"
          data={addressData || []}
          renderItem={({ item }) => (
            <AddressItem
              name={item.name}
              phone={item.phoneNumber}
              address={`${item.addressLine}\n${item.ward.name}, ${item.district.name}, ${item.province.name}`}
              isDefault={item.isDefault}
              type={
                ADDRESS_TYPE_OPTIONS.find(
                  (type) => type.value === item.addressType
                )?.label || ""
              }
              onEdit={() => handleEditAddress(item)}
              onDelete={() => handleDeleteAddress(item)}
            />
          )}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => <Empty title="Không có địa chỉ nào" />}
          onEndReached={fetchNextPage}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            hasNextPage && isFetching ? (
              <ActivityIndicator
                size="large"
                color="#18A24D"
                className="mt-2"
              />
            ) : null
          }
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
