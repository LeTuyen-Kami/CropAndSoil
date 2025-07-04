import { View, TouchableOpacity } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { twMerge } from "tailwind-merge";
import { Text } from "~/components/ui/text";

interface AddressItemProps {
  name: string;
  phone: string;
  address: string;
  isDefault?: boolean;
  type?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  isSelected?: boolean;
  onPress?: () => void;
}

const AddressItem = ({
  name,
  phone,
  address,
  isDefault,
  type = "Nhà riêng",
  onEdit,
  onDelete,
  isSelected = false,
  onPress,
}: AddressItemProps) => {
  return (
    <Pressable
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
      })}
      onPress={onPress}
    >
      <View
        className={twMerge(
          "p-3 bg-white rounded-2xl border border-white",
          !!isSelected && "border-primary"
        )}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-[14px] font-medium text-[#383B45]">
              {name}
            </Text>
            <Text className="text-xs text-[#AEAEAE] mx-2">|</Text>
            <Text className="text-xs text-[#AEAEAE]">{phone}</Text>
          </View>
          <TouchableOpacity onPress={onEdit}>
            <Text className="text-xs text-primary">Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-xs text-[#676767] py-1.5">{address}</Text>

        <View className="flex-row justify-between items-center mt-1">
          <View className="flex-row gap-2 items-center">
            {isDefault && (
              <View className="px-3 py-1.5 border rounded-full border-[#FCBA27]">
                <Text className="text-[10px] text-[#FCBA27]">Mặc định</Text>
              </View>
            )}
            {type && (
              <View className="px-3 py-1.5 border rounded-full border-[#AEAEAE]">
                <Text className="text-[10px] text-[#AEAEAE]">{type}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={onDelete}>
            <Text className="text-xs text-[#AEAEAE]">Xóa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Pressable>
  );
};

export default AddressItem;
