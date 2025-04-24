import { TouchableOpacity, View } from "react-native";
import ShopPromotion from "../ShopPromotion";
import ShopScreenContainer from "./Container";
import { Text } from "~/components/ui/text";
import { imagePaths } from "~/assets/imagePath";
import { Image } from "expo-image";
import ListProduct from "./ListProduct";
import Category from "~/components/common/Category";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import useGetShopId from "../useGetShopId";
import { IProduct, productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { checkCanRender } from "~/utils";
import { categoryService } from "~/services/api/category.service";
import { shopService } from "~/services/api/shop.service";
import { deepEqual } from "fast-equals";
import Empty from "~/components/common/Empty";
import { activeIndexAtom } from "../atom";
import { useSetAtom } from "jotai";

type ProductIdsSection = {
  shopId: string;
  queryKey: string;
  title: string;
  dataProvider: "productIds";
  productIds: number[];
};

type CategoryIdSection = {
  shopId: string;
  queryKey: string;
  title: string;
  dataProvider: "categoryId";
  categoryId: number;
};

type ISection = ProductIdsSection | CategoryIdSection;

const ProductSection = memo(
  (props: ISection) => {
    const { shopId, queryKey, title, dataProvider } = props;

    const setActiveIndex = useSetAtom(activeIndexAtom);

    const { data } = useQuery({
      queryKey: [
        queryKey,
        "shop",
        dataProvider === "productIds"
          ? (props as ProductIdsSection).productIds?.join(",")
          : (props as CategoryIdSection).categoryId?.toString(),
      ],
      queryFn: () =>
        productService.searchProducts({
          ids:
            dataProvider === "productIds"
              ? (props as ProductIdsSection).productIds?.join(",")
              : undefined,
          categoryId:
            dataProvider === "categoryId"
              ? (props as CategoryIdSection).categoryId?.toString()
              : undefined,
          skip: 0,
          take: 100,
          shopId: shopId,
        }),
      select: (data) => data.data,
      enabled:
        dataProvider === "productIds"
          ? !!(props as ProductIdsSection).productIds?.length
          : !(
              (props as CategoryIdSection).categoryId === null ||
              (props as CategoryIdSection).categoryId === undefined
            ),
    });

    if (!checkCanRender(data)) return null;

    return (
      <ShopScreenContainer
        title={title}
        onPress={() => {
          setActiveIndex(2);
        }}
      >
        <ListProduct data={data!} />
      </ShopScreenContainer>
    );
  },
  (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  }
);

const CategorySection = () => {
  const shopId = useGetShopId();

  const setActiveIndex = useSetAtom(activeIndexAtom);

  return (
    <ShopScreenContainer
      title="Danh mục của Shop"
      onPress={() => {
        setActiveIndex(3);
      }}
    >
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

const BannerSection = ({ banner }: { banner: string }) => {
  return (
    <View className="px-2 mb-2">
      <TouchableOpacity>
        <Image
          source={banner}
          className="w-full aspect-[2/1] rounded-2xl"
          contentFit="cover"
        />
      </TouchableOpacity>
    </View>
  );
};

const ShopScreen = () => {
  const shopId = useGetShopId();

  const { data: shop } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => shopService.getShopDetail(shopId),
  });

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.type === "promotion") {
        return <ShopPromotion />;
      }

      if (item.type === "suggestForYou") {
        return (
          <ProductSection
            dataProvider="productIds"
            productIds={shop?.suggestionProductIds || []}
            shopId={shopId?.toString() || ""}
            queryKey={"suggestForYou"}
            title="Gợi ý cho bạn"
          />
        );
      }

      if (item.type === "promotionSection") {
        return (
          <ProductSection
            dataProvider="productIds"
            productIds={shop?.hotDealProductIds || []}
            shopId={shopId?.toString() || ""}
            queryKey={"promotion"}
            title="ƯU ĐÃI KHỦNG"
          />
        );
      }

      if (item.type === "categorySection") {
        return <CategorySection />;
      }

      if (item.type === "Section") {
        return (
          <ProductSection
            dataProvider="categoryId"
            categoryId={item.categoryId || 0}
            shopId={shopId?.toString() || ""}
            queryKey={"Section" + item.id}
            title={item.heading || ""}
          />
        );
      }

      if (item.type === "banner") {
        return <BannerSection banner={item.banner} />;
      }

      return null;
    },
    [shopId, shop?.suggestionProductIds, shop?.hotDealProductIds]
  );

  const flashListData = useMemo(() => {
    const baseItems: any[] = [
      { type: "promotion", id: "promotion" },
      { type: "suggestForYou", id: "suggestForYou" },
      { type: "promotionSection", id: "promotionSection" },
      { type: "categorySection", id: "categorySection" },
    ];

    if (shop?.repeaters?.length) {
      shop.repeaters.forEach((item, index) => {
        if (item?.banner) {
          baseItems.push({
            type: "banner",
            id: "banner" + index.toString(),
            banner: item.banner,
          });
        }

        baseItems.push({
          type: "Section",
          id: "Section" + index.toString(),
          categoryId: item.categoryId,
          heading: item.heading,
        });
      });
    }

    return [...baseItems];
  }, [shop]);

  return (
    <View className="flex-1">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={320}
        getItemType={(item) => item.type}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Empty
            title="Không có dữ liệu"
            backgroundColor="#fff"
            isLoading={false}
          />
        }
        ListFooterComponent={<View className="h-20" />}
      />
    </View>
  );
};

export default ShopScreen;
