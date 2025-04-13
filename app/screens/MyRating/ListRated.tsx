import { FlashList } from "@shopify/flash-list";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import RatingFilter from "./RatedFilter";
import ReviewItem, { ReviewItemProps } from "~/components/common/ReviewItem";
import Empty from "~/components/common/Empty";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const ITEMS = [
  { id: "1", name: "Tất cả" },
  { id: "2", name: "5 sao" },
  { id: "3", name: "4 sao" },
  { id: "4", name: "3 sao" },
  { id: "5", name: "2 sao" },
  { id: "6", name: "1 sao" },
];

const MOCK_REVIEWS: ReviewItemProps[] = [
  {
    reviewer: {
      name: "Thanh Trần",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    rating: 5,
    quality: "Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    comment: "Sản phẩm tốt, giá cả phù hợp",
    likes: 0,
    media: [
      {
        type: "video",
        uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        duration: "0:18",
        // thumbnail: "https://images.unsplash.com/photo-1560493676-04071c5f467b",
      },
      {
        type: "video",
        uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      },
      {
        type: "video",
        uri: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      },
      {
        type: "image",
        uri: "https://images.unsplash.com/photo-1536147210925-5cb7a7a4f9fe",
      },
    ],
    sellerResponse:
      "Greenhome thật vui mừng khi nhận được đánh giá của bạn, và rất mong tiếp tục nhận được sự ủng hộ của bạn trong thời gian sắp tới ạ! Mến chúc bạn mỗi ngày đều rạng rỡ, tươi tắn và gặp nhiều may mắn!",
  },
  {
    reviewer: {
      name: "Lưu Nhã Ngân",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    rating: 3,
    quality: "Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    likes: 0,
    sellerResponse:
      "Greenhome thật vui mừng khi nhận được đánh giá của bạn, và rất mong tiếp tục nhận được sự ủng hộ của bạn trong thời gian sắp tới ạ! Mến chúc bạn mỗi ngày đều rạng rỡ, tươi tắn và gặp nhiều may mắn!",
  },
  {
    reviewer: {
      name: "Nguyễn Trần Hưng",
      avatar: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    rating: 5,
    quality: "Tốt",
    date: "10/01/2025 12:14",
    productVariant: "NPK Rau Phú Mỹ",
    likes: 0,
  },
];

const ListRated = ({ data }: { data: any[] }) => {
  const { bottom } = useSafeAreaInsets();
  const navigation = useNavigation();

  const onPressEdit = () => {
    navigation.navigate("EditReview");
  };

  const onPressLike = () => {
    console.log("onPressLike");
  };

  return (
    <View className="flex-1">
      <RatingFilter
        items={ITEMS}
        selectedItem={ITEMS[0]}
        onPressItem={() => {}}
      />
      <FlashList
        data={MOCK_REVIEWS}
        renderItem={({ item }) => (
          <ReviewItem
            {...item}
            isLikeButtonInBottom
            onPressEdit={onPressEdit}
            onPressLike={onPressLike}
          />
        )}
        estimatedItemSize={100}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => <Empty title="Không có đánh giá nào" />}
        ListFooterComponent={() => (
          <View
            className="py-3"
            style={{
              paddingBottom: bottom,
            }}
          >
            <Text className="text-sm text-center text-primary">
              Bạn đã xem hết danh sách
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ListRated;
