import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Image } from "expo-image";
import { imagePaths } from "~/assets/imagePath";
import useDisclosure from "~/hooks/useDisclosure";
import Gallery from "~/components/common/Galery";

const MOCK_MEDIA = [
  {
    id: 1,
    type: "image",
    url: "https://picsum.photos/seed/seed1/200/200",
  },
  {
    id: 2,
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://picsum.photos/seed/seed2/200/200",
  },
  {
    id: 3,
    type: "image",
    url: "https://picsum.photos/seed/seed3/200/200",
  },
  {
    id: 4,
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://picsum.photos/seed/seed4/200/200",
  },
];

const AllMedia = () => {
  const { isOpen, onOpen, openValue, onClose } = useDisclosure({
    initialOpenValue: 0,
  });

  return (
    <View className="px-2 py-4 border-b-2 border-gray-100">
      <View className="flex-row justify-between items-center w-full">
        <Text className="text-[#383B45] font-bold text-lg">
          Tất cả hình ảnh/video (5)
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
        data={MOCK_MEDIA}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => onOpen(index)}>
            <View className="w-20 h-20">
              <Image
                source={{
                  uri: item.type === "image" ? item.url : item.thumbnail,
                }}
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
                contentFit="cover"
              />
            </View>
          </TouchableOpacity>
        )}
      />
      <Gallery
        visible={isOpen}
        images={MOCK_MEDIA.map((media) => ({
          url: media.url,
          type: media.type as "image" | "video",
        }))}
        initialIndex={openValue}
        onClose={onClose}
      />
    </View>
  );
};

export default AllMedia;
