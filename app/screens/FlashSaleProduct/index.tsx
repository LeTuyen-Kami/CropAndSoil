import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { RefreshControl, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { RootStackRouteProp } from "~/navigation/types";
import BottomButton from "./BottomButton";
import Detail from "./Detail";
import Info from "./Info";
import ListImage from "./ListImage";
import MaybeLike from "./MaybeLike";
import Rating from "./Rating";
import ShopInfo from "./ShopInfo";
import TopProduct from "./TopProduct";
import { COLORS } from "~/constants/theme";
const Header = () => {
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View className="absolute z-10 px-4 w-full" style={{ top: top }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        className="w-10 h-10 bg-[#E3E3E3] rounded-full items-center justify-center"
      >
        <Image
          source={imagePaths.icArrowLeft}
          cachePolicy="memory"
          style={{
            width: 8,
            height: 16,
            tintColor: "#AEAEAE",
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const FlashSaleProduct = () => {
  const route = useRoute<RootStackRouteProp<"FlashSaleProduct">>();
  const { id } = route.params;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "images":
        return <ListImage id={id} />;
      case "info":
        return <Info id={id} />;
      case "rating":
        return <Rating id={id} />;
      case "shopInfo":
        return <ShopInfo id={id} />;
      case "topProduct":
        return <TopProduct id={id} />;
      case "detail":
        return <Detail id={id} />;
      case "maybeLike":
        return <MaybeLike id={id} />;
      default:
        return null;
    }
  };

  const flashListData = useMemo(() => {
    return [
      {
        type: "info",
        height: 200,
      },
      {
        type: "rating",
        height: 200,
      },
      {
        type: "shopInfo",
        height: 200,
      },
      {
        type: "topProduct",
        height: 200,
      },
      {
        type: "detail",
        height: 200,
      },
      {
        type: "maybeLike",
        height: 200,
      },
    ];
  }, [id]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({
      predicate: (query) =>
        (query.queryKey.includes("flash-sale-product-detail") &&
          query.queryKey.includes(id.toString())) ||
        (query.queryKey.includes("topProducts") &&
          query.queryKey.includes(id.toString())),
    });
    setIsRefreshing(false);
  };

  return (
    <ScreenWrapper
      hasGradient={false}
      hasSafeTop={false}
      hasSafeBottom={false}
      backgroundColor="#EEE"
    >
      <Header />
      <FlashList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={<ListImage id={id} />}
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.type}
        ListFooterComponent={<View className="h-10" />}
      />
      <BottomButton flashSaleProductId={id} />
    </ScreenWrapper>
  );
};

export default FlashSaleProduct;
