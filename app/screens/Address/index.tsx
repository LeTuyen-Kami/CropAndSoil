import { Text } from "~/components/ui/text";
import ScreenContainer from "~/components/common/ScreenContainer";
import Header from "~/components/common/Header";
import GradientBackground from "~/components/common/GradientBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AddressItem from "./AddressItem";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { Button } from "~/components/ui/button";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
const Address = () => {
  const { top, bottom } = useSafeAreaInsets();

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData([
      {
        id: "1",
        name: "John Doe",
        phone: "0909090909",
        address: "123 Main St, Anytown, USA",
        isDefault: true,
        type: "Nhà riêng",
      },
      {
        id: "2",
        name: "John Doe",
        phone: "0909090909",
        address: "123 Main St, Anytown, USA",
        isDefault: false,
        type: "Nhà riêng",
      },
    ]);
  }, []);

  return (
    <ScreenContainer
      paddingBottom={0}
      paddingHorizontal={0}
      paddingVertical={0}
      hasBottomTabs={false}
      safeArea={false}
      scrollable={false}
      header={
        <GradientBackground
          gradientStyle={{
            paddingTop: top,
            paddingBottom: 30,
          }}
        >
          <Header
            title="Chọn địa chỉ nhận hàng"
            titleClassName="font-bold"
            className="bg-transparent border-0"
            textColor="white"
          />
        </GradientBackground>
      }
    >
      <View className="flex-1 px-5 -mt-10 bg-[#EEE] rounded-t-3xl overflow-hidden">
        <FlashList
          className="pt-3"
          data={[...data, ...data, ...data, ...data, ...data, ...data]}
          renderItem={({ item }) => (
            <AddressItem
              name={item.name}
              phone={item.phone}
              address={item.address}
              isDefault={item.isDefault}
              type={item.type}
            />
          )}
          estimatedItemSize={100}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          contentContainerStyle={{ paddingBottom: 12 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View
        className="px-2"
        style={{
          paddingBottom: bottom,
        }}
      >
        <Button className="w-full bg-[#FCBA26]">
          <View className="flex-row gap-1 items-center">
            <AntDesign name="plus" size={20} color="white" />
            <Text className="text-base font-medium"> Thêm địa chỉ</Text>
          </View>
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default Address;
