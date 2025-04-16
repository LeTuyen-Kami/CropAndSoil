import { View } from "react-native";

import { FlatList } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { IProduct } from "~/services/api/product.service";
import { calculateDiscount, checkCanRender } from "~/utils";

const ListProduct = ({ data }: { data: IProduct[] }) => {
  if (!checkCanRender(data)) return null;

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => (
        <ProductItem
          discount={calculateDiscount(item)}
          name={item.name}
          price={item.salePrice}
          originalPrice={item.regularPrice}
          soldCount={item.totalSales}
          rating={item.averageRating}
          id={item.id}
          image={item.thumbnail}
          location={item?.shop?.shopWarehouseLocation?.province?.name}
          className="flex-1"
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="px-2 py-3"
      ItemSeparatorComponent={() => <View className="w-2" />}
    />
  );
};

export default ListProduct;
