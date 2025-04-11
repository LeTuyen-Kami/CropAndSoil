import { Feather } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { useSetAtom } from "jotai";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import Header from "~/components/common/Header";
import Tabs from "~/components/common/Tabs";
import { Text } from "~/components/ui/text";
import { confirmAtom } from "~/store/atoms";
import ProductCart from "./ProductCart";
const MyOrderScreen = () => {
  const setConfirmState = useSetAtom(confirmAtom);

  const mockProducts = [
    {
      name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
      type: "NPK Rau Phú Mỹ",
      quantity: 1,
      originalPrice: "220.000đ",
      discountedPrice: "160.000đ",
      imageUri: "https://picsum.photos/200/300",
    },
    {
      name: "Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả",
      type: "NPK Rau Phú Mỹ",
      quantity: 2,
      originalPrice: "220.000đ",
      discountedPrice: "170.000đ",
      imageUri: "https://picsum.photos/200/300",
    },
  ];

  const handleCancelOrder = () => {
    setConfirmState({
      title: "Hủy đơn hàng",
      message: "Bạn có chắc chắn muốn hủy đơn hàng này không?",
      onConfirm: () => {
        console.log("confirm order");
      },
      onCancel: () => {
        console.log("Cancel order");
      },
      isOpen: true,
    });
  };

  const handleViewDetails = () => {
    console.log("View details");
  };

  const renderPageItem = ({ listItem }: { listItem: any[] }) => {
    return (
      <View className="flex-1 mt-3">
        <FlashList
          data={listItem}
          ItemSeparatorComponent={() => <View className="h-2.5" />}
          renderItem={({ item }) => (
            <ProductCart
              shopName="Greenhomevn"
              products={mockProducts}
              totalPrice="Tổng số tiền (2 sản phẩm): 500.000đ"
              onCancelOrder={handleCancelOrder}
              onViewDetails={handleViewDetails}
            />
          )}
          estimatedItemSize={200}
        />
      </View>
    );
  };

  const items = [
    {
      title: "Tất cả",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Chờ xác nhận",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Chờ vận chuyển",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Đang vận chuyển",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Đã giao",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Đổi trả",
      content: renderPageItem({ listItem: [...Array(10)] }),
    },
    {
      title: "Đã hủy",
      content: renderPageItem({ listItem: [...Array(10)] }),
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
          <TouchableOpacity className="flex-row justify-end w-10">
            <Image
              source={imagePaths.icMessages}
              style={{ width: 24, height: 24 }}
            />
          </TouchableOpacity>
        }
      />
      <View className="flex-1 bg-[#EEE] rounded-t-[40px]">
        <View className="px-3 mt-4 mb-3">
          <TouchableOpacity className="flex-row gap-3 items-center bg-white rounded-full py-[15px] px-4">
            <Feather name="search" size={18} color="#AEAEAE" />
            <Text className="text-sm leading-tight text-[#AEAEAE]">
              Tìm Mã đơn hàng, Nhà bán, Tên sản phẩm
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Tabs items={items} />
        </View>

        {/* <ProductCart
          shopName="Greenhomevn"
          products={mockProducts}
          totalPrice="Tổng số tiền (2 sản phẩm): 500.000đ"
          onCancelOrder={handleCancelOrder}
          onViewDetails={handleViewDetails}
        /> */}
      </View>
    </GradientBackground>
  );
};

export default MyOrderScreen;
