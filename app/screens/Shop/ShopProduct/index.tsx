import { TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import { FontAwesome5 } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useMemo, useState } from "react";
import ProductItem from "~/components/common/ProductItem";
import { getItemWidth, screen } from "~/utils";

const Header = () => {
  return (
    <View className="flex-row gap-2 items-center px-2 mb-4 w-full">
      <Text className="text-sm font-medium text-black">
        Tất cả sản phẩm{" "}
        <Text className="text-sm font-medium text-[#676767]">
          (237 kết quả)
        </Text>
      </Text>
      <TouchableOpacity className="flex-row gap-2 items-center px-4 py-2 ml-auto bg-white rounded-full">
        <Text className="text-sm font-medium leading-tight text-[#676767]">
          Sắp xếp
        </Text>
        <FontAwesome5 name="sort-amount-down-alt" size={16} color="#676767" />
      </TouchableOpacity>
    </View>
  );
};

const RenderTwoProduct = () => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View className="flex-row gap-2 bg-[#EEE] pb-2">
      <ProductItem
        name={"Sản phẩm 1"}
        price={100000}
        originalPrice={150000}
        discount={20}
        rating={4.5}
        soldCount={100}
        location={"Hà Nội"}
        width={width}
        id={"123"}
      />
      <ProductItem
        name={"Sản phẩm 2"}
        price={100000}
        originalPrice={150000}
        discount={20}
        rating={4.5}
        soldCount={100}
        location={"Hà Nội"}
        width={width}
        id={"123"}
      />
    </View>
  );
};

const ShopProduct = () => {
  const [flashListData, setFlashListData] = useState<any[]>([]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "header") {
      return <Header />;
    }

    if (item.type === "product") {
      return <RenderTwoProduct />;
    }

    return null;
  };

  useEffect(() => {
    setFlashListData([
      { type: "header" },
      { type: "product" },
      { type: "product" },
      { type: "product" },
    ]);
  }, []);
  return (
    <View className="flex-1 px-2 py-3">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
      />
    </View>
  );
};

export default ShopProduct;
