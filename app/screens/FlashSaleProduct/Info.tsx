import { AntDesign } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Image } from "expo-image";
import { deepEqual } from "fast-equals";
import { useAtomValue } from "jotai";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import ProductTypeChip from "~/components/common/ProductTypeChip";
import { toast } from "~/components/common/Toast";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import {
  flashSaleService,
  IFlashSaleProduct,
} from "~/services/api/flashsale.service";
import { shopService } from "~/services/api/shop.service";
import { wishlistService } from "~/services/api/wishlist.service";
import { authAtom } from "~/store/atoms";
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

const SalesCount = ({
  quantity,
  isLiked,
  onPress,
}: {
  quantity: number | undefined;
  isLiked: boolean;
  onPress: () => void;
}) => {
  return (
    <View style={styles.salesCountContainer}>
      <Text style={styles.salesCountText}>
        Đã bán {(quantity || 0)?.toLocaleString()}
      </Text>
      <TouchableOpacity onPress={onPress}>
        <AntDesign
          name={isLiked ? "heart" : "hearto"}
          size={15}
          color={isLiked ? "#E01739" : "#AEAEAE"}
        />
      </TouchableOpacity>
    </View>
  );
};

const PromotionBadge = ({ title }: { title: string }) => {
  return (
    <View style={styles.promotionContainer}>
      <View style={styles.promotionContent}>
        <Image source={imagePaths.icPromotion} style={styles.promotionIcon} />
        <Text style={styles.promotionText} numberOfLines={1}>
          {title}
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
  attributes: IFlashSaleProduct["flashSaleProduct"]["attributes"] | undefined;
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
  const queryClient = useQueryClient();
  const auth = useAtomValue(authAtom);
  const navigation = useSmartNavigation();
  const { data: productDetail, refetch } = useQuery({
    queryKey: ["flash-sale-product-detail", id],
    queryFn: () => flashSaleService.getFlashItemDetail(id),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
    select: (data) => {
      return {
        ...data.flashSaleProduct,
        flashSaleVariation: [data.flashSaleVariation],
      };
    },
  });

  const { data: voucher } = useQuery({
    queryKey: ["vouchers", (productDetail?.shop?.id || "")?.toString()],
    enabled: !!productDetail?.shop?.id,
    queryFn: () =>
      shopService.getListVoucher({
        shopId: productDetail?.shop?.id,
        take: 1,
        skip: 0,
      }),
  });

  const mutationLikeProduct = useMutation({
    mutationFn: () => wishlistService.addWishlist(id.toString()),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Đã thêm vào danh sách yêu thích");
    },
    onError: () => {
      toast.error("Lỗi khi thêm vào danh sách yêu thích");
    },
  });

  const mutationUnlikeProduct = useMutation({
    mutationFn: () => wishlistService.removeWishlist(id.toString()),
    onSuccess: () => {
      refetch();
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      toast.success("Đã xóa khỏi danh sách yêu thích");
    },
    onError: () => {
      toast.error("Lỗi khi xóa khỏi danh sách yêu thích");
    },
  });

  const handleLikeProduct = () => {
    if (!auth?.isLoggedIn) {
      navigation.smartNavigate("Login");
      return;
    }

    if (mutationLikeProduct.isPending || mutationUnlikeProduct.isPending) {
      return;
    }

    if (true) {
      //TODO: Remove this
      mutationUnlikeProduct.mutate();
    } else {
      mutationLikeProduct.mutate();
    }
  };

  return (
    <View style={styles.container}>
      {productDetail?.brands?.[0]?.name && (
        <Text style={styles.brandInfoText}>
          Thương hiệu:{" "}
          <Text style={{ ...styles.brandInfoText, color: "#22B14C" }}>
            {productDetail?.brands?.[0]?.name}
          </Text>
        </Text>
      )}

      <View style={styles.brandInfoContent}>
        <View style={styles.badgesContainer}>
          <BrandBadge />
          {productDetail?.shop?.isOfficial && <AuthenticBadge />}
        </View>
        <SalesCount
          quantity={productDetail?.totalSales}
          isLiked={true} //TODO: Remove this
          onPress={handleLikeProduct}
        />
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

      {voucher?.data?.[0]?.description && (
        <PromotionBadge title={voucher?.data?.[0]?.description} />
      )}

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
