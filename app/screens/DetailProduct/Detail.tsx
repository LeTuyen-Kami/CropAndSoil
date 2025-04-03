import { Image } from "expo-image";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import WebView from "react-native-webview";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";

const Detail = () => {
  const [expanded, setExpanded] = useState(false);

  // Mock product details data (this could be fetched from an API in a real app)
  const productDetails = {
    mainComponent: "Abamectin",
    usageTarget: "Đạo ôn cho cây lúa",
    toxicGroup: "Cây ăn quả",
    manufacturer: "Greenhome",
    origin: "Long An",
    description: "<h1>Mô tả sản phẩm</h1>",
  };

  return (
    <View className="flex-1 mt-2 bg-white rounded-b-3xl">
      {/* Product details header */}
      <View className="border-b border-[#F0F0F0]">
        <View className="flex-row justify-between items-center px-5 py-4">
          <View className="flex-row items-center">
            <Text className="text-[#383B45] font-bold text-lg">
              Chi tiết sản phẩm
            </Text>
          </View>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-[#159747] text-base mr-1">Xem tất cả</Text>
            <Image source={imagePaths.icArrowRight} className="w-5 h-5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Product description container */}
      <View className="py-5">
        <View className="px-5">
          <Text className="text-[#383B45] font-bold text-sm">
            Mô tả sản phẩm
          </Text>
        </View>

        <View className="flex flex-col gap-5 px-5 py-2 mt-2">
          {/* Product description items */}
          <View className="flex-row justify-between">
            <Text className="text-[#979797] text-sm w-36">
              Thành phần chính
            </Text>
            <Text className="text-[#545454] text-sm flex-1">
              {productDetails.mainComponent}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#979797] text-sm w-36">
              Đối tượng sử dụng
            </Text>
            <Text className="text-[#545454] text-sm flex-1">
              {productDetails.usageTarget}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#979797] text-sm w-36">Nhóm độc</Text>
            <Text className="text-[#545454] text-sm flex-1">
              {productDetails.toxicGroup}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#979797] text-sm w-36">Nhà sản xuất</Text>
            <Text className="text-[#545454] text-sm flex-1">
              {productDetails.manufacturer}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-[#979797] text-sm w-36">Xuất xứ</Text>
            <Text className="text-[#545454] text-sm flex-1">
              {productDetails.origin}
            </Text>
          </View>
        </View>

        {expanded && (
          <View className="px-5">
            <WebView
              source={{ html: productDetails.description }}
              style={{ width: "100%", height: 100 }}
            />
          </View>
        )}
      </View>

      {/* Product details footer */}
      <View className="border-t border-[#F0F0F0]">
        <TouchableOpacity
          className="flex-row justify-center items-center px-5 py-4"
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <Text className="text-[#383B45] text-sm mr-1">Xem chi tiết</Text>
          <Image
            source={imagePaths.icArrowRight}
            className="w-5 h-5"
            style={{
              transform: [{ rotate: !expanded ? "90deg" : "-90deg" }],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Detail;
