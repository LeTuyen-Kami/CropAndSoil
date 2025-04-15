import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image } from "expo-image";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { Text } from "~/components/ui/text";
import { IPaymentMethod } from "~/services/api/payment.service";
import { checkCanRender } from "~/utils";
// Payment method option type

const PaymentMethod = ({
  paymentMethods,
  selectedPaymentMethod,
  onSelectPaymentMethod,
}: {
  paymentMethods?: IPaymentMethod[];
  selectedPaymentMethod: string;
  onSelectPaymentMethod: (id: string) => void;
}) => {
  if (!checkCanRender(paymentMethods)) return null;

  // Handle payment method selection
  const handleSelectPaymentMethod = (id: string) => {
    onSelectPaymentMethod(id);
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
        {paymentMethods?.map((option, index) => (
          <TouchableOpacity
            key={option.key}
            className={`flex-row justify-between items-center px-3`}
            onPress={() => handleSelectPaymentMethod(option.key)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="justify-center items-center mr-2 size-10">
                <Image
                  source={imagePaths.icDollar}
                  style={{ width: 20, height: 20 }}
                  contentFit="contain"
                />
              </View>
              <View>
                <Text className="text-[14px] text-[#383B45]">
                  {option.title}
                </Text>
                {option.description && (
                  <Text className="text-[10px] text-[#159747]">
                    {option.description}
                  </Text>
                )}
              </View>
            </View>
            <View className="justify-center items-center w-6 h-6">
              {selectedPaymentMethod === option.key ? (
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
