import { AntDesign } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { Image } from "expo-image";
import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { screen } from "~/utils";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface GalleryItem {
  url: string | number;
  type: "image" | "video";
  thumbnail?: string;
}

interface GalleryProps {
  visible: boolean;
  images: GalleryItem[];
  initialIndex?: number;
  onClose: () => void;
  onChangeIndex?: (index: number) => void;
}

const Gallery = ({
  visible,
  images,
  initialIndex = 0,
  onClose,
  onChangeIndex,
}: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef<FlatList>(null);
  const translateY = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const videoRefs = useRef<{ [key: number]: Video | null }>({});

  // Reset values when gallery is opened
  React.useEffect(() => {
    if (visible) {
      translateY.value = 0;
      setCurrentIndex(initialIndex);

      // Scroll to the initial item
      if (flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }
    }
  }, [visible, initialIndex]);

  const handleClose = useCallback(
    (immediate = false) => {
      translateY.value = immediate
        ? translateY.value
        : withTiming(screen.height, { duration: 200 });
      setTimeout(
        () => {
          // Stop all videos when closing
          Object.values(videoRefs.current).forEach((videoRef) => {
            if (videoRef) {
              videoRef.stopAsync();
            }
          });

          onClose();
        },
        immediate ? 0 : 200
      );
    },
    [onClose]
  );

  // Pan gesture for swiping down to close
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      // Only allow vertical panning (for dismiss)
      if (e.translationY > 0) {
        // Only allow downward swipe
        translateY.value = e.translationY;
      }
    })
    .onEnd((e) => {
      if (Math.abs(translateY.value) > 100) {
        // Dismiss the gallery if swiped down enough
        runOnJS(handleClose)();
      } else {
        // Return to position if not swiped enough to dismiss
        translateY.value = withTiming(0);
      }
    });

  const backgroundOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(translateY.value, [0, 200], [1, 0.5], "clamp"),
    };
  });

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
      onChangeIndex?.(viewableItems[0].index);

      Object.values(videoRefs.current).forEach((videoRef) => {
        if (videoRef) {
          videoRef.pauseAsync();
        }
      });
    }
  }).current;

  if (!visible) return null;

  return (
    <GestureHandlerRootView style={[StyleSheet.absoluteFill, { zIndex: 1000 }]}>
      <Modal visible={visible} transparent={true}>
        <Animated.View style={[styles.container, backgroundOpacity]}>
          <StatusBar hidden />

          <TouchableOpacity
            style={[styles.closeButton, { top: insets.top }]}
            onPress={() => handleClose(true)}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.counterContainer}>
            <Text className="text-white">
              {currentIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Left navigation button */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.navigationButtonLeft}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: currentIndex - 1,
                  animated: true,
                });
              }}
            >
              <AntDesign name="left" size={30} color="white" />
            </TouchableOpacity>
          )}

          {/* Right navigation button */}
          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={styles.navigationButtonRight}
              onPress={() => {
                flatListRef.current?.scrollToIndex({
                  index: currentIndex + 1,
                  animated: true,
                });
              }}
            >
              <AntDesign name="right" size={30} color="white" />
            </TouchableOpacity>
          )}

          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.scrollContainer, translateStyle]}>
              <FlatList
                ref={flatListRef}
                data={images}
                horizontal
                pagingEnabled
                initialNumToRender={4}
                maxToRenderPerBatch={4}
                windowSize={3}
                showsHorizontalScrollIndicator={false}
                initialScrollIndex={initialIndex}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
                getItemLayout={(_, index) => ({
                  length: SCREEN_WIDTH,
                  offset: SCREEN_WIDTH * index,
                  index,
                })}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.slideContainer}>
                    {item.type === "image" ? (
                      <GalleryImageItem url={item.url} onClose={handleClose} />
                    ) : (
                      <GalleryVideoItem
                        url={item.url}
                        thumbnail={item.thumbnail}
                        ref={(ref) => {
                          videoRefs.current[index] = ref;
                        }}
                      />
                    )}
                  </View>
                )}
              />
            </Animated.View>
          </GestureDetector>

          {/* Pagination dots */}
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  flatListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                  });
                }}
              >
                <View
                  style={[
                    styles.paginationDot,
                    index === currentIndex && styles.paginationDotActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </Modal>
    </GestureHandlerRootView>
  );
};

interface GalleryImageItemProps {
  url: string;
  onClose: () => void;
}

const GalleryImageItem = ({ url, onClose }: GalleryImageItemProps) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  // Pinch gesture for zooming
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
      } else if (scale.value > 3) {
        scale.value = withTiming(3);
        savedScale.value = 3;
      } else {
        savedScale.value = scale.value;
      }
    });

  // Tap gesture to reset zoom
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd((e) => {
      if (scale.value > 1) {
        scale.value = withTiming(1);
        savedScale.value = 1;
        translateX.value = withTiming(0);
        translateY.value = withTiming(0);
      } else {
        scale.value = withTiming(2);
        savedScale.value = 2;
      }
    });

  const gestures = Gesture.Simultaneous(pinchGesture, doubleTapGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  return (
    <GestureDetector gesture={gestures}>
      <Animated.View style={[styles.imageWrapper, animatedStyle]}>
        <Image source={url} style={styles.image} contentFit="contain" />
      </Animated.View>
    </GestureDetector>
  );
};

// Video item
const GalleryVideoItem = React.forwardRef<
  Video,
  { url: string; thumbnail: string }
>(({ url, thumbnail }, ref) => {
  return (
    <View style={styles.videoWrapper}>
      <Video
        ref={ref}
        source={{ uri: url }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        isLooping
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContainer: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  slideContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  videoWrapper: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  video: {
    width: SCREEN_WIDTH,
    height: (SCREEN_WIDTH * 9) / 16, // Standard 16:9 aspect ratio
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  counterContainer: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 10,
  },
  paginationContainer: {
    position: "absolute",
    bottom: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    gap: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  paginationDotActive: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  navigationButtonLeft: {
    position: "absolute",
    left: 20,
    top: "50%",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  navigationButtonRight: {
    position: "absolute",
    right: 20,
    top: "50%",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Gallery;
