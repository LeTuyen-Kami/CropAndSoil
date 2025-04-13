import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import Vouchers from "./Vouchers";
import VoucherContainer from "./VoucherContainer";
import VoucherItem from "./VoucherItem";
import ProductItem from "~/components/common/ProductItem";
import { getItemWidth } from "~/utils";
import Deal from "./Deal";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";

const ShopVoucherComp = () => {
  return (
    <VoucherContainer title="Voucher của Shop">
      <VoucherItem />
      <VoucherItem />
      <VoucherItem />
      <VoucherItem />
    </VoucherContainer>
  );
};

const TopProduct = () => {
  return (
    <VoucherContainer title="Top sản phẩm bán chạy!">
      {Array.from({ length: 10 }).map((_, index) => (
        <ProductItem
          key={index}
          width={
            getItemWidth({
              containerPadding: 16,
              itemGap: 8,
            }).itemWidth
          }
          name="Sản phẩm"
          price={100000}
          originalPrice={100000}
          location="Hà Nội"
          rating={4.5}
          soldCount={100}
          id={"123"}
        />
      ))}
    </VoucherContainer>
  );
};

const PrivateVoucher = () => {
  return (
    <VoucherContainer title="Cho riêng bạn">
      {Array.from({ length: 10 }).map((_, index) => (
        <ProductItem
          key={index}
          width={
            getItemWidth({
              containerPadding: 16,
              itemGap: 8,
            }).itemWidth
          }
          name="Sản phẩm"
          price={100000}
          originalPrice={100000}
          location="Hà Nội"
          rating={4.5}
          soldCount={100}
          id={"123"}
        />
      ))}
    </VoucherContainer>
  );
};

{
  /* <ScrollView className="flex-1">
<View className="flex-1 gap-2">

  <VoucherContainer title="Top sản phẩm bán chạy!">
    {Array.from({ length: 10 }).map((_, index) => (
      <ProductItem
        key={index}
        width={
          getItemWidth({
            containerPadding: 16,
            itemGap: 8,
          }).itemWidth
        }
        name="Sản phẩm"
        price={100000}
        originalPrice={100000}
        location="Hà Nội"
        rating={4.5}
        soldCount={100}
      />
    ))}
  </VoucherContainer>

  <VoucherContainer title="Cho riêng bạn">
    {Array.from({ length: 10 }).map((_, index) => (
      <ProductItem
        key={index}
        width={
          getItemWidth({
            containerPadding: 16,
            itemGap: 8,
          }).itemWidth
        }
        name="Sản phẩm"
        price={100000}
        originalPrice={100000}
        location="Hà Nội"
        rating={4.5}
        soldCount={100}
      />
    ))}
  </VoucherContainer>
</View>
</ScrollView> */
}

const ShopVoucher = () => {
  const [flashListData, setFlashListData] = useState<any[]>([]);

  const renderItem = ({ item }: { item: any }) => {
    if (item.type === "shopVoucher") {
      return <ShopVoucherComp />;
    }

    if (item.type === "deal") {
      return <Deal />;
    }

    if (item.type === "topProduct") {
      return <TopProduct />;
    }

    if (item.type === "privateVoucher") {
      return <PrivateVoucher />;
    }

    return null;
  };

  useEffect(() => {
    setFlashListData([
      {
        type: "shopVoucher",
      },
      {
        type: "deal",
      },
      {
        type: "topProduct",
      },
      {
        type: "privateVoucher",
      },
    ]);
  }, []);

  return (
    <View className="flex-1">
      <FlashList
        data={flashListData}
        renderItem={renderItem}
        estimatedItemSize={500}
        getItemType={(item) => item.type}
        ItemSeparatorComponent={() => <View className="h-5" />}
      />
    </View>
  );
};

export default ShopVoucher;
