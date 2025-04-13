import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { Text } from "~/components/ui/text";
import PagerView from "react-native-pager-view";
import { useAtom } from "jotai";
import { activeIndexAtom } from "./atom";
import ShopScreen from "./ShopScreen";
import ShopCategory from "./ShopCategory";
import ShopVoucher from "./ShopVoucher";
import ShopProduct from "./ShopProduct";
import { deepEqual } from "fast-equals";

const tabs = [
  {
    title: "Shop",
  },
  {
    title: "Khuyến mãi",
  },
  {
    title: "Sản phẩm",
  },
  {
    title: "Danh mục",
  },
];

const Tabs = () => {
  const [activeIndex, setActiveIndex] = useAtom(activeIndexAtom);
  const pagerRef = useRef<PagerView>(null);

  const onPressTab = (index: number) => {
    setActiveIndex(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageChange = (index: number) => {
    setActiveIndex(index);
  };

  useEffect(() => {
    return () => {
      setActiveIndex(0);
    };
  }, []);

  return (
    <View className="flex-col flex-1 -mt-16">
      <View className="flex-row justify-between items-center mx-2 mb-2">
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            hitSlop={20}
            className="flex-row justify-center items-center min-w-[40px] py-2.5"
            onPress={() => onPressTab(index)}
          >
            <Text className="text-sm font-medium text-center text-white">
              {tab.title}
            </Text>
            {activeIndex === index && (
              <Animated.View
                className={`absolute bottom-0 w-10 bg-white rounded-full h-[2px]`}
                entering={ZoomIn}
                exiting={ZoomOut}
              />
            )}
          </TouchableOpacity>
        ))}
      </View>
      <PagerView
        style={{ flex: 1 }}
        ref={pagerRef}
        onPageSelected={(e) => {
          handlePageChange(e.nativeEvent.position);
        }}
      >
        <View
          className="overflow-hidden flex-1 bg-[#EEE] rounded-t-2xl"
          key="1"
        >
          <ShopScreen />
        </View>
        <View
          className="overflow-hidden flex-1 bg-[#EEE] rounded-t-2xl"
          key="2"
        >
          <ShopVoucher />
        </View>
        <View
          className="overflow-hidden flex-1 bg-[#EEE] rounded-t-2xl"
          key="3"
        >
          <ShopProduct />
        </View>
        <View
          className="overflow-hidden flex-1 bg-[#EEE] rounded-t-2xl"
          key="4"
        >
          <ShopCategory />
        </View>
      </PagerView>
    </View>
  );
};

export default React.memo(Tabs, (prevProps, nextProps) => {
  return deepEqual(prevProps, nextProps);
});
