import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import useDisclosure from "~/hooks/useDisclosure";
import Gallery from "~/components/common/Galery";
import { Video, ResizeMode } from "expo-av";
import { Feather } from "@expo/vector-icons";
import RenderVideo from "~/components/common/RenderVideo";

type MediaItem = {
  type: string;
  uri: string;
  id: string;
};

const AllMedia = ({ media }: { media?: MediaItem[] }) => {
  const { isOpen, onOpen, openValue, onClose } = useDisclosure({
    initialOpenValue: 0,
  });

  if (!media) return null;

  return (
    <View className="px-2 py-4 border-b-2 border-gray-100">
      <View className="flex-row justify-between items-center w-full">
        <Text className="text-[#383B45] font-bold text-lg">
          Tất cả hình ảnh/video
          {/* ({media.length}) */}
        </Text>

        <TouchableOpacity className="flex-row items-center">
          <Image
            source={imagePaths.icArrowRight}
            style={{ width: 16, height: 16, tintColor: "#393B45" }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
      <FlatList
        horizontal
        className="mt-2"
        ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
        showsHorizontalScrollIndicator={false}
        data={media}
        ListFooterComponent={() => (
          <TouchableOpacity
            className="justify-center items-center ml-1.5 w-20 h-20 bg-gray-100 rounded-2xl"
            onPress={() => onOpen(0)}
          >
            <Text className="text-[#383B45] font-medium text-xs text-center">
              Xem tất cả
            </Text>
            <Feather name="arrow-right" size={16} color="#383B45" />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onOpen(index)}>
            <View className="relative w-20 h-20">
              {item.type === "image" ? (
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: "100%", height: "100%", borderRadius: 10 }}
                  className="bg-gray-100"
                  contentFit="cover"
                />
              ) : (
                <RenderVideo uri={item.uri} />
              )}
            </View>
          </TouchableOpacity>
        )}
      />
      <Gallery
        visible={isOpen}
        images={media.map((item) => ({
          url: item.uri,
          type: item.type === "image" ? "image" : "video",
        }))}
        initialIndex={openValue}
        onClose={onClose}
      />
    </View>
  );
};

export default AllMedia;
