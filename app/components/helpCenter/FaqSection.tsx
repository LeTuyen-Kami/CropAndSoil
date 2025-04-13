import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import { Text } from "~/components/ui/text";
import { MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

type FaqItemProps = {
  title: string;
  isExpandable?: boolean;
  isExpanded?: boolean;
  onPress?: () => void;
};

type FaqCategory = {
  title: string;
  questions: string[];
};

const FaqItem = ({
  title,
  isExpandable = true,
  isExpanded = false,
  onPress,
}: FaqItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row justify-between items-center p-3 ${
        isExpandable ? "bg-white" : "bg-[#F0F0F0] rounded-lg"
      }`}
    >
      <Text
        className={`${isExpandable ? "text-base" : "text-sm"} text-[#383B45]`}
      >
        {title}
      </Text>
      <MaterialIcons
        name={
          isExpandable
            ? isExpanded
              ? "keyboard-arrow-up"
              : "keyboard-arrow-down"
            : "keyboard-arrow-right"
        }
        size={24}
        color="#AEAEAE"
      />
    </TouchableOpacity>
  );
};

const FAQ_DATA: FaqCategory[] = [
  {
    title: "Mua sắm cùng Cropee",
    questions: [
      "Làm thế nào để tìm kiếm sản phẩm?",
      "Đơn hàng tối thiểu là bao nhiêu?",
      "Làm thế nào để thêm sản phẩm vào giỏ hàng?",
      "Làm thế nào để đánh giá sản phẩm?",
    ],
  },
  {
    title: "Khuyến mãi & Ưu đãi",
    questions: [
      "Làm thế nào để sử dụng mã giảm giá?",
      "Tôi có thể kết hợp nhiều ưu đãi không?",
      "Điều kiện áp dụng khuyến mãi là gì?",
      "Ưu đãi cho khách hàng mới là gì?",
    ],
  },
  {
    title: "Thanh toán",
    questions: [
      "Cropee chấp nhận những phương thức thanh toán nào?",
      "Làm thế nào để thêm phương thức thanh toán mới?",
      "Tôi có thể thay đổi phương thức thanh toán sau khi đặt hàng không?",
      "Làm thế nào để xem hóa đơn thanh toán?",
    ],
  },
  {
    title: "Đơn hàng & Vận chuyển",
    questions: [
      "Làm thế nào để theo dõi đơn hàng?",
      "Thời gian giao hàng là bao lâu?",
      "Làm thế nào để hủy đơn hàng?",
      "Phí vận chuyển được tính như thế nào?",
    ],
  },
  {
    title: "Thông tin chung",
    questions: [
      "Cropee là gì?",
      "Làm thế nào để liên hệ hỗ trợ khách hàng?",
      "Cropee có cửa hàng thực tế không?",
      "Giờ làm việc của Cropee là khi nào?",
    ],
  },
];

const LINK_FAQ_CATEGORIES = [
  "Chính sách Cropee",
  "Tài khoản Cropee",
  "Mua sắm an toàn",
  "Thư viện thông tin",
  "Ứng dụng Cropee",
  "Khác",
  "Thông tin chung",
];

const FaqSection = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Animated.View
      className="overflow-hidden mb-4 bg-white rounded-2xl"
      layout={LinearTransition}
    >
      {FAQ_DATA.map((category, index) => (
        <Animated.View key={`expandable-${index}`} layout={LinearTransition}>
          <FaqItem
            title={category.title}
            onPress={() => toggleExpand(index)}
            isExpanded={expandedIndex === index}
          />

          {/* Show questions when category is expanded */}
          {expandedIndex === index && (
            <Animated.View
              className="bg-[#F8F8F8] px-2 gap-y-2 py-2"
              layout={LinearTransition}
            >
              {category.questions.map((question, qIndex) => (
                <FaqItem
                  key={`question-${index}-${qIndex}`}
                  title={question}
                  isExpandable={false}
                  onPress={() => {}}
                />
              ))}
            </Animated.View>
          )}

          {index < FAQ_DATA.length - 1 && (
            <View className="h-[1px] bg-[#F0F0F0]" />
          )}
        </Animated.View>
      ))}
    </Animated.View>
  );
};

export default FaqSection;
