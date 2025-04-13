import { useNavigation, useRoute } from "@react-navigation/native";
import { Image } from "expo-image";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Gallery, { GalleryItem } from "~/components/common/Galery";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Text } from "~/components/ui/text";
import { screen } from "~/utils";
import Info from "./Info";
import Rating from "./Rating";
import ShopInfo from "./ShopInfo";
import TopProduct from "./TopProduct";
import Detail from "./Detail";
import MaybeLike from "./MaybeLike";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { searchService } from "~/services/api/search.services";
import { productService } from "~/services/api/product.service";
import { RootStackRouteProp } from "~/navigation/types";
import ListImage from "./ListImage";
import { FlashList } from "@shopify/flash-list";
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

const DetailProduct = () => {
  const route = useRoute<RootStackRouteProp<"DetailProduct">>();
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
    await queryClient.refetchQueries({
      queryKey: ["productDetail", id],
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
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={<ListImage id={id} />}
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={200}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.type}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </ScreenWrapper>
  );
};

export default DetailProduct;
