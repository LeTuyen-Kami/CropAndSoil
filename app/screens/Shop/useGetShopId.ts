import { useRoute } from "@react-navigation/native";
import { RootStackRouteProp } from "~/navigation/types";

const useGetShopId = () => {
  const route = useRoute<RootStackRouteProp<"Shop">>();
  const { id } = route.params;

  return id;
};

export default useGetShopId;
