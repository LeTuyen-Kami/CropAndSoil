import { ScrollView, TouchableOpacity, View } from "react-native";
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
    <View className="py-2 mb-2 bg-white">
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

export default RatingFilter;
