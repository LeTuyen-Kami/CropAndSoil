import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, View } from "react-native";
import Empty from "~/components/common/Empty";
import Header from "~/components/common/Header";
import ProductItem from "~/components/common/ProductItem";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { COLORS } from "~/constants/theme";
import { RootStackRouteProp } from "~/navigation/types";
import { IProduct, productService } from "~/services/api/product.service";
import { calculateDiscount, chunkArray, getItemWidth, screen } from "~/utils";

type ProductByParams = {
  productIds: string[];
  title: string;
};

const RenderTwoProduct = ({ items }: { items: IProduct[] }) => {
  const width = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    }).itemWidth;
  }, []);

  return (
    <View className="flex-row gap-2 bg-[#EEE] pb-2 px-2">
      {items.map((item) => (
        <ProductItem
          key={item.id}
          width={width}
          name={item.name}
          price={item.salePrice}
          originalPrice={item.regularPrice}
          discount={calculateDiscount(item)}
          rating={item.averageRating}
          soldCount={item.totalSales}
          id={item.id}
          image={item.thumbnail}
          onSale={item.regularPrice > item.salePrice}
          location={item.shop?.shopWarehouseLocation?.province?.name}
          height={"100%"}
        />
      ))}
    </View>
  );
};

const ProductByScreen = () => {
  const route = useRoute<RootStackRouteProp<"ProductBy">>();
  const { productIds, title } = route.params as ProductByParams;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: products, refetch } = useQuery({
    queryKey: ["products-by-ids", productIds],
    queryFn: () =>
      productService.searchProducts({
        ids: productIds.join(","),
        take: productIds.length,
      }),
    enabled: productIds.length > 0,
    select: (data) => data.data,
  });

  const flashListData = useMemo(() => {
    if (!products || products.length === 0) return [];

    // Tạo các chunk gồm 2 sản phẩm mỗi chunk
    const chunkedProducts = chunkArray(products, 2);

    // Tạo các item cho FlashList từ chunked products
    return chunkedProducts.map((chunk, index) => ({
      id: `product-chunk-${index}`,
      type: "products",
      items: chunk,
    }));
  }, [products]);

  const onRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const renderItem = ({ item }: { item: any }) => {
    return <RenderTwoProduct items={item.items} />;
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeTop={false} hasSafeBottom={false}>
      <Header
        title={title}
        className="bg-transparent border-0"
        textColor="white"
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl overflow-hidden">
        <FlashList
          data={flashListData}
          renderItem={renderItem}
          estimatedItemSize={200}
          getItemType={(item) => item.type}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
            />
          }
          ListEmptyComponent={() => (
            <Empty title="Không có sản phẩm nào" isLoading={!products} />
          )}
          ListFooterComponent={() => <View className="h-10" />}
          ItemSeparatorComponent={() => <View className="h-2" />}
          contentContainerClassName="px-2 py-2"
        />
      </View>
    </ScreenWrapper>
  );
};

export default ProductByScreen;
