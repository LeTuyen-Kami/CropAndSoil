import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { GestureResponderEvent, ScrollView, View } from "react-native";
import PagerView from "react-native-pager-view";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { usePagination } from "~/hooks/usePagination";
import { flashSaleService } from "~/services/api/flashsale.service";
import { screen } from "~/utils";
import Header from "./Header";
import PagerViewScreen from "./PagerViewScreen";
import TabItem from "./TabItem";

const ITEMS = [
  {
    title: "15:00",
    subTitle: "Đang diễn ra",
    key: "1",
    value: dayjs().toISOString(),
  },
  {
    title: "16:00",
    subTitle: "Sắp diễn ra",
    key: "2",
    value: dayjs().add(1, "hour").toISOString(),
  },
  {
    title: "17:00",
    subTitle: "Sắp diễn ra",
    key: "3",
    value: dayjs().add(2, "hour").toISOString(),
  },
  {
    title: "18:00",
    subTitle: "Sắp diễn ra",
    key: "4",
    value: dayjs().add(3, "hour").toISOString(),
  },
  {
    title: "19:00",
    subTitle: "Sắp diễn ra",
    key: "5",
    value: dayjs().add(4, "hour").toISOString(),
  },
  {
    title: "20:00",
    subTitle: "Sắp diễn ra",
    key: "6",
    value: dayjs().add(5, "hour").toISOString(),
  },
];

const FlashSale = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const { data: timeSlots } = useQuery({
    queryKey: ["flash-sale-time-slots"],
    queryFn: () => flashSaleService.getFlashSaleTimeSlot(),
  });

  console.log(timeSlots);

  const { data } = usePagination(
    (data) => {
      return flashSaleService.getFlashSale(ITEMS[tabIndex].value, data);
    },
    {
      queryKey: ["flash-sale", ITEMS[tabIndex].value],
      enabled: !!ITEMS[tabIndex].value,
    }
  );

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
    return ITEMS.map((item, index) => (
      <View key={item.key} className="flex-1 bg-[#EEE]">
        <PagerViewScreen />
      </View>
    ));
  }, []);

  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header />
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
            {ITEMS.map((item, index) => (
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
    </ScreenWrapper>
  );
};

export default FlashSale;
