import { Image } from "expo-image";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ProductItem from "~/components/common/ProductItem";
import { Text } from "~/components/ui/text";

const TopProduct = () => {
  const topProducts = [
    {
      id: "1",
      name: "Thuốc trừ bệnh Sumi Eight 12.5WP 100gr",
      price: 96000,
      originalPrice: 135000,
      discount: 20,
      image: imagePaths.productImg1,
    },
    {
      id: "2",
      name: "Thuốc trừ bệnh Sumi Eight 12.5WP 100gr",
      price: 96000,
      originalPrice: 135000,
      discount: 20,
      image: imagePaths.productImg2,
    },
    {
      id: "3",
      name: "Thuốc trừ bệnh Sumi Eight 12.5WP 100gr",
      price: 96000,
      originalPrice: 135000,
      discount: 20,
      image: imagePaths.productImg3,
    },
  ];

  return (
    <View className="bg-white px-[10] py-[20]">
      <View className="flex-row justify-between items-center mb-[10]">
        <Text className="text-[18px] font-bold text-neutral-800">
          Top sản phẩm nổi bật
        </Text>
        <TouchableOpacity className="flex-row items-center" activeOpacity={0.7}>
          <Text className="mr-1 text-base text-primary-600">Xem tất cả</Text>
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 16, height: 16 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 6 }}
      >
        {topProducts.map((product) => (
          <ProductItem
            key={product.id}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            image={product.image as unknown as string}
            width={150}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default TopProduct;
