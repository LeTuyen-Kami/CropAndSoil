import { Video, ResizeMode } from "expo-av";
import { Image } from "expo-image";
import { useRef, useEffect, useState } from "react";
import { View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "../ui/text";
import { formatDuration } from "~/utils";

interface RenderVideoProps {
  uri: string;
}

const RenderVideo = ({ uri }: RenderVideoProps) => {
  const [duration, setDuration] = useState<number>(0);

  return (
    <View className="overflow-hidden w-full h-full rounded-md">
      <Video
        source={{ uri }}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        style={{ width: "100%", height: "100%" }}
        onLoad={(status) => {
          if (status.isLoaded) {
            setDuration(status.durationMillis || 0);
          }
        }}
      />
      {duration > 0 && (
        <View className="absolute right-0 bottom-0 left-0 flex-row justify-between items-center p-1 bg-black/40">
          <Image
            source={imagePaths.icVideo}
            style={{ width: 12, height: 12 }}
          />
          <Text className="text-[10px] tracking-tight text-white">
            {formatDuration(duration)}
          </Text>
        </View>
      )}
    </View>
  );
};

export default RenderVideo;
