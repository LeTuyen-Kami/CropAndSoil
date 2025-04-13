import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Text } from "~/components/ui/text";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { AntDesign, Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { toast } from "~/components/common/Toast";
import ModalBottom from "~/components/common/ModalBottom";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Checkbox from "expo-checkbox";

// Define types for the images/videos
type MediaAsset = {
  uri: string;
  type: "image" | "video";
};

// Define rating options
const RATING_OPTIONS = ["Tốt", "Bình thường", "Kém"];

const EditReview = () => {
  const { bottom } = useSafeAreaInsets();
  const [rating, setRating] = useState(4);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [qualityRating, setQualityRating] = useState("");
  const [packagingRating, setPackagingRating] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);

  // Function to render stars based on rating
  const renderStars = () => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <TouchableOpacity key={i} onPress={() => setRating(i + 1)}>
          <AntDesign
            name={i < rating ? "star" : "staro"}
            size={24}
            color="#FCBA27"
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ));
  };

  // Function to handle image picking
  const handlePickImage = async () => {
    if (mediaAssets.length >= 5) {
      toast.warning("Bạn chỉ có thể tải lên tối đa 5 ảnh/video");
      return;
    }

    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        toast.error("Cần quyền truy cập vào thư viện ảnh");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newAsset: MediaAsset = {
          uri: result.assets[0].uri,
          type: result.assets[0].type === "video" ? "video" : "image",
        };

        setMediaAssets([...mediaAssets, newAsset]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      toast.error("Đã xảy ra lỗi khi chọn ảnh/video");
    }
  };

  // Function to remove media asset
  const removeMediaAsset = (index: number) => {
    const newAssets = [...mediaAssets];
    newAssets.splice(index, 1);
    setMediaAssets(newAssets);
  };

  // Function to handle submitting the review
  const handleSubmitReview = () => {
    // Validate review data
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá");
      return;
    }

    // Would normally send review data to API
    toast.success("Đã gửi đánh giá thành công");
  };

  return (
    <ScreenWrapper hasGradient={true} hasSafeBottom={false}>
      <Header
        title="Đánh giá sản phẩm"
        className="bg-transparent border-0"
        textColor="white"
        hasSafeTop={false}
      />
      <KeyboardAwareScrollView
        className="flex-1 bg-white rounded-t-2xl"
        bottomOffset={100}
      >
        <View className="px-2 py-4">
          {/* Product Item */}
          <View className="flex-row mb-4 bg-white">
            <View className="w-[68px] h-[66px] p-2.5 border border-gray-100 rounded-l-lg">
              <Image
                source="https://picsum.photos/200"
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
                contentFit="cover"
              />
            </View>
            <View className="flex-1 p-2">
              <Text className="text-[#383B45] text-xs" numberOfLines={2}>
                Phân Bón NPK Greenhome, Chuyên Rau Ăn Lá, Củ, Cây Ăn Trái, Hoa,
                Chắc Rễ, Khoẻ Cây, Bông To, Sai Quả
              </Text>
              <Text className="text-[#AEAEAE] text-xs mt-1">
                Phân loại: NPK Rau Phú Mỹ
              </Text>
            </View>
          </View>

          {/* Overall Rating */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="font-medium text-black">Đánh giá tổng quát</Text>
            <View className="flex-row">{renderStars()}</View>
          </View>

          {/* Media Upload Section */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {mediaAssets.map((asset, index) => (
              <View key={index} className="w-[88px] h-[88px] relative">
                <Image
                  source={{ uri: asset.uri }}
                  style={{ width: "100%", height: "100%", borderRadius: 6 }}
                  contentFit="cover"
                />
                <TouchableOpacity
                  className="absolute top-1 right-1 bg-black/40 w-[14px] h-[14px] rounded-lg flex items-center justify-center border border-white/40"
                  onPress={() => removeMediaAsset(index)}
                >
                  <AntDesign name="close" size={10} color="white" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Image Upload Button */}
            <TouchableOpacity
              className="w-[88px] h-[88px] border border-dashed border-gray-400 rounded-md flex items-center justify-center"
              onPress={handlePickImage}
            >
              <View className="items-center">
                <Feather name="camera" size={24} color="#AEAEAE" />
                <Text className="text-[#AEAEAE] text-sm font-medium mt-1">
                  {mediaAssets.length}/5
                </Text>
              </View>
            </TouchableOpacity>

            {/* Video Upload Button */}
            <TouchableOpacity
              className="w-[88px] h-[88px] border border-dashed border-gray-400 rounded-md flex items-center justify-center"
              onPress={handlePickImage}
            >
              <View className="items-center">
                <Feather name="video" size={24} color="#AEAEAE" />
                <Text className="text-[#AEAEAE] text-sm font-medium mt-1">
                  Video
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Detailed Ratings */}
          <View className="bg-[#F5F5F5] rounded-xl p-2 mb-4 border border-[#E3E3E3]">
            {/* Quality Rating */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-2"
              onPress={() => setShowQualityModal(true)}
            >
              <Text className="text-[#383B45] text-sm">
                Chất lượng sản phẩm: {qualityRating || "Để lại đánh giá"}
              </Text>
            </TouchableOpacity>

            <View className="h-[1px] bg-[#E3E3E3] my-2" />

            {/* Packaging Rating */}
            <TouchableOpacity
              className="flex-row justify-between items-center py-2"
              onPress={() => setShowPackagingModal(true)}
            >
              <Text className="text-[#383B45] text-sm">
                Đóng gói: {packagingRating || "Để lại đánh giá"}
              </Text>
            </TouchableOpacity>

            <View className="h-[1px] bg-[#E3E3E3] my-2" />

            {/* Review Comment */}
            <View className="py-2">
              <TextInput
                className="text-[#676767] text-sm"
                placeholder="Hãy chia sẻ nhận xét cho sản phẩm này bạn nhé!"
                placeholderTextColor="#AEAEAE"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={comment}
                onChangeText={setComment}
                style={{ height: 100 }}
              />
            </View>
          </View>

          {/* Anonymous Option */}
          <View className="flex-row justify-between items-center py-2">
            <View className="flex-row items-center">
              <Text className="text-[#575964] text-sm mr-2">Ẩn danh</Text>
              <Checkbox
                value={isAnonymous}
                onValueChange={setIsAnonymous}
                color="#159747"
                style={{
                  borderColor: "#159747",
                  borderWidth: 1,
                  width: 16,
                  height: 16,
                }}
              />
            </View>
            <Text className="text-[#676767] text-xs">
              Tên của bạn sẽ được hiển thị là C********n
            </Text>
          </View>
        </View>
      </KeyboardAwareScrollView>

      {/* Submit Button */}
      <View className="px-2 py-4 bg-white" style={{ paddingBottom: bottom }}>
        <TouchableOpacity
          className="bg-[#FCBA27] rounded-full py-3 items-center"
          onPress={handleSubmitReview}
        >
          <Text className="text-base font-medium text-white">Gửi</Text>
        </TouchableOpacity>
      </View>

      {/* Quality Rating Modal */}
      <ModalBottom
        isOpen={showQualityModal}
        onClose={() => setShowQualityModal(false)}
      >
        <View className="p-4">
          <Text className="mb-2 text-lg font-medium">Chất lượng sản phẩm</Text>
          {RATING_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              className="py-3 border-b border-gray-100"
              onPress={() => {
                setQualityRating(option);
                setShowQualityModal(false);
              }}
            >
              <Text
                className={`text-base ${
                  qualityRating === option ? "text-[#159747]" : "text-[#383B45]"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ModalBottom>

      {/* Packaging Rating Modal */}
      <ModalBottom
        isOpen={showPackagingModal}
        onClose={() => setShowPackagingModal(false)}
      >
        <View className="p-4">
          <Text className="mb-2 text-lg font-medium">Đóng gói</Text>
          {RATING_OPTIONS.map((option) => (
            <TouchableOpacity
              key={option}
              className="py-3 border-b border-gray-100"
              onPress={() => {
                setPackagingRating(option);
                setShowPackagingModal(false);
              }}
            >
              <Text
                className={`text-base ${
                  packagingRating === option
                    ? "text-[#159747]"
                    : "text-[#383B45]"
                }`}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ModalBottom>
    </ScreenWrapper>
  );
};

export default EditReview;
