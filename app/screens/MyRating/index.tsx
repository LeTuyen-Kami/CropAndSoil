import { FlashList } from "@shopify/flash-list";
import { View, ScrollView, TouchableOpacity } from "react-native";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import Tabs from "~/components/common/Tabs";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

interface IItem {
  id: string;
  name: string;
}

interface RatingFilterProps {
  onPressItem: (item: IItem) => void;
  items: IItem[];
  selectedItem: IItem;
}

const RatingFilter = ({
  onPressItem,
  items,
  selectedItem,
}: RatingFilterProps) => {
  return (
    <View className="my-2">
      <ScrollView
        horizontal
        contentContainerClassName="gap-2 ml-2"
        showsHorizontalScrollIndicator={false}
      >
        {items.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => onPressItem(item)}
            className={`px-4 py-2 rounded-full border border-[#F0F0F0] bg-[#F0F0F0] ${
              selectedItem.id === item.id
                ? "border-primary"
                : "border-[#F0F0F0]"
            }`}
          >
            <Text
              className={cn(
                "text-xs font-medium tracking-tight text-[#676767]",
                selectedItem.id === item.id && "text-primary"
              )}
            >
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const ITEMS = [
  { id: "1", name: "Tất cả" },
  { id: "2", name: "5 sao" },
  { id: "3", name: "4 sao" },
  { id: "4", name: "3 sao" },
  { id: "5", name: "2 sao" },
  { id: "6", name: "1 sao" },
];

const ListRated = ({ data }: { data: any[] }) => {
  return (
    <View className="flex-1">
      <RatingFilter
        items={ITEMS}
        selectedItem={ITEMS[0]}
        onPressItem={() => {}}
      />
      <FlashList
        data={data}
        renderItem={({ item }) => (
          <View>
            <Text>Testing</Text>
          </View>
        )}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};

const MyRating = () => {
  return (
    <ScreenWrapper hasGradient hasSafeBottom={false}>
      <Header
        textColor="white"
        title="Đánh giá của tôi"
        className="bg-transparent border-0"
        hasSafeTop={false}
      />
      <View className="rounded-t-[16px] overflow-hidden bg-white flex-1">
        <Tabs
          tabBarStyle={{
            paddingHorizontal: 12,
          }}
          titleClassName="text-sm"
          fullWidth
          items={[
            {
              title: "Chưa đánh giá",
              content: <Text>Chưa đánh giá</Text>,
            },
            {
              title: "Đã đánh giá",
              content: <ListRated data={[...Array(10)]} />,
            },
          ]}
        />
      </View>
    </ScreenWrapper>
  );
};

export default MyRating;
