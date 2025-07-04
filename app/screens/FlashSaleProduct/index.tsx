import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import Animated, {
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import Badge from "~/components/common/Badge";
import { cartService } from "~/services/api/cart.service";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { screen } from "~/utils";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";
import { toast } from "~/components/common/Toast";
import { INVALID_ACCOUNT_MESSAGE } from "~/utils/contants";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as unknown as React.ComponentType<FlashListProps<any>>
);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Header = ({ scrollY }: { scrollY: SharedValue<number> }) => {
  const { top } = useSafeAreaInsets();
  const navigation = useSmartNavigation();
  const auth = useAtomValue(authAtom);

  const isApproved = auth?.isLoggedIn && auth?.user?.isApproved;

  const { data: detailCart } = useQuery({
    queryKey: ["detail-cart"],
    queryFn: () => cartService.getDetailCart(),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const count = useMemo(() => {
    return detailCart?.cartShops?.reduce((acc, item) => {
      return acc + item.items.reduce((acc, item) => acc + item.quantity, 0);
    }, 0);
  }, [detailCart]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, screen.width], [0, 1], "clamp"),
    };
  });

  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollY.value, [0, screen.width], [0.9, 1], "clamp"),
      backgroundColor: interpolateColor(
        scrollY.value,
        [0, screen.width],
        ["#F5F5F5", "#fff"]
      ),
    };
  });

  const onPressCart = () => {
    if (!isApproved) {
      toast.error(INVALID_ACCOUNT_MESSAGE);
      return;
    }
    navigation.smartNavigate("ShoppingCart");
  };

  return (
    <Animated.View className="absolute z-10 px-4 w-full" style={{ top: top }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            top: -top,
          },
        ]}
        className={"absolute right-0 left-0 -bottom-1 bg-white"}
      />
      <View className="flex-row justify-between items-center w-full">
        <AnimatedTouchableOpacity
          onPress={() => navigation.smartGoBack()}
          className="justify-center items-center w-10 h-10 bg-[#F5F5F5] rounded-full opacity-90"
          style={buttonAnimatedStyle}
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
        </AnimatedTouchableOpacity>
        <AnimatedTouchableOpacity
          className="justify-center items-center w-10 h-10 bg-[#F5F5F5] rounded-full opacity-90"
          style={buttonAnimatedStyle}
          onPress={onPressCart}
        >
          <Image
            source={imagePaths.icCart}
            cachePolicy="memory"
            style={{
              width: 20,
              height: 20,
              tintColor: "#AEAEAE",
            }}
          />
          {!!count && count > 0 && (
            <Badge
              count={Math.max(count || 0, 0)}
              className="absolute -top-2 -right-2"
              textClassName="text-white"
            />
          )}
        </AnimatedTouchableOpacity>
      </View>
    </Animated.View>
  );
};

const FlashSaleProduct = () => {
  const route = useRoute<RootStackRouteProp<"FlashSaleProduct">>();
  const { id } = route.params;
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const scrollY = useSharedValue(0);

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

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  return (
    <ScreenWrapper
      hasGradient={false}
      hasSafeTop={false}
      hasSafeBottom={false}
      backgroundColor="#EEE"
    >
      <Header scrollY={scrollY} />
      <AnimatedFlashList
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
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
