import { TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import Badge from "~/components/common/Badge";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "~/services/api/order.service";
import { authAtom } from "~/store/atoms";
import { useAtomValue } from "jotai";
// Order status item component
const OrderStatusItem = ({
  icon,
  title,
  onPress,
  status,
}: {
  icon: any;
  title: string;
  onPress: () => void;
  status: string;
}) => {
  const auth = useAtomValue(authAtom);

  const { data } = useQuery({
    queryKey: ["my-order", status || "", auth?.isLoggedIn],
    queryFn: () =>
      orderService.listOrder({
        skip: 0,
        take: 1,
        statusKey: status,
      }),
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000 * 5,
    enabled: auth?.isLoggedIn,
  });

  return (
    <TouchableOpacity
      className="flex-1 items-center min-w-16"
      onPress={onPress}
    >
      <View className="w-10 h-10 rounded-full bg-[#DEF1E5] items-center justify-center mb-0.5">
        <Image source={icon} style={{ width: 20, height: 20 }} />
        {!!data && (
          <Badge count={data?.total} className="absolute -top-2 -right-2" />
        )}
      </View>
      <Text className="text-[10px] text-[#383B45] text-center">{title}</Text>
    </TouchableOpacity>
  );
};

export default OrderStatusItem;
