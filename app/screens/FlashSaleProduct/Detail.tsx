import { useQuery } from "@tanstack/react-query";
import { Image } from "expo-image";
import { deepEqual } from "fast-equals";
import React, { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import WebViewContent from "~/components/common/WebViewContent";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { flashSaleService } from "~/services/api/flashsale.service";
const Detail = ({ id }: { id: string | number }) => {
  const [expanded, setExpanded] = useState(true);
  const [showAllProperties, setShowAllProperties] = useState(true);
  const navigation = useSmartNavigation();

  const { data: productDescription } = useQuery({
    queryKey: ["flash-sale-product-detail", id],
    queryFn: () => flashSaleService.getFlashItemDetail(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      return {
        description: data?.flashSaleProduct?.description,
        properties: data?.flashSaleProduct?.properties,
        shop: data?.flashSaleProduct?.shop,
      };
    },
  });

  const showViewAllButton = useMemo(() => {
    return (productDescription?.properties?.length || 0) > 4;
  }, [productDescription?.properties]);

  const visibleProperties = useMemo(() => {
    if (!productDescription?.properties) return [];
    return showAllProperties
      ? productDescription.properties
      : productDescription.properties.slice(0, 4);
  }, [productDescription?.properties, showAllProperties]);

  const handleToggleProperties = () => {
    setShowAllProperties(true);
  };

  const handlePressAllProduct = () => {
    if (!productDescription?.shop?.id) return;

    navigation.smartNavigate("Shop", {
      id: String(productDescription?.shop?.id),
      tabIndex: 2,
    });
  };

  return (
    <View className="flex-1 mt-2 bg-white rounded-b-3xl">
      {/* Product details header */}
      <View className="border-b border-[#F0F0F0]">
        <View className="flex-row justify-between items-center px-5 py-4">
          <View className="flex-row items-center">
            <Text className="text-[#383B45] font-bold text-lg">
              Chi tiết sản phẩm
            </Text>
          </View>
          {showViewAllButton && !showAllProperties && (
            <TouchableOpacity
              className="flex-row items-center"
              onPress={handleToggleProperties}
            >
              <Text className="text-[#159747] text-base mr-1">Xem tất cả</Text>
              <Image source={imagePaths.icArrowRight} className="w-5 h-5" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Product description container */}
      <View className="py-5">
        <View className="px-5">
          <Text className="text-[#383B45] font-bold text-sm">
            Mô tả sản phẩm
          </Text>
        </View>

        <View className="flex flex-col gap-5 px-5 py-2 mt-2">
          {/* Product description items */}
          {visibleProperties.map((item) => (
            <View className="flex-row justify-between" key={item?.key}>
              <Text className="text-[#979797] text-sm w-36">{item?.name}</Text>
              <Text className="text-[#545454] text-sm flex-1">
                {item?.values?.map((value) => value?.name).join(", ")}
              </Text>
            </View>
          ))}
        </View>

        {expanded && (
          <View className="px-5">
            <WebViewContent
              html={productDescription?.description || ""}
              canScroll={false}
            />
          </View>
        )}
      </View>

      {/* Product details footer */}
      <View className="border-t border-[#F0F0F0]">
        <TouchableOpacity
          className="flex-row justify-center items-center px-5 py-4"
          onPress={() => {
            setExpanded(!expanded);
          }}
        >
          <Text className="text-[#383B45] text-sm mr-1">Xem chi tiết</Text>
          <Image
            source={imagePaths.icArrowRight}
            className="w-5 h-5"
            style={{
              transform: [{ rotate: !expanded ? "90deg" : "-90deg" }],
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(Detail, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
