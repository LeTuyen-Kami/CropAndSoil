import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import React, { useMemo, useState } from "react";
import ProductTypeChip from "~/components/common/ProductTypeChip";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { deepEqual } from "fast-equals";
import { IProduct, productService } from "~/services/api/product.service";
import { useQuery } from "@tanstack/react-query";
import { formatPrice } from "~/utils";

const BrandBadge = () => {
  return (
    <View className="flex flex-row gap-1 items-center px-[10] py-[2] bg-[#FEF2D4] rounded-[5]">
      <Image source={imagePaths.icProdcutFlashSale} className="size-[18]" />
      <Image source={imagePaths.icTopDeal} className="w-[112] h-[11]" />
    </View>
  );
};

const TopDealBadge = () => {
  return (
    <View style={styles.topDealBadge}>
      <View style={styles.topDealBadgeContent}>
        <Text style={styles.topDealText}>TOP DEAL - SIÊU RẺ</Text>
      </View>
    </View>
  );
};

const AuthenticBadge = () => {
  return (
    <View style={styles.authenticBadge}>
      <View style={styles.authenticBadgeContent}>
        <Image source={imagePaths.icTicked} style={styles.authenticIcon} />
        <Text style={styles.authenticText}>CHÍNH HÃNG</Text>
      </View>
    </View>
  );
};

const SalesCount = ({ quantity }: { quantity: number | undefined }) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity onPress={() => navigation.navigate("LikedProduct")}>
      <View style={styles.salesCountContainer}>
        <Text style={styles.salesCountText}>
          Đã bán {(quantity || 0)?.toLocaleString()}
        </Text>
        <AntDesign name="heart" size={15} color="#E01739" />
      </View>
    </TouchableOpacity>
  );
};

const PromotionBadge = () => {
  return (
    <View style={styles.promotionContainer}>
      <View style={styles.promotionContent}>
        <Image source={imagePaths.icPromotion} style={styles.promotionIcon} />
        <Text style={styles.promotionText}>
          Giảm 24k từ mã khuyến mãi của nhà bán
        </Text>
      </View>
      <View style={styles.promotionArrowContainer}>
        <Image
          source={imagePaths.icArrowRight}
          style={styles.promotionArrowIcon}
        />
      </View>
    </View>
  );
};

const Atribute = ({
  attributes,
}: {
  attributes: IProduct["attributes"] | undefined;
}) => {
  return (
    <React.Fragment>
      {attributes?.map((attribute) => {
        return (
          <View style={styles.typeContainer} key={attribute.id}>
            <Text style={styles.typeTitle}>{attribute.name}</Text>
            <View style={styles.typeContent}>
              {attribute.options?.map((option, index) => (
                <ProductTypeChip
                  key={option.id}
                  label={option.name}
                  // isSelected={selectedType === option.name}
                  // onPress={() => setSelectedType(option.name)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </React.Fragment>
  );
};

const Info = ({ id }: { id: string | number }) => {
  const [selectedType, setSelectedType] = useState("NPK rau 500gr");

  const { data: productDetail } = useQuery({
    queryKey: ["product-detail", id],
    queryFn: () => productService.getProductDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  const productTypes = useMemo(() => {
    return (
      productDetail?.attributes?.flatMap((attribute) =>
        attribute?.options?.map((option) => option?.name)
      ) ?? []
    );
  }, [productDetail]);

  return (
    <View style={styles.container}>
      <Text style={styles.brandInfoText}>
        Thương hiệu:{" "}
        <Text
          style={{
            ...styles.brandInfoText,
            color: "#22B14C",
          }}
        >
          Siêu thị Làm Vườn Greenhome
        </Text>
      </Text>

      <View style={styles.brandInfoContent}>
        <View style={styles.badgesContainer}>
          <BrandBadge />
          <AuthenticBadge />
        </View>
        <SalesCount quantity={productDetail?.totalSales} />
      </View>

      <Text style={styles.productTitle}>{productDetail?.name}</Text>

      <View style={styles.priceContainer}>
        <View style={styles.priceContent}>
          <Text style={styles.discountedPrice}>
            {formatPrice(
              productDetail?.salePrice || productDetail?.regularPrice
            )}
          </Text>
          {productDetail?.regularPrice &&
            productDetail?.regularPrice > productDetail?.salePrice && (
              <Text style={styles.originalPrice}>
                {formatPrice(productDetail?.regularPrice)}
              </Text>
            )}
        </View>
        {productDetail?.regularPrice &&
          productDetail?.salePrice &&
          productDetail?.regularPrice > productDetail?.salePrice && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {((productDetail?.regularPrice - productDetail?.salePrice) /
                  productDetail?.regularPrice) *
                  100}
                %
              </Text>
            </View>
          )}
      </View>

      <PromotionBadge />

      <Atribute attributes={productDetail?.attributes} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    gap: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  brandInfoText: {
    fontFamily: "Roboto",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.5,
    color: "#545454",
  },
  brandInfoContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 4,
  },
  badgesContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandBadge: {
    backgroundColor: "rgba(252, 186, 39, 0.2)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  brandBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIcon: {
    width: 16,
    height: 16,
  },
  topDealBadge: {
    backgroundColor: "#FCBA27",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  topDealBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  topDealText: {
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  authenticBadge: {
    backgroundColor: "rgba(32, 177, 76, 0.1)",
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 2,
    paddingLeft: 6,
  },
  authenticBadgeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    height: 18,
  },
  authenticIcon: {
    width: 15,
    height: 15,
  },
  authenticText: {
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    color: "#20B14C",
  },
  salesCountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  salesCountText: {
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    color: "#383B45",
  },
  healthIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    width: 16,
    height: 16,
  },
  productTitle: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#545454",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  discountedPrice: {
    fontFamily: "Roboto",
    fontWeight: "700",
    fontSize: 18,
    lineHeight: 28,
    color: "#FF424E",
  },
  originalPrice: {
    fontFamily: "Roboto",
    fontSize: 14,
    lineHeight: 20,
    color: "#979797",
    textDecorationLine: "line-through",
  },
  discountBadge: {
    backgroundColor: "#E01839",
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  discountText: {
    fontFamily: "Roboto",
    fontSize: 10,
    lineHeight: 14,
    letterSpacing: 1,
    color: "#FFFFFF",
  },
  promotionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 16,
  },
  promotionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 4,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: "#FDF1F3",
    borderRadius: 24,
    width: 299,
  },
  promotionIcon: {
    width: 16,
    height: 16,
  },
  promotionIcon2: {
    width: 16,
    height: 16,
    position: "absolute",
    left: 10,
  },
  promotionText: {
    fontFamily: "Roboto",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: 0.5,
    color: "#979797",
    marginLeft: 10,
  },
  promotionArrowContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  promotionArrowIcon: {
    width: 16,
    height: 16,
    tintColor: "#AEAEAE",
  },
  typeContainer: {
    flexDirection: "column",
    alignSelf: "stretch",
    gap: 4,
    paddingTop: 8,
  },
  typeTitle: {
    fontFamily: "Roboto",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#000000",
  },
  typeContent: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    flexWrap: "wrap",
    gap: 4,
  },
});

export default React.memo(Info, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
