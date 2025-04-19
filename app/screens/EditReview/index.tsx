import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  Modal,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Text } from "~/components/ui/text";
import Header from "~/components/common/Header";
import ScreenWrapper from "~/components/common/ScreenWrapper";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect, useRef } from "react";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { toast } from "~/components/common/Toast";
import ModalBottom from "~/components/common/ModalBottom";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import Checkbox from "expo-checkbox";
import { Video, ResizeMode } from "expo-av";
import {
  ICreateReviewRequest,
  IUpdateReviewRequest,
  reviewService,
} from "~/services/api/review.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "@react-navigation/native";
import { RootStackRouteProp } from "~/navigation/types";
import { orderService } from "~/services/api/order.service";
import { getErrorMessage, getMediaTypes } from "~/utils";
import { useAtomValue } from "jotai";
import { authAtom } from "~/store/atoms";
import { useSmartNavigation } from "~/hooks/useSmartNavigation";

// Define types for the images/videos
type MediaAsset = {
  uri: string;
  type: "image" | "video";
  size?: number;
  fromServer?: boolean;
};

// Define rating options
const RATING_OPTIONS = ["Tốt", "Bình thường", "Kém"];

// Media constraints
const MAX_IMAGE_SIZE = 1.5 * 1024 * 1024; // 1.5MB in bytes
const MAX_VIDEO_SIZE = 25 * 1024 * 1024; // 25MB in bytes
const MAX_IMAGES = 5;
const MAX_VIDEOS = 1;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const EditReview = () => {
  const { bottom, top } = useSafeAreaInsets();
  const [rating, setRating] = useState(4);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [videoCount, setVideoCount] = useState(0);
  const [imageCount, setImageCount] = useState(0);
  const [qualityRating, setQualityRating] = useState("");
  const [packagingRating, setPackagingRating] = useState("");
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);
  const [showPackagingModal, setShowPackagingModal] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaAsset | null>(null);
  const [showFullscreenPreview, setShowFullscreenPreview] = useState(false);
  const navigation = useSmartNavigation();
  const auth = useAtomValue(authAtom);
  const videoRef = useRef<Video>(null);
  const queryClient = useQueryClient();

  const route = useRoute<RootStackRouteProp<"EditReview">>();

  const {
    orderId,
    productId,
    variationId,
    thumbnail,
    productName,
    variationName,
    isEdit,
    review,
  } = route.params;

  // Update counts when mediaAssets changes
  useEffect(() => {
    const videos = mediaAssets.filter((asset) => asset.type === "video").length;
    const images = mediaAssets.filter((asset) => asset.type === "image").length;
    setVideoCount(videos);
    setImageCount(images);
  }, [mediaAssets]);

  const mutationSendReview = useMutation({
    mutationFn: (data: ICreateReviewRequest) =>
      reviewService.createReview(data),
  });

  const mutationUpdateReview = useMutation({
    mutationFn: (data: IUpdateReviewRequest) =>
      reviewService.updateReview(review?.id!, data),
  });

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

  // Function to get file info
  const getFileInfo = async (
    fileUri: string
  ): Promise<{ size: number; type: "image" | "video" }> => {
    const fileInfo = await FileSystem.getInfoAsync(fileUri, { size: true });

    // Determine file type based on extension
    const isVideo =
      fileUri.toLowerCase().endsWith(".mp4") ||
      fileUri.toLowerCase().endsWith(".mov") ||
      fileUri.toLowerCase().endsWith(".avi");

    return {
      size: fileInfo.exists
        ? (fileInfo as FileSystem.FileInfo & { size: number }).size || 0
        : 0,
      type: isVideo ? "video" : "image",
    };
  };

  // Function to handle image picking
  const handlePickImage = async (pickVideo = false) => {
    try {
      // Check media limits
      if (pickVideo && videoCount >= MAX_VIDEOS) {
        toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_VIDEOS} video`);
        return;
      }

      if (!pickVideo && imageCount >= MAX_IMAGES) {
        toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh`);
        return;
      }

      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        toast.error("Cần quyền truy cập vào thư viện ảnh");
        return;
      }

      const mediaType = pickVideo ? "videos" : "images";

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await getFileInfo(fileUri);

        console.log("fileInfo", fileInfo);

        // Check file size
        if (fileInfo.type === "image" && fileInfo.size > MAX_IMAGE_SIZE) {
          toast.error(`Kích thước ảnh không được vượt quá 2MB`);
          return;
        }

        if (fileInfo.type === "video" && fileInfo.size > MAX_VIDEO_SIZE) {
          toast.error(`Kích thước video không được vượt quá 30MB`);
          return;
        }

        const newAsset: MediaAsset = {
          uri: fileUri,
          type: fileInfo.type,
          size: fileInfo.size,
        };

        setMediaAssets([...mediaAssets, newAsset]);
      }
    } catch (error) {
      console.error("Error picking media:", error);
      toast.error("Đã xảy ra lỗi khi chọn ảnh/video");
    }
  };

  // Function to handle taking a photo
  const handleTakePhoto = async () => {
    try {
      if (imageCount >= MAX_IMAGES) {
        toast.warning(`Bạn chỉ có thể tải lên tối đa ${MAX_IMAGES} ảnh`);
        return;
      }

      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        toast.error("Cần quyền truy cập vào camera");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const fileInfo = await getFileInfo(fileUri);

        console.log("fileInfo", fileInfo.size);

        if (fileInfo.size > MAX_IMAGE_SIZE) {
          toast.error(`Kích thước ảnh không được vượt quá 1.5MB`);
          return;
        }

        const newAsset: MediaAsset = {
          uri: fileUri,
          type: "image",
          size: fileInfo.size,
        };

        setMediaAssets([...mediaAssets, newAsset]);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      toast.error("Đã xảy ra lỗi khi chụp ảnh");
    }
  };

  // Function to open media preview
  const handleOpenPreview = (asset: MediaAsset) => {
    setSelectedMedia(asset);
    setShowFullscreenPreview(true);
  };

  // Function to close media preview
  const handleClosePreview = () => {
    setSelectedMedia(null);
    setShowFullscreenPreview(false);
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

    if (!qualityRating) {
      toast.error("Vui lòng đánh giá chất lượng sản phẩm");
      return;
    }

    if (!packagingRating) {
      toast.error("Vui lòng đánh giá đóng gói");
      return;
    }

    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét của bạn");
      return;
    }

    // Prepare media files - separate images and video
    const images = mediaAssets
      .filter((asset) => asset.type === "image")
      .filter((asset) => !asset.fromServer)
      .map((asset) => ({
        uri: asset.uri,
        type: "image/jpeg",
        name: `image_${new Date().getTime()}.jpg`,
      }));

    // Get the first video if exists
    const videoAsset = mediaAssets
      .filter((asset) => !asset.fromServer)
      .find((asset) => asset.type === "video");
    const video = videoAsset
      ? {
          uri: videoAsset.uri,
          type: "video/mp4",
          name: `video_${new Date().getTime()}.mp4`,
        }
      : { uri: "", type: "", name: "" };

    if (isEdit) {
      // Update existing review
      const updateData: IUpdateReviewRequest = {
        productId: productId?.toString() || "",
        variationId: variationId?.toString() || "",
        rating,
        comment,
        quality: qualityRating,
        packaging: packagingRating,
        isAnonymous: !!isAnonymous,
        orderId: orderId?.toString() || "",
        images,
        video,
        oldGallery: mediaAssets
          .filter((asset) => asset.fromServer)
          .map((asset) => asset.uri),
      };

      mutationUpdateReview.mutate(updateData, {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["list-unrated", "reviews"],
          });
          toast.success("Cập nhật đánh giá thành công");
        },
        onError: (error) => {
          console.error("Error updating review:", error);
          toast.error("Đã xảy ra lỗi khi cập nhật đánh giá");
        },
      });
    } else {
      // Create new review
      const reviewData: ICreateReviewRequest = {
        orderId: orderId?.toString() || "",
        productId: productId?.toString() || "",
        variationId: variationId?.toString() || "",
        rating,
        comment,
        quality: qualityRating,
        packaging: packagingRating,
        isAnonymous: !!isAnonymous,
        images,
        video,
      };

      mutationSendReview.mutate(reviewData, {
        onSuccess: () => {
          toast.success("Đã gửi đánh giá thành công");
          navigation.smartGoBack();
          queryClient.invalidateQueries({
            queryKey: ["list-unrated", "reviews"],
          });
        },
        onError: (error) => {
          toast.error(getErrorMessage(error, "Đã xảy ra lỗi khi gửi đánh giá"));
        },
      });
    }
  };

  const hideName = (name?: string) => {
    if (!name || name.length <= 2) return "Ẩn danh";

    const firstChar = name.charAt(0);
    const lastChar = name.charAt(name.length - 1);
    const middleStars = "*".repeat(name.length - 2);

    return firstChar + middleStars + lastChar;
  };

  // Fullscreen media preview
  const renderFullscreenPreview = () => {
    if (!selectedMedia) return null;

    return (
      <Modal
        visible={showFullscreenPreview}
        transparent={false}
        animationType="fade"
        onRequestClose={handleClosePreview}
      >
        <StatusBar backgroundColor="#000" barStyle="light-content" />
        <View
          style={{
            flex: 1,
            backgroundColor: "#000",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Close button */}
          <TouchableOpacity
            style={{
              position: "absolute",
              top: top + 20,
              right: 20,
              zIndex: 10,
              backgroundColor: "rgba(0,0,0,0.5)",
              borderRadius: 20,
              padding: 8,
            }}
            onPress={handleClosePreview}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>

          {selectedMedia.type === "image" ? (
            <Image
              source={{ uri: selectedMedia.uri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 }}
              contentFit="contain"
            />
          ) : (
            <Video
              ref={videoRef}
              source={{ uri: selectedMedia.uri }}
              style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT * 0.8 }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              isLooping
              shouldPlay
            />
          )}
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    if (review) {
      setComment(review.comment);
      setQualityRating(review.quality);
      setPackagingRating(review.packaging);
      setRating(review.rating);
      setMediaAssets(
        review.gallery.map((media) => ({
          uri: media,
          type: getMediaTypes(media),
          fromServer: true,
        }))
      );
      setIsAnonymous(review.isAnonymous);
    }
  }, [review]);

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
                source={{ uri: thumbnail }}
                style={{ width: "100%", height: "100%", borderRadius: 8 }}
                contentFit="cover"
              />
            </View>
            <View className="flex-1 p-2">
              <Text className="text-[#383B45] text-xs" numberOfLines={2}>
                {productName}
              </Text>
              <Text className="text-[#AEAEAE] text-xs mt-1">
                Phân loại: {variationName}
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
                <TouchableOpacity
                  style={{ width: "100%", height: "100%", borderRadius: 6 }}
                  onPress={() => handleOpenPreview(asset)}
                >
                  {asset.type === "image" ? (
                    <Image
                      source={{ uri: asset.uri }}
                      style={{ width: "100%", height: "100%", borderRadius: 6 }}
                      contentFit="cover"
                    />
                  ) : (
                    <>
                      <Video
                        source={{ uri: asset.uri }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 6,
                        }}
                        resizeMode={ResizeMode.COVER}
                        useNativeControls={false}
                      />
                      <View
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "rgba(0,0,0,0.2)",
                          borderRadius: 6,
                        }}
                      >
                        <Feather name="play" size={24} color="white" />
                      </View>
                    </>
                  )}
                </TouchableOpacity>
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
              onPress={() => handlePickImage(false)}
            >
              <View className="items-center">
                <Feather name="camera" size={24} color="#AEAEAE" />
                <Text className="text-[#AEAEAE] text-xs font-medium mt-1">
                  Chụp ảnh
                </Text>
                <Text className="text-[#AEAEAE] text-xs mt-1">
                  {imageCount}/{MAX_IMAGES}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Gallery Upload Button */}
            <TouchableOpacity
              className="w-[88px] h-[88px] border border-dashed border-gray-400 rounded-md flex items-center justify-center"
              onPress={() => handleTakePhoto()}
            >
              <View className="items-center">
                <Feather name="image" size={24} color="#AEAEAE" />
                <Text className="text-[#AEAEAE] text-xs font-medium mt-1">
                  Thư viện
                </Text>
                <Text className="text-[#AEAEAE] text-xs mt-1">
                  {imageCount}/{MAX_IMAGES}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Video Upload Button */}
            <TouchableOpacity
              className="w-[88px] h-[88px] border border-dashed border-gray-400 rounded-md flex items-center justify-center"
              onPress={() => handlePickImage(true)}
            >
              <View className="items-center">
                <Feather name="video" size={24} color="#AEAEAE" />
                <Text className="text-[#AEAEAE] text-xs font-medium mt-1">
                  Video
                </Text>
                <Text className="text-[#AEAEAE] text-xs mt-1">
                  {videoCount}/{MAX_VIDEOS}
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
              Tên của bạn sẽ được hiển thị là {hideName(auth?.user?.name)}
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
          {mutationSendReview.isPending || mutationUpdateReview.isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-base font-medium text-white">Gửi</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Fullscreen Media Preview */}
      {renderFullscreenPreview()}

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
