import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { RootStackScreenProps } from "~/navigation/types";
import { IVoucher } from "~/services/api/shop.service";
import { voucherService } from "~/services/api/voucher.service";
import { selectedVoucherAtom } from "~/store/atoms";
import { convertToK, formatDate } from "~/utils";
import TicketVoucher from "./TicketVoucher";
import Empty from "~/components/common/Empty";

const WrapperHeader = ({ title }: { title: string }) => {
  return (
    <View className="px-3 py-3 pb-4 bg-white rounded-t-3xl">
      <Text className="text-sm font-medium">{title}</Text>
    </View>
  );
};

const WrapperFooter = ({ title }: { title: string }) => {
  return (
    <View className="px-2 py-3 mb-3 bg-white rounded-b-3xl">
      <Text className="text-xs text-center">{title}</Text>
    </View>
  );
};

const WrapperVoucher = ({ children }: { children: React.ReactNode }) => {
  return <View className="px-3 -mt-4 bg-white">{children}</View>;
};

const ShippingVoucher = ({
  voucher,
  onPressVoucher,
}: {
  voucher: IVoucher;
  onPressVoucher: (voucher: IVoucher) => void;
}) => {
  return (
    <WrapperVoucher>
      <TicketVoucher
        title={"Mã vận chuyển"}
        description={voucher.description}
        minOrder={`Đơn tối thiểu ${convertToK(voucher.minimumAmount)}đ`}
        expiryDate={formatDate(voucher.expiryDate)}
        usagePercent={Math.round(
          (voucher.usedCount / (voucher.usageLimit || 1)) * 100
        )}
        onPress={() => {
          onPressVoucher(voucher);
        }}
      />
    </WrapperVoucher>
  );
};

export const ProductVoucher = ({
  voucher,
  onPressVoucher,
}: {
  voucher: IVoucher;
  onPressVoucher: (voucher: IVoucher) => void;
}) => {
  return (
    <WrapperVoucher>
      {
        <TicketVoucher
          linearGradientColors={["#FFFCF5", "#FFF6DD"]}
          borderColor="#FEEBC1"
          shadowColor="#FEEBC1"
          shadowBorderColor="#FEEBC1"
          image={imagePaths.bag}
          title="Voucher toàn sàn"
          minOrder={`Đơn tối thiểu ${convertToK(voucher.minimumAmount)}đ`}
          expiryDate={formatDate(voucher.expiryDate)}
          description={voucher.description}
          usagePercent={Math.round(
            (voucher.usedCount / (voucher.usageLimit || 1)) * 100
          )}
          onPress={() => {
            onPressVoucher(voucher);
          }}
        />
      }
    </WrapperVoucher>
  );
};

const VoucherSelectScreen = () => {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [isShowMoreVoucher, setIsShowMoreVoucher] = useState(false);
  const [voucherState, setVoucherState] = useAtom(selectedVoucherAtom);
  const navigation = useNavigation<RootStackScreenProps<"VoucherSelect">>();
  const {
    data: shippingVouchers,
    refetch,
    isRefetching,
    isPending: isPendingShippingVouchers,
  } = useQuery({
    queryKey: ["vouchers", "shipping"],
    queryFn: () =>
      voucherService.getVouchers({
        voucherType: "shipping",
        skip: 0,
        take: 100,
      }),
    staleTime: 0,
    refetchOnMount: "always",
  });

  const {
    data: productVouchers,
    refetch: refetchProductVouchers,
    isRefetching: isRefetchingProductVouchers,
    isPending: isPendingProductVouchers,
  } = useQuery({
    queryKey: ["vouchers", "product"],
    queryFn: () =>
      voucherService.getVouchers({
        voucherType: "product",
        skip: 0,
        take: 100,
      }),
  });

  const onPressMoreVoucher = () => {
    setIsShowMoreVoucher((prev) => !prev);
  };

  const onPressVoucher = (voucher: IVoucher) => {
    if (voucherState.canSelect) {
      navigation?.goBack();
      setVoucherState({
        voucher,
        canSelect: false,
      });
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "shippingHeader":
        return <WrapperHeader title={item.title} />;
      case "shipping":
        return (
          <ShippingVoucher
            voucher={item.item}
            onPressVoucher={onPressVoucher}
          />
        );
      case "shippingFooter":
        return (
          <View className="flex-row justify-center items-center px-2 py-2.5 mb-2.5 bg-white rounded-b-3xl">
            {/* <TouchableOpacity onPress={onPressMoreVoucher}>
              <Text className="text-xs tracking-tight leading-none">
                {isShowMoreVoucher ? "Ẩn bớt voucher" : "Xem thêm voucher"}
              </Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color="black"
            /> */}
          </View>
        );
      case "voucherHeader":
        return <WrapperHeader title={item.title} />;
      case "voucher":
        return (
          <ProductVoucher voucher={item.item} onPressVoucher={onPressVoucher} />
        );
      case "voucherFooter":
        return <WrapperFooter title={item.title} />;
      case "otherHeader":
        return <WrapperHeader title={item.title} />;
      case "other":
        return <WrapperVoucher>{<TicketVoucher />}</WrapperVoucher>;
      case "otherFooter":
        return <WrapperFooter title={item.title} />;
      default:
        return null;
    }
  };

  const flashListData = useMemo(() => {
    if (!shippingVouchers && !productVouchers) return [];

    return [
      {
        type: "shippingHeader",
        title: "Ưu đãi phí vận chuyển",
      },
      ...(shippingVouchers?.data || [])?.map((voucher) => ({
        type: "shipping",
        item: voucher,
      })),
      {
        type: "shippingFooter",
      },
      {
        type: "voucherHeader",
        title: "Voucher Cropee",
      },
      ...(productVouchers?.data || [])?.map((voucher) => ({
        type: "voucher",
        item: voucher,
      })),
      {
        type: "voucherFooter",
      },
      // {
      //   type: "otherHeader",
      //   title: "Voucher không khả dụng",
      // },
      // {
      //   type: "otherFooter",
      //   title: "Không áp dụng với một số sản phẩm",
      // },
    ];
  }, [shippingVouchers, productVouchers]);

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Chọn Cropee Voucher"
        titleClassName="font-bold"
        className="bg-transparent border-0"
        textColor="white"
        hasSafeTop={false}
      />
      <View className="flex-1 bg-[#EEE] rounded-t-3xl overflow-hidden">
        <Input
          placeholder="Nhập mã Cropee Voucher"
          className="mt-5 bg-white mb-2.5 mx-2"
          placeholderTextColor="gray"
          value={search}
          onChangeText={setSearch}
          rightIcon={<Text className="text-primary">Áp dụng</Text>}
        />
        <View className="flex-1">
          <FlashList
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={refetch} />
            }
            data={flashListData}
            renderItem={renderItem}
            getItemType={(item) => item.type}
            estimatedItemSize={100}
            ListEmptyComponent={() => (
              <Empty
                title="Không tìm thấy voucher"
                backgroundColor="white"
                isLoading={
                  isPendingShippingVouchers || isPendingProductVouchers
                }
              />
            )}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default VoucherSelectScreen;
