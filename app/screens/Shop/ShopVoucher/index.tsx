import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { deepEqual } from "fast-equals";
import { memo, useCallback, useMemo, useState } from "react";
import { View } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { toast } from "~/components/common/Toast";
import { usePagination } from "~/hooks/usePagination";
import { IProduct, productService } from "~/services/api/product.service";
import { IVoucher, shopService } from "~/services/api/shop.service";
import {
  checkCanRender,
  convertToK,
  formatDate,
  getItemWidth,
  preHandleFlashListData,
} from "~/utils";
import useGetShopId from "../useGetShopId";
import Deal from "./Deal";
import { VoucherBottom, VoucherHeader } from "./VoucherContainer";
import VoucherItem from "./VoucherItem";

const RenderTwoVoucher = memo(
  ({ items }: { items: IVoucher[] }) => {
    const onPress = (id: string) => {
      toast.success("Đã lưu voucher");
    };

    return (
      <View className="flex-row flex-wrap gap-x-2 gap-y-2 px-2 pb-2 bg-white">
        {items?.map((item) => (
          <VoucherItem
            key={item.id}
            description={item.title}
            amount={(item.amount || 0)?.toLocaleString()}
            minimumAmount={convertToK(item.minimumAmount)}
            maximumReduction={convertToK(item.maximumReduction)}
            expiryDate={formatDate(item.expiryDate)}
            onPressSave={() => onPress(item.id.toString())}
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

  const { data: shop } = useQuery({
    queryKey: ["shop", shopId],
    queryFn: () => shopService.getShopDetail(shopId),
  });

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
    queryFn: () =>
      productService.searchProducts({
        shopId: shopId?.toString(),
        ids: shop?.bestSelling?.productIds.join(","),
        skip: 0,
        take: 100,
      }),
    enabled: !!shopId && !!shop?.bestSelling?.productIds?.length,
    select: (data) => data.data,
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
      // {
      //   type: "deal",
      //   items: recommendedProducts,
      //   expanded: expandedDeal,
      // },
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
        ListFooterComponent={<View className="h-10" />}
      />
    </View>
  );
};

export default ShopVoucher;
