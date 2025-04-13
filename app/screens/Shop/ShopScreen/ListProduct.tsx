import { View } from "react-native";

import { FlatList } from "react-native";
import ProductItem from "~/components/common/ProductItem";

const ListProduct = ({ data }: { data: any[] }) => {
  return (
    <FlatList
      data={data}
      renderItem={() => (
        <ProductItem
          discount={20}
          name={"Sản phẩm 1"}
          price={100000}
          originalPrice={120000}
          soldCount={100}
          rating={4.5}
          location="Hà Nội"
          id={"123"}
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
