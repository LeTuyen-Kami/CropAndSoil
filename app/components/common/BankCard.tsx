import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

interface BankCardProps {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

const BankCard: React.FC<BankCardProps> = ({
  bankName,
  accountNumber,
  accountName,
}) => {
  const formatAccountNumber = (number: string) => {
    return number.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const getBankShortName = (fullName: string) => {
    const match = fullName.match(/- (\w+)$/);
    return match ? match[1] : "BANK";
  };

  return (
    <View className="my-2">
      <LinearGradient
        colors={["#4F46E5", "#7C3AED", "#EC4899"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-5 min-h-[200px] relative overflow-hidden"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-lg font-bold tracking-wide text-white opacity-0">
            {getBankShortName(bankName)}
          </Text>
          <Ionicons name="card" size={24} color="white" />
        </View>

        {/* Account Number */}
        <View className="flex-1 justify-center mb-5">
          <Text
            selectable
            className="text-xl font-semibold tracking-widest text-center text-white"
          >
            {formatAccountNumber(accountNumber)}
          </Text>
        </View>

        {/* Footer */}
        <View className="gap-3">
          <View>
            <Text className="mb-1 text-xs tracking-wider uppercase text-white/70">
              Tên tài khoản
            </Text>
            <Text
              selectable
              className="text-sm font-semibold text-white"
              numberOfLines={1}
            >
              {accountName}
            </Text>
          </View>
          <View>
            <Text className="mb-1 text-xs tracking-wider uppercase text-white/70">
              Ngân hàng
            </Text>
            <Text selectable className="text-sm text-white" numberOfLines={2}>
              {bankName}
            </Text>
          </View>
        </View>

        {/* Decorative Elements */}
        <View className="absolute w-[100px] h-[100px] rounded-full bg-white/10 -top-[30px] -right-[30px]" />
        <View className="absolute w-[60px] h-[60px] rounded-full bg-white/5 -bottom-[15px] -left-[15px]" />
      </LinearGradient>
    </View>
  );
};

export default BankCard;
