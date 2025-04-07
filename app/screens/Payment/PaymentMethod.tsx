import { useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Image } from "expo-image";
import { Text } from "~/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Header from "~/components/common/Header";
import { imagePaths } from "~/assets/imagePath";

// Payment method option type
interface PaymentOption {
  id: string;
  title: string;
  subtitle?: string;
  icon: JSX.Element;
}

const PaymentMethod = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("cash");
  const navigation = useNavigation();

  // Payment options
  const paymentOptions: PaymentOption[] = [
    {
      id: "cash",
      title: "Thanh toán khi nhận hàng",
      icon: <FontAwesome5 name="dollar-sign" size={20} color="#383B45" />,
    },
    {
      id: "online",
      title: "Thanh toán Online",
      icon: <MaterialIcons name="payment" size={20} color="#383B45" />,
    },
    {
      id: "credit",
      title: "Thẻ tín dụng/Ghi nợ/ATM",
      subtitle: "Nhấn để thêm thẻ",
      icon: <AntDesign name="creditcard" size={20} color="#383B45" />,
    },
  ];

  // Handle payment method selection
  const handleSelectPaymentMethod = (id: string) => {
    setSelectedPaymentMethod(id);
  };

  return (
    <View className="mt-4 bg-white rounded-2xl">
      <View className="flex-row justify-between items-center p-3 border-b border-[#F5F5F5]">
        <Text className="text-sm font-medium leading-tight text-[#383B45]">
          Phương thức thanh toán
        </Text>
        <Image
          source={imagePaths.icArrowRight}
          style={{ width: 20, height: 20, tintColor: "#393B45" }}
          contentFit="contain"
        />
      </View>
      <View>
        {paymentOptions.map((option, index) => (
          <TouchableOpacity
            key={option.id}
            className={`flex-row justify-between items-center px-3`}
            onPress={() => handleSelectPaymentMethod(option.id)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="justify-center items-center mr-2 size-10">
                {option.icon}
              </View>
              <View>
                <Text className="text-[14px] text-[#383B45]">
                  {option.title}
                </Text>
                {option.subtitle && (
                  <Text className="text-[10px] text-[#159747]">
                    {option.subtitle}
                  </Text>
                )}
              </View>
            </View>
            <View className="justify-center items-center w-6 h-6">
              {selectedPaymentMethod === option.id ? (
                <MaterialIcons name="check-circle" size={24} color="#159747" />
              ) : (
                <MaterialIcons
                  name="radio-button-unchecked"
                  size={24}
                  color="#CCCCCC"
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethod;
