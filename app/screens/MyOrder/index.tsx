import { Image } from "expo-image";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import GradientBackground from "~/components/common/GradientBackground";
import Header from "~/components/common/Header";
import { Text } from "~/components/ui/text";
import ProductCart from "./ProductCart";
import { useAtom } from "jotai";
import { confirmAtom } from "~/store/atoms";

const MyOrderScreen = () => {
  const [confirmState, setConfirmState] = useAtom(confirmAtom);

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
      <View>
        <ProductCart
          shopName="Greenhomevn"
          products={mockProducts}
          totalPrice="Tổng số tiền (2 sản phẩm): 500.000đ"
          onCancelOrder={handleCancelOrder}
          onViewDetails={handleViewDetails}
        />
      </View>
    </GradientBackground>
  );
};

export default MyOrderScreen;
