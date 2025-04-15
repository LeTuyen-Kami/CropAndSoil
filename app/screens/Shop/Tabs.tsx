import { deepEqual } from "fast-equals";
import { useAtom } from "jotai";
import React, { useEffect, useRef } from "react";
import { TouchableOpacity, View } from "react-native";
import PagerView from "react-native-pager-view";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";
import { Text } from "~/components/ui/text";
import { activeIndexAtom } from "./atom";
import ShopCategory from "./ShopCategory";
import ShopProduct from "./ShopProduct";
import ShopScreen from "./ShopScreen";
import ShopVoucher from "./ShopVoucher";
import { RootStackRouteProp } from "~/navigation/types";
import { useRoute } from "@react-navigation/native";

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
  console.log("activeIndex", activeIndex);

  const pagerRef = useRef<PagerView>(null);
  const route = useRoute<RootStackRouteProp<"Shop">>();
  const onPressTab = (index: number) => {
    setActiveIndex(index);
    pagerRef.current?.setPage(index);
  };

  const handlePageChange = (index: number) => {
    console.log("handlePageChange", index);

    setActiveIndex(index);
  };

  useEffect(() => {
    return () => {
      console.log("unmount");

      setActiveIndex(0);
    };
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (route.params?.tabIndex) {
        onPressTab(route.params.tabIndex);
      }
    }, 1000);
  }, [route.params?.tabIndex]);

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
