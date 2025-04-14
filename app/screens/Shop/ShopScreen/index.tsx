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
import useGetShopId from "../useGetShopId";
import { productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { checkCanRender } from "~/utils";
import { categoryService } from "~/services/api/category.service";

const SuggestForYouSection = () => {
  const { data: suggestForYou } = useQuery({
    queryKey: ["suggestForYou", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(suggestForYou)) return null;

  return (
    <ShopScreenContainer title="Gợi ý cho bạn" onPress={() => {}}>
      <ListProduct data={suggestForYou!} />
    </ShopScreenContainer>
  );
};

const PromotionSection = () => {
  const { data: promotion } = useQuery({
    queryKey: ["promotion", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(promotion)) return null;

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
      <ListProduct data={promotion!} />
    </ShopScreenContainer>
  );
};

const CategorySection = () => {
  const shopId = useGetShopId();

  return (
    <ShopScreenContainer title="Danh mục của Shop" onPress={() => {}}>
      <Category
        itemBgColor="#FFF5DF"
        textColor="#676767"
        className="p-2"
        getCategoriesApi={(payload) => {
          return categoryService.getCategoryByShopId({
            ...payload,
            shopId: shopId,
          });
        }}
        queryKey={["categoryByShopId", (shopId || 0)?.toString()]}
      />
    </ShopScreenContainer>
  );
};

const BannerSection = () => {
  return (
    <View className="px-2 mb-2">
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
  const { data: bestSeller } = useQuery({
    queryKey: ["bestSeller", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(bestSeller)) return null;

  return (
    <ShopScreenContainer title="Sản phẩm bán chạy" onPress={() => {}}>
      <ListProduct data={bestSeller!} />
    </ShopScreenContainer>
  );
};

const GardeningToolsSection = () => {
  const { data: gardeningTools } = useQuery({
    queryKey: ["gardeningTools", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(gardeningTools)) return null;

  return (
    <ShopScreenContainer title="Dụng cụ làm vườn" onPress={() => {}}>
      <ListProduct data={gardeningTools!} />
    </ShopScreenContainer>
  );
};

const FertilizerSection = () => {
  const { data: fertilizer } = useQuery({
    queryKey: ["fertilizer", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(fertilizer)) return null;

  return (
    <ShopScreenContainer title="Phân bón, bảo vệ cây trồng" onPress={() => {}}>
      <ListProduct data={fertilizer!} />
    </ShopScreenContainer>
  );
};

const SoilSection = () => {
  const { data: soil } = useQuery({
    queryKey: ["soil", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(soil)) return null;

  return (
    <ShopScreenContainer title="Đất trồng giá thể" onPress={() => {}}>
      <ListProduct data={soil!} />
    </ShopScreenContainer>
  );
};

const SeedSection = () => {
  const { data: seed } = useQuery({
    queryKey: ["seed", "shop"],
    queryFn: () => productService.getRecommendedProducts(),
    staleTime: 1000 * 60 * 5,
  });

  if (!checkCanRender(seed)) return null;

  return (
    <ShopScreenContainer title="Hạt giống chất lượng" onPress={() => {}}>
      <ListProduct data={seed!} />
    </ShopScreenContainer>
  );
};

const ShopScreen = () => {
  const shopId = useGetShopId();
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
      />
    </View>
  );
};

export default ShopScreen;
