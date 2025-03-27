import { View } from "react-native";
import ECarousel, {
  ICarouselInstance,
  Pagination,
  TCarouselProps,
} from "react-native-reanimated-carousel";

import { useSharedValue } from "react-native-reanimated";
import { useRef } from "react";
import { screen } from "~/utils";
import { Image } from "expo-image";

// Use type intersection instead of extending the interface

type CarouselProps<T> = {
  data: T[];
  width?: number;
  height?: number;
  renderItem: ({
    item,
    index,
  }: {
    item: T;
    index: number;
  }) => React.ReactElement;
};

const Carousel = <T,>({
  data,
  width = screen.width,
  height = screen.width / 2,
  renderItem,
}: CarouselProps<T>) => {
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <View className="mt-6">
      <ECarousel
        ref={ref}
        width={width}
        height={height}
        data={data}
        autoPlayInterval={1000}
        style={{ width: "100%" }}
        onProgressChange={progress}
        renderItem={renderItem}
      />
      <View className="py-[10]">
        <Pagination.Basic
          progress={progress}
          data={[...Array(10)]}
          dotStyle={{
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: 50,
          }}
          activeDotStyle={{ backgroundColor: "white" }}
          containerStyle={{ gap: 5, marginTop: 10 }}
          onPress={onPressPagination}
        />
      </View>
    </View>
  );
};

export default Carousel;
