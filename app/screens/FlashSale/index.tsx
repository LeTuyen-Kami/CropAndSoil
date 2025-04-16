import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  GestureResponderEvent,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native";
import PagerView from "react-native-pager-view";
import { imagePaths } from "~/assets/imagePath";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";
import { cn } from "~/lib/utils";
import { screen } from "~/utils";

const TabItem = ({
  title,
  subTitle,
  isActive,
  onPress,
}: {
  title: string;
  subTitle: string;
  isActive?: boolean;
  onPress?: (e: any) => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "flex-col bg-[#25B85D] justify-center items-center py-2.5 px-2",
        isActive && "border-b border-white"
      )}
    >
      <Text className="text-base font-bold text-white">{title}</Text>
      <Text className="text-[10px] tracking-tight text-white">{subTitle}</Text>
    </TouchableOpacity>
  );
};

const Header = () => {
  const navigation = useSmartNavigation();

  return (
    <View className="flex-row gap-4 items-center px-2">
      <TouchableOpacity
        onPress={navigation.smartGoBack}
        className="px-2 py-1"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icArrowLeft}
          className="w-2 h-4"
          contentFit="contain"
        />
      </TouchableOpacity>
      <Input
        placeholder="Tìm kiếm sản phẩm, cửa hàng"
        placeholderTextColor="#AEAEAE"
        className="flex-1"
        textInputClassName="text-sm leading-4"
        rightIcon={
          <TouchableOpacity>
            <Image
              source={imagePaths.icMagnifier}
              className="size-5"
              contentFit="contain"
            />
          </TouchableOpacity>
        }
      />
      <TouchableOpacity
        className="h-12 rounded-full aspect-square bg-[#39CA71] justify-center items-center"
        hitSlop={20}
      >
        <Image
          source={imagePaths.icFilter}
          className="size-6"
          contentFit="contain"
        />
      </TouchableOpacity>
    </View>
  );
};

const ITEMS = [
  {
    title: "15:00",
    subTitle: "Đang diễn ra",
    key: "1",
  },
  {
    title: "16:00",
    subTitle: "Sắp diễn ra",
    key: "2",
  },
  {
    title: "17:00",
    subTitle: "Sắp diễn ra",
    key: "3",
  },
  {
    title: "18:00",
    subTitle: "Sắp diễn ra",
    key: "4",
  },
  {
    title: "19:00",
    subTitle: "Sắp diễn ra",
    key: "5",
  },
  {
    title: "20:00",
    subTitle: "Sắp diễn ra",
    key: "6",
  },
];

const FlashSale = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
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

  return (
    <ScreenWrapper hasGradient>
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
        <PagerView style={{ flex: 1 }} ref={pagerRef}>
          {ITEMS.map((item, index) => (
            <View
              key={item.key}
              className="flex-1"
              style={{ backgroundColor: Math.random() > 0.5 ? "red" : "blue" }}
            >
              <Text>{item.title}</Text>
            </View>
          ))}
        </PagerView>
      </View>
    </ScreenWrapper>
  );
};

export default FlashSale;
