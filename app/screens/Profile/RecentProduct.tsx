import { ScrollView, View } from "react-native";
import SectionTitle from "./SectionTitlte";
import { useAtomValue } from "jotai";
import { authAtom } from "~/store/atoms";
import ProductItem from "~/components/common/ProductItem";
import { useQuery } from "@tanstack/react-query";
import { commonService } from "~/services/api/common.service";
import { calculateDiscount, checkCanRender } from "~/utils";
import { FlatList } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";
import { useEffect } from "react";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
const RecentProduct = () => {
  const isFocused = useIsFocused();
  const auth = useAtomValue(authAtom);
  const navigation = useSmartNavigation();

  const { data: recentlyViewedProducts, refetch } = useQuery({
    queryKey: ["recently-viewed-products"],
    queryFn: () => commonService.getRecentlyViewedProducts(),
    enabled: false,
  });

  useEffect(() => {
    if (isFocused) {
      refetch();
    }
  }, [isFocused]);

  if (!checkCanRender(recentlyViewedProducts)) return null;

  return (
    <View className="bg-white  rounded-xl mb-2.5">
      <SectionTitle
        title="Đã xem gần đây"
        actionText={auth?.isLoggedIn ? "" : "Đăng nhập để xem"}
        showArrow={true}
        onPress={() => {
          if (!auth?.isLoggedIn) {
            navigation.smartNavigate("Login");
          }
        }}
      />

      {auth?.isLoggedIn && (
        <FlatList
          data={recentlyViewedProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            paddingHorizontal: 8,
            paddingBottom: 8,
          }}
          renderItem={({ item: product }) => (
            <ProductItem
              name={product?.name}
              price={product?.salePrice}
              originalPrice={product?.regularPrice}
              discount={calculateDiscount(product)}
              rating={product?.averageRating}
              soldCount={product?.totalSales}
              image={product?.images[0]}
              onSale={product?.regularPrice > product?.salePrice}
              id={product?.id}
              location={product?.shop?.shopWarehouseLocation?.province?.name}
              className="flex-grow"
            />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

export default RecentProduct;
