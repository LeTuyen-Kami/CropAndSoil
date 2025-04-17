import { TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

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

export default TabItem;
