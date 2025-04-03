import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import { useState } from "react";
import ProductTypeChip from "~/components/common/ProductTypeChip";

const BrandBadge = () => {
  return (
    <View style={styles.brandBadge}>
      <View style={styles.brandBadgeContent}>
        <Image source={imagePaths.icBrandBadge2} style={styles.brandIcon} />
        <Image source={imagePaths.icBrandBadge3} style={styles.brandIcon} />
      </View>
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
        <Image source={imagePaths.icAuthentic1} style={styles.authenticIcon} />
        <Image source={imagePaths.icAuthentic2} style={styles.authenticIcon} />
        <Text style={styles.authenticText}>CHÍNH HÃNG</Text>
      </View>
    </View>
  );
};

const SalesCount = () => {
  return (
    <View style={styles.salesCountContainer}>
      <Text style={styles.salesCountText}>Đã bán 62</Text>
      <View style={styles.healthIcon}>
        <Image source={imagePaths.icHealth} style={styles.icon} />
        <Image source={imagePaths.icCartDetail} style={styles.icon} />
      </View>
    </View>
  );
};

const PromotionBadge = () => {
  return (
    <View style={styles.promotionContainer}>
      <View style={styles.promotionContent}>
        <Image source={imagePaths.icPromotion2} style={styles.promotionIcon} />
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

const Info = () => {
  const [selectedType, setSelectedType] = useState("NPK rau 500gr");

  const productTypes = [
    "NPK rau 500gr",
    "NPK củ 250gr",
    "NPK trái 500gr",
    "NPK hoa Phú Mỹ 500gr",
    "NPK củ 250gr",
  ];

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
        <SalesCount />
      </View>

      <Text style={styles.productTitle}>
        Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa, Chắc Rễ,
        Khoẻ Cây, Bông To, Sai Quả
      </Text>

      <View style={styles.priceContainer}>
        <View style={styles.priceContent}>
          <Text style={styles.discountedPrice}>646.000đ</Text>
          <Text style={styles.originalPrice}>680.000đ</Text>
        </View>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>Giảm 5%</Text>
        </View>
      </View>

      <PromotionBadge />

      <View style={styles.typeContainer}>
        <Text style={styles.typeTitle}>Phân loại:</Text>
        <View style={styles.typeContent}>
          {productTypes.map((type, index) => (
            <ProductTypeChip
              key={index}
              label={type}
              isSelected={selectedType === type}
              onPress={() => setSelectedType(type)}
            />
          ))}
        </View>
      </View>
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
    alignItems: "flex-end",
    gap: 5,
    height: 18,
  },
  authenticIcon: {
    width: 12,
    height: 12,
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

export default Info;
