import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../ui/text";
import NW from "react-native-network-logger";
import { ENV } from "~/utils";
const NetworkLogger = () => {
  const [expanded, setExpanded] = useState(false);

  const style: any = expanded
    ? {
        position: "absolute",
        top: 40,
        right: 0,
        left: 0,
        bottom: 0,
        zIndex: 1000,
      }
    : {
        position: "absolute",
        top: 100,
        right: 0,
        zIndex: 1000,
      };

  if (ENV.EXPO_PUBLIC_ENV !== "dev") {
    return null;
  }

  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        className="p-4 bg-white rounded-lg opacity-20"
        style={{
          opacity: expanded ? 1 : 0.2,
        }}
      >
        <Text>NW</Text>
      </TouchableOpacity>
      {expanded && (
        <View className="size-full">
          <NW />
        </View>
      )}
    </View>
  );
};

export default NetworkLogger;
