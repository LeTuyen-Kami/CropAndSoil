import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import Header from "~/components/common/Header";
import Tabs from "~/components/common/Tabs";
import { Text } from "~/components/ui/text";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { ORDER_STATUS } from "~/utils/contants";
import ListOrder from "./ListOrder";
import ModalOrderRefundWithAtom from "./ModalOrderRefund";
const MyOrderScreen = () => {
  const route = useRoute<RootStackRouteProp<"MyOrder">>();
  const tabIndex = route.params?.tabIndex || 0;
  const navigation = useNavigation<RootStackScreenProps<"MyOrder">>();

  const handleSearchOrder = () => {
    navigation.navigate("SearchOrder");
  };

  const items = [
    {
      title: "Tất cả",
      content: <ListOrder />,
    },
    {
      title: "Chờ xác nhận",
      content: <ListOrder status={ORDER_STATUS.PENDING} />,
    },
    {
      title: "Chờ vận chuyển",
      content: <ListOrder status={ORDER_STATUS.PROCESSING} />,
    },
    {
      title: "Đang vận chuyển",
      content: <ListOrder status={ORDER_STATUS.SHIPPED} />,
    },
    {
      title: "Đã giao",
      content: <ListOrder status={ORDER_STATUS.DELIVERED} />,
    },
    {
      title: "Đổi trả",
      content: <ListOrder status={ORDER_STATUS.RETURNED} />,
    },
    {
      title: "Đã hủy",
      content: <ListOrder status={ORDER_STATUS.CANCELLED} />,
    },
  ];

  return (
    <GradientBackground style={{ flex: 1 }} gradientStyle={{ flex: 1 }}>
      <Header
        title="Đơn hàng của tôi"
        textColor="white"
        className="bg-transparent border-0"
        titleClassName="font-bold"
        leftClassName="w-10"
        rightComponent={
          <TouchableOpacity className="flex-row justify-end w-10 opacity-0">
            <Image
              source={imagePaths.icMessages}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        }
      />
      <View className="flex-1 bg-[#EEE] rounded-t-2xl">
        <View className="px-3 mt-4 mb-3">
          <TouchableOpacity
            className="flex-row gap-3 items-center bg-white rounded-full py-[15px] px-4"
            onPress={handleSearchOrder}
          >
            <Feather name="search" size={18} color="#AEAEAE" />
            <Text className="text-sm leading-tight text-[#AEAEAE]">
              Tìm Mã đơn hàng, Nhà bán, Tên sản phẩm
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Tabs items={items} initialPage={tabIndex} />
        </View>

        {/* <ProductCart
          shopName="Greenhomevn"
          products={mockProducts}
          totalPrice="Tổng số tiền (2 sản phẩm): 500.000đ"
          onCancelOrder={handleCancelOrder}
          onViewDetails={handleViewDetails}
        /> */}
      </View>
      <ModalOrderRefundWithAtom />
    </GradientBackground>
  );
};

export default MyOrderScreen;
