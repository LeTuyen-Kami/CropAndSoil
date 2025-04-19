import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  GestureResponderEvent,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import PagerView from "react-native-pager-view";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { flashSaleService } from "~/services/api/flashsale.service";
import { screen } from "~/utils";
import Header from "./Header";
import PagerViewScreen from "./PagerViewScreen";
import TabItem from "./TabItem";

const FlashSale = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const navigation = useSmartNavigation();
  const { data: timeSlots, isLoading } = useQuery({
    queryKey: ["flash-sale-time-slots"],
    queryFn: () => flashSaleService.getFlashSaleTimeSlot(),
  });

  const listTimeSlots = useMemo(() => {
    const now = dayjs();
    return timeSlots?.map((item, index) => {
      const itemTime = dayjs(item);
      const oneHourAfterItem = itemTime.add(1, "hour");

      let status = "";
      if (itemTime.isAfter(now)) {
        status = "Sắp diễn ra";
      } else if (now.isAfter(itemTime) && now.isBefore(oneHourAfterItem)) {
        status = "Đang diễn ra";
      } else {
        status = "Đã diễn ra";
      }

      return {
        title: itemTime.format("HH:mm"),
        subTitle: status,
        key: index + 1,
        value: item,
      };
    });
  }, [timeSlots]);

  const pagerRef = useRef<PagerView>(null);
  const onPressTab = (index: number, e: GestureResponderEvent) => {
    setTabIndex(index);
    const x = e.nativeEvent.pageX;
    scrollRef.current?.scrollTo({
      x: x - (screen.width - 100) / 2,
      animated: true,
    });
    pagerRef.current?.setPage(index);
  };

  const onPageSelected = (e: any) => {
    setTabIndex(e.nativeEvent.position);
    scrollRef.current?.scrollTo({
      x: e.nativeEvent.position * (screen.width - 100),
      animated: true,
    });
  };

  // Memoize the FlashList components to prevent unnecessary re-renders
  const renderPagerViews = useMemo(() => {
    return listTimeSlots?.map((item, index) => (
      <View key={item.key} className="flex-1">
        <PagerViewScreen timeSlot={item.value} />
      </View>
    ));
  }, [listTimeSlots]);

  const renderEmpty = () => {
    return (
      <View className="flex-1 gap-4 justify-center items-center pb-20">
        <AntDesign name="inbox" size={64} color="#CCCCCC" />
        <Text className="text-base font-medium text-white">
          Không có dữ liệu flash sale
        </Text>
        <TouchableOpacity
          className="flex-row items-center px-6 py-3 mt-4 rounded-full bg-primary"
          onPress={() => navigation.smartGoBack()}
        >
          <AntDesign
            name="arrowleft"
            size={16}
            color="white"
            className="mr-2"
          />
          <Text className="font-medium text-white">Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={"white"} />
        </View>
      ) : !!timeSlots && timeSlots?.length > 0 ? (
        <View className="flex-1">
          <View className="bg-[#25B85D] mt-4">
            <ScrollView
              ref={scrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingHorizontal: 8,
                backgroundColor: "#25B85D",
                flexDirection: "row",
                gap: 4,
              }}
            >
              {listTimeSlots?.map((item, index) => (
                <TabItem
                  key={item.key}
                  isActive={index === tabIndex}
                  onPress={(e) => {
                    onPressTab(index, e);
                  }}
                  title={item.title}
                  subTitle={item.subTitle}
                />
              ))}
            </ScrollView>
          </View>
          <PagerView
            style={{ flex: 1 }}
            ref={pagerRef}
            initialPage={tabIndex}
            offscreenPageLimit={1}
            onPageSelected={onPageSelected}
          >
            {renderPagerViews}
          </PagerView>
        </View>
      ) : (
        renderEmpty()
      )}
    </ScreenWrapper>
  );
};

export default FlashSale;
