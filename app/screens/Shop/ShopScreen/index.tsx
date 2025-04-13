import { TouchableOpacity, View } from "react-native";
import ShopPromotion from "../ShopPromotion";
import ShopScreenContainer from "./Container";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Image } from "expo-image";
import ListProduct from "./ListProduct";
import Category from "~/components/common/Category";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

const SuggestForYouSection = () => {
  return (
    <ShopScreenContainer title="Gợi ý cho bạn" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const PromotionSection = () => {
  return (
    <ShopScreenContainer
      onPress={() => {}}
      componentTitle={
        <View className="flex-row gap-2 items-center">
          <Image
            source={imagePaths.icFire}
            className="size-5"
            contentFit="contain"
          />
          <Text className="text-sm font-bold">ƯU ĐÃI KHỦNG</Text>
        </View>
      }
    >
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const CategorySection = () => {
  return (
    <ShopScreenContainer title="Danh mục của Shop" onPress={() => {}}>
      <View className="p-2">
        <Category itemBgColor="#FFF5DF" textColor="#676767" />
      </View>
    </ShopScreenContainer>
  );
};

const BannerSection = () => {
  return (
    <View className="px-2">
      <TouchableOpacity>
        <Image
          source={imagePaths.shopBackground}
          className="w-full aspect-[2/1] rounded-2xl"
          contentFit="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const BestSellerSection = () => {
  return (
    <ShopScreenContainer title="Sản phẩm bán chạy" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const GardeningToolsSection = () => {
  return (
    <ShopScreenContainer title="Dụng cụ làm vườn" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const FertilizerSection = () => {
  return (
    <ShopScreenContainer title="Phân bón, bảo vệ cây trồng" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const SoilSection = () => {
  return (
    <ShopScreenContainer title="Đất trồng giá thể" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const SeedSection = () => {
  return (
    <ShopScreenContainer title="Hạt giống chất lượng" onPress={() => {}}>
      <ListProduct data={[...Array(10)]} />
    </ShopScreenContainer>
  );
};

const ShopScreen = () => {
  const [flashListData, setFlashListData] = useState<any[]>([]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "promotion") {
      return <ShopPromotion />;
    }

    if (item.type === "suggestForYou") {
      return <SuggestForYouSection />;
    }

    if (item.type === "promotionSection") {
      return <PromotionSection />;
    }

    if (item.type === "categorySection") {
      return <CategorySection />;
    }

    if (item.type === "bannerSection") {
      return <BannerSection />;
    }

    if (item.type === "bestSellerSection") {
      return <BestSellerSection />;
    }

    if (item.type === "gardeningToolsSection") {
      return <GardeningToolsSection />;
    }

    if (item.type === "fertilizerSection") {
      return <FertilizerSection />;
    }

    if (item.type === "soilSection") {
      return <SoilSection />;
    }

    if (item.type === "seedSection") {
      return <SeedSection />;
    }

    return null;
  };

  useEffect(() => {
    setFlashListData([
      { type: "promotion" },
      { type: "suggestForYou" },
      { type: "promotionSection" },
      { type: "categorySection" },
      { type: "bannerSection" },
      { type: "bestSellerSection" },
      { type: "gardeningToolsSection" },
      { type: "fertilizerSection" },
      { type: "soilSection" },
      { type: "seedSection" },
    ]);
  }, []);

  return (
    <View className="flex-1">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={320}
        getItemType={(item) => item.type}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

export default ShopScreen;
