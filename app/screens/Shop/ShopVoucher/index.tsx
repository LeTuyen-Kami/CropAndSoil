import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import Vouchers from "./Vouchers";
import VoucherContainer, {
  VoucherBottom,
  VoucherHeader,
} from "./VoucherContainer";
import VoucherItem from "./VoucherItem";
import ProductItem from "~/components/common/ProductItem";
import {
  checkCanRender,
  convertToK,
  formatDate,
  getItemWidth,
  preHandleFlashListData,
} from "~/utils";
import Deal from "./Deal";
import { FlashList } from "@shopify/flash-list";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { IVoucher, shopService } from "~/services/api/shop.service";
import { usePagination } from "~/hooks/usePagination";
import useGetShopId from "../useGetShopId";
import { IProduct, productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { deepEqual } from "fast-equals";

const TopProduct = ({ items }: { items: IProduct[] | undefined }) => {
  if (!checkCanRender(items)) return null;

  const itemWidth = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    });
  }, []);

  return (
    <VoucherContainer title="Top sản phẩm bán chạy!">
      {items?.map((item) => (
        <ProductItem
          key={item.id}
          width={itemWidth.itemWidth}
          name={item.name}
          price={item.salePrice}
          originalPrice={item.regularPrice}
          rating={item.averageRating}
          soldCount={item.totalSales}
          location={item.shop?.shopWarehouseLocation?.province?.name}
          id={item.id}
          image={item.thumbnail}
          height={"100%"}
        />
      ))}
    </VoucherContainer>
  );
};

const PrivateVoucher = ({ items }: { items: IProduct[] | undefined }) => {
  if (!checkCanRender(items)) return null;

  const itemWidth = useMemo(() => {
    return getItemWidth({
      containerPadding: 16,
      itemGap: 8,
    });
  }, []);
  return (
    <VoucherContainer title="Cho riêng bạn">
      {items?.map((item) => (
        <ProductItem
          key={item.id}
          width={itemWidth.itemWidth}
          name={item.name}
          price={item.salePrice}
          originalPrice={item.regularPrice}
          rating={item.averageRating}
          soldCount={item.totalSales}
          location={item.shop?.shopWarehouseLocation?.province?.name}
          id={item.id}
          image={item.thumbnail}
          height={"100%"}
        />
      ))}
    </VoucherContainer>
  );
};

const RenderTwoVoucher = memo(
  ({ items }: { items: IVoucher[] }) => {
    return (
      <View className="flex-row flex-wrap gap-x-2 gap-y-2 px-2 pb-2 bg-white">
        {items?.map((item) => (
          <VoucherItem
            key={item.id}
            description={item.description}
            amount={(item.amount || 0)?.toLocaleString()}
            minimumAmount={convertToK(item.minimumAmount)}
            maximumReduction={convertToK(item.maximumReduction)}
            expiryDate={formatDate(item.expiryDate)}
          />
        ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  }
);

const RenderTwoProduct = memo(
  ({ items }: { items: IProduct[] }) => {
    if (!checkCanRender(items)) return null;

    const itemWidth = useMemo(() => {
      return getItemWidth({
        containerPadding: 16,
        itemGap: 8,
      });
    }, []);

    return (
      <View className="flex-row flex-wrap gap-x-2 gap-y-2 px-2 pb-2 bg-white">
        {items?.map((item) => (
          <ProductItem
            key={item.id}
            name={item.name}
            price={item.salePrice}
            originalPrice={item.regularPrice}
            rating={item.averageRating}
            id={item.id}
            soldCount={item.totalSales}
            width={itemWidth.itemWidth}
            height={"100%"}
            image={item.thumbnail}
            location={item.shop?.shopWarehouseLocation?.province?.name}
          />
        ))}
      </View>
    );
  },
  (prevProps, nextProps) => {
    return deepEqual(prevProps, nextProps);
  }
);
const ShopVoucher = () => {
  const shopId = useGetShopId();
  const [expandedDeal, setExpandedDeal] = useState(false);

  const { data, hasNextPage, fetchNextPage } = usePagination(
    shopService.getListVoucher,
    {
      queryKey: ["vouchers", (shopId || "")?.toString()],
      enabled: !!shopId,
      initialParams: {
        shopId: shopId,
      },
    }
  );

  const { data: recommendedProducts } = useQuery({
    queryKey: ["shopRecommendedProducts"],
    queryFn: () => productService.getRecommendedProducts(),
  });

  const { data: topProducts } = useQuery({
    queryKey: ["shopTopProducts"],
    queryFn: () => productService.getRecommendedProducts(),
  });

  const { data: privateProducts } = useQuery({
    queryKey: ["shopPrivateProducts"],
    queryFn: () => productService.getRecommendedProducts(),
  });

  const renderItem = useCallback(({ item }: { item: any }) => {
    if (item.type === "voucherHeader") {
      return <VoucherHeader title={item.title} />;
    }

    if (item.type === "voucher") {
      return <RenderTwoVoucher items={item.items} />;
    }

    if (item.type === "product") {
      return <RenderTwoProduct items={item.items} />;
    }

    if (item.type === "voucherBottom") {
      return <VoucherBottom />;
    }

    if (item.type === "deal") {
      return (
        <Deal
          recommendedProducts={item.items}
          expanded={item.expanded}
          onPress={() => setExpandedDeal((prev) => !prev)}
        />
      );
    }

    if (item.type === "topProduct") {
      return <TopProduct items={item.items} />;
    }

    if (item.type === "privateVoucher") {
      return <PrivateVoucher items={item.items} />;
    }

    return null;
  }, []);

  const flashListData = useMemo(() => {
    const handledData = preHandleFlashListData(data, "voucher");

    const handleProductData = preHandleFlashListData(
      topProducts || [],
      "product"
    );

    const handlePrivateProductData = preHandleFlashListData(
      privateProducts || [],
      "product"
    );

    const createClusterData = <T,>(
      data: T[],
      title: string,
      {
        hasHeader = true,
        hasBottom = true,
      }: {
        hasHeader?: boolean;
        hasBottom?: boolean;
      } = {
        hasHeader: true,
        hasBottom: true,
      }
    ) => {
      if (!checkCanRender(data)) return [];

      return [
        ...(hasHeader
          ? [
              {
                type: "voucherHeader",
                title: title,
              },
            ]
          : []),
        ...data,
        ...(hasBottom
          ? [
              {
                type: "voucherBottom",
              },
            ]
          : []),
      ];
    };

    return [
      ...createClusterData(handledData, "Voucher của Shop"),
      {
        type: "deal",
        items: recommendedProducts,
        expanded: expandedDeal,
      },
      ...createClusterData(handleProductData, "Top sản phẩm bán chạy!"),
      ...createClusterData(handlePrivateProductData, "Cho riêng bạn"),
    ];
  }, [data, recommendedProducts, expandedDeal, topProducts, privateProducts]);

  return (
    <View className="flex-1">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={500}
        getItemType={(item) => item.type}
        overrideItemLayout={(layout, item) => {
          if (item.type === "deal" && "items" in item) {
            layout.size = expandedDeal
              ? (item?.items?.length || 1) * 200
              : Math.min(400, (item?.items?.length || 1) * 200);
          }

          if (item.type === "voucherHeader") {
            layout.size = 50;
          }

          if (item.type === "voucher") {
            layout.size = 200;
          }
        }}
        ListFooterComponent={<View className="h-10" />}
      />
    </View>
  );
};

export default ShopVoucher;
