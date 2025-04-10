import ScreenContainer from "~/components/common/ScreenContainer";
import Header from "~/components/common/Header";
import { SectionList, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import GradientBackground from "~/components/common/GradientBackground";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import TicketVoucher from "./TicketVoucher";
import { Input } from "~/components/ui/input";
import { useMemo, useState } from "react";
import { FlashList } from "@shopify/flash-list";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const mockData = [
  {
    type: "shippingHeader",
    title: "Ưu đãi phí vận chuyển",
  },
  ...Array(2)
    .fill(0)
    .map((_, index) => {
      return {
        type: "shipping",
      };
    }),
  {
    type: "shippingFooter",
  },
  {
    type: "voucherHeader",
    title: "Voucher Cropee",
  },
  ...Array(10)
    .fill(0)
    .map((_, index) => {
      return {
        type: "voucher",
      };
    }),
  {
    type: "voucherFooter",
  },
  {
    type: "otherHeader",
    title: "Voucher không khả dụng",
  },
  ...Array(20)
    .fill(0)
    .map((_, index) => {
      return {
        type: "other",
      };
    }),
  {
    type: "otherFooter",
    title: "Không áp dụng với một số sản phẩm",
  },
];

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

const VoucherSelectScreen = () => {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [data, setData] = useState(mockData);
  const [isShowMoreVoucher, setIsShowMoreVoucher] = useState(false);
  const onPressMoreVoucher = () => {
    const shippingFooterIndex = mockData.findIndex(
      (item) => item.type === "shippingFooter"
    );
    const beforeIndex = mockData.slice(0, shippingFooterIndex);
    const afterIndex = mockData.slice(shippingFooterIndex);

    setData([
      ...beforeIndex,
      ...(!isShowMoreVoucher
        ? Array(10)
            .fill(0)
            .map((_, index) => {
              return { type: "voucher" };
            })
        : []),
      ...afterIndex,
    ]);
    setIsShowMoreVoucher((prev) => !prev);
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case "shippingHeader":
        return <WrapperHeader title={item.title} />;
      case "shipping":
        return <WrapperVoucher>{<TicketVoucher />}</WrapperVoucher>;
      case "shippingFooter":
        return (
          <View className="flex-row justify-center items-center px-2 py-2.5 mb-2.5 bg-white rounded-b-3xl">
            <TouchableOpacity onPress={onPressMoreVoucher}>
              <Text className="text-xs tracking-tight leading-none">
                {isShowMoreVoucher ? "Ẩn bớt voucher" : "Xem thêm voucher"}
              </Text>
            </TouchableOpacity>
            <MaterialCommunityIcons
              name="chevron-down"
              size={18}
              color="black"
            />
          </View>
        );
      case "voucherHeader":
        return <WrapperHeader title={item.title} />;
      case "voucher":
        return (
          <WrapperVoucher>
            {<TicketVoucher linearGradientColors={["#FF0000", "#00FF00"]} />}
          </WrapperVoucher>
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

  const stickyHeaderIndices = useMemo(() => {
    return mockData
      ?.map((item, index) => {
        if (
          item.type === "shippingHeader" ||
          item.type === "voucherHeader" ||
          item.type === "otherHeader"
        ) {
          return index;
        }
        return null;
      })
      .filter((item) => item !== null);
  }, []);

  return (
    <ScreenContainer
      paddingBottom={0}
      paddingHorizontal={0}
      paddingVertical={0}
      hasBottomTabs={false}
      safeArea={false}
      scrollable={false}
      header={
        <GradientBackground
          gradientStyle={{
            paddingTop: top,
            paddingBottom: 30,
          }}
        >
          <Header
            title="Chọn Cropee Voucher"
            titleClassName="font-bold"
            className="bg-transparent border-0"
            textColor="white"
          />
        </GradientBackground>
      }
    >
      <View className="flex-1 -mt-5 bg-[#EEE] rounded-t-3xl overflow-hidden">
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
            data={data}
            renderItem={renderItem}
            getItemType={(item) => item.type}
            estimatedItemSize={100}
            // stickyHeaderIndices={stickyHeaderIndices}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default VoucherSelectScreen;
