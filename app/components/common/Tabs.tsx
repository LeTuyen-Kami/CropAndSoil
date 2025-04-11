import React, {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ReactNativepagerView from "react-native-pager-view";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolateColor,
  SharedValue,
} from "react-native-reanimated";
import { cn } from "~/lib/utils";

type TabItem = {
  title: string;
  content: React.ReactNode;
};

type TabsProps = {
  items: TabItem[];
  initialPage?: number;
  tabBarStyle?: object;
  activeTabTextStyle?: object;
  indicatorStyle?: object;
  className?: string;
  titleClassName?: string;
  onTabChange?: (index: number) => void;
};

const screenWidth = Dimensions.get("window").width;

const Tabs = forwardRef<
  {
    setPage: (page: number) => void;
    getPage: () => number;
  },
  TabsProps
>(
  (
    {
      items,
      initialPage = 0,
      tabBarStyle,
      activeTabTextStyle,
      indicatorStyle: customIndicatorStyle,
      className,
      titleClassName,
      onTabChange,
    },
    ref
  ) => {
    const pagerRef = useRef<ReactNativepagerView>(null);
    const scrollViewRef = useRef<ScrollView>(null);
    const tabItemsRef = useRef<Array<View | null>>([]);

    // Shared values for indicator animation
    const indicatorWidth = useSharedValue(0);
    const indicatorPosition = useSharedValue(0);
    const selectedIndex = useSharedValue(0);
    // Update indicator position based on active tab

    const handlePageChange = (page: number, updatePager = true) => {
      if (updatePager) {
        pagerRef.current?.setPage(page);
      }
      selectedIndex.value = page;

      // Call onTabChange if provided
      if (onTabChange) {
        onTabChange(page);
      }

      // Scroll tab into view if needed
      if (tabItemsRef.current[page]) {
        tabItemsRef.current[page]?.measure(
          (x, y, width, height, pageX, pageY) => {
            scrollViewRef.current?.scrollTo({
              x: x - (screenWidth - width) / 2,
              animated: true,
            });

            indicatorPosition.value = withTiming(x, { duration: 200 });
            indicatorWidth.value = withTiming(width, { duration: 200 });
          }
        );
      }
    };

    const animatedIndicatorStyle = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: indicatorPosition.value }],
        width: indicatorWidth.value,
      };
    });

    useEffect(() => {
      tabItemsRef.current[initialPage]?.measure(
        (x, y, width, height, pageX, pageY) => {
          indicatorPosition.value = pageX;
          indicatorWidth.value = width;
        }
      );
    }, []);

    useImperativeHandle(ref, () => ({
      setPage: (page: number) => {
        handlePageChange(page, true);
      },
      getPage: () => {
        return selectedIndex.value;
      },
    }));

    return (
      <View className={cn("flex-1 w-full", className)}>
        <View>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.tabBarContainer, tabBarStyle]}
            contentContainerStyle={styles.tabBarContent}
          >
            <View style={styles.tabBar}>
              {items.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  ref={(ref) => (tabItemsRef.current[index] = ref)}
                  style={styles.tabItem}
                  onPress={() => handlePageChange(index)}
                >
                  <Title
                    title={item.title}
                    titleClassName={titleClassName}
                    selectedIndex={selectedIndex}
                    index={index}
                  />
                </TouchableOpacity>
              ))}
              <Animated.View
                style={[
                  styles.indicator,
                  animatedIndicatorStyle,
                  customIndicatorStyle,
                ]}
              />
            </View>
          </ScrollView>
        </View>
        <ReactNativepagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={initialPage}
          // onPageScroll={onPageScroll}
          onPageSelected={(e) => {
            const index = e.nativeEvent.position;
            handlePageChange(index, false);
          }}
        >
          {items.map((item, index) => (
            <View key={index} style={styles.pageContainer}>
              {item.content}
            </View>
          ))}
        </ReactNativepagerView>
      </View>
    );
  }
);

const Title = ({
  title,
  titleClassName,
  selectedIndex,
  index,
}: {
  title: string;
  titleClassName?: string;
  selectedIndex: SharedValue<number>;
  index: number;
}) => {
  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        selectedIndex.value === index ? 1 : 0,
        [0, 1],
        ["#888", "#159747"]
      ),
    };
  });

  return (
    <Animated.Text
      className={cn("text-sm leading-tight", titleClassName)}
      numberOfLines={1}
      style={textStyle}
    >
      {title}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: "#fff",
  },
  tabBarContent: {
    position: "relative",
  },
  tabBar: {
    flexDirection: "row",
    position: "relative",
  },
  tabItem: {
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  tabText: {
    fontSize: 14,
    color: "#888",
  },
  indicator: {
    position: "absolute",
    height: 3,
    bottom: 0,
    borderRadius: 100,
    backgroundColor: "#159747",
  },
  pagerView: {
    flex: 1,
  },
  pageContainer: {
    flex: 1,
  },
});

export default Tabs;
