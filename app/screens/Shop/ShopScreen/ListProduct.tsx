import { View } from "react-native";

import { FlatList } from "react-native";
import ProductItem from "~/components/common/ProductItem";
import { IProduct } from "~/services/api/product.service";
import { calculateDiscount, checkCanRender, screen } from "~/utils";

const ListProduct = ({ data }: { data: IProduct[] }) => {
  if (!checkCanRender(data)) return null;

  return (
    <View className="w-full">
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
            width={screen.width / 2.5 - 16}
            className="flex-1"
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-2 py-3"
        ItemSeparatorComponent={() => <View className="w-2" />}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        windowSize={3}
        getItemLayout={(data, index) => ({
          length: screen.width / 2.5 - 16,
          offset: (screen.width / 2.5 - 16) * index,
          index,
        })}
      />
    </View>
  );
};

export default ListProduct;
