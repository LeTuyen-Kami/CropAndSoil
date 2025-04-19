import { useNavigation, useRoute } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { RefreshControl } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { imagePaths } from "~/assets/imagePath";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { RootStackRouteProp, RootStackScreenProps } from "~/navigation/types";
import { IVoucher } from "~/services/api/shop.service";
import { voucherService } from "~/services/api/voucher.service";
import { selectedVoucherAtom } from "~/store/atoms";
import { convertToK, formatDate, getErrorMessage } from "~/utils";
import TicketVoucher from "./TicketVoucher";
import Empty from "~/components/common/Empty";
import { toggleLoading } from "~/components/common/ScreenLoading";
import { toast } from "~/components/common/Toast";

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
    </WrapperVoucher>
  );
};

export const UnavailableVoucher = ({ voucher }: { voucher: IVoucher }) => {
  return (
    <WrapperVoucher>
      <View className="opacity-70">
        <TicketVoucher
          linearGradientColors={
            voucher?.voucherType === "shipping"
              ? ["#FBFDFB", "#FBFDFB"]
              : ["#FFFCF5", "#FFF6DD"]
          }
          borderColor={
            voucher?.voucherType === "shipping" ? "#BEE2CB" : "#FEEBC1"
          }
          shadowColor={
            voucher?.voucherType === "shipping" ? "#BEE2CB" : "#FEEBC1"
          }
          shadowBorderColor={
            voucher?.voucherType === "shipping" ? "#EBF6F0" : "#FEEBC1"
          }
          image={
            voucher?.voucherType === "shipping"
              ? imagePaths.freeShipping
              : imagePaths.bag
          }
          title={
            voucher?.voucherType === "shipping"
              ? "Mã vận chuyển"
              : "Voucher toàn sàn"
          }
          minOrder={`Đơn tối thiểu ${convertToK(voucher.minimumAmount)}đ`}
          expiryDate={formatDate(voucher.expiryDate)}
          description={voucher.description}
          usagePercent={Math.round(
            (voucher.usedCount / (voucher.usageLimit || 1)) * 100
          )}
        />
      </View>
    </WrapperVoucher>
  );
};

const VoucherSelectScreen = () => {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [isShowMoreVoucher, setIsShowMoreVoucher] = useState(false);
  const [voucherState, setVoucherState] = useAtom(selectedVoucherAtom);
  const navigation = useNavigation<RootStackScreenProps<"VoucherSelect">>();
  const route = useRoute<RootStackRouteProp<"VoucherSelect">>();

  const productIds = route.params?.productIds;

  const mutateApplyVoucher = useMutation({
    mutationFn: (voucherCode: string) => voucherService.findByCode(voucherCode),
    onMutate: () => {
      toggleLoading(true);
    },
    onSuccess: (data) => {
      toast.success("Áp dụng voucher thành công");
      onPressVoucher(data as any);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Lỗi khi áp dụng voucher"));
    },
    onSettled: () => {
      toggleLoading(false);
    },
  });

  const {
    data: shippingVouchers,
    refetch,
    isRefetching: isRefetchingShippingVouchers,
    isPending: isPendingShippingVouchers,
  } = useQuery({
    queryKey: ["vouchers", "shipping"],
    queryFn: () =>
      voucherService.getVouchers({
        voucherType: "shipping",
        skip: 0,
        take: 100,
        productIds: productIds?.join(","),
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
        productIds: productIds?.join(","),
      }),
  });

  const {
    data: unavailableVouchers,
    refetch: refetchUnavailableVouchers,
    isRefetching: isRefetchingUnavailableVouchers,
    isPending: isPendingUnavailableVouchers,
  } = useQuery({
    queryKey: ["vouchers", "unavailable"],
    queryFn: () =>
      voucherService.getVouchers({
        isAvailable: false,
        skip: 0,
        take: 100,
        productIds: productIds?.join(","),
      }),
  });

  const onRefresh = () => {
    refetch();
    refetchProductVouchers();
  };

  const isRefetching =
    isRefetchingShippingVouchers || isRefetchingProductVouchers;

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
      case "unavailableHeader":
        return <WrapperHeader title={item.title} />;
      case "unavailable":
        return <UnavailableVoucher voucher={item.item} />;
      case "unavailableFooter":
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
      {
        type: "unavailableHeader",
        title: "Voucher không khả dụng",
      },
      ...(unavailableVouchers?.data || [])?.map((voucher) => ({
        type: "unavailable",
        item: voucher,
      })),
      {
        type: "unavailableFooter",
        title: "Không áp dụng với một số sản phẩm",
      },
    ];
  }, [shippingVouchers, productVouchers, unavailableVouchers]);

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
          rightIcon={
            <TouchableOpacity
              onPress={() => {
                mutateApplyVoucher.mutate(search);
              }}
            >
              <Text className="text-primary">Áp dụng</Text>
            </TouchableOpacity>
          }
        />
        <View className="flex-1">
          <FlashList
            refreshControl={
              <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
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
