import { Image } from "expo-image";
import React, { useEffect, useRef } from "react";
import { TextInput, View, TouchableOpacity } from "react-native";
import { imagePaths } from "~/assets/imagePath";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  onSearch?: () => void;
}

const SearchBar = ({
  placeholder = "Tìm kiếm sản phẩm, cửa hàng",
  value,
  onChangeText,
  onSearch,
}: SearchBarProps) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  }, []);

  return (
    <View className="px-2">
      <View className="flex-row items-center bg-[#F5F5F5] border border-[#F0F0F0] rounded-full px-[22px]">
        <TextInput
          ref={inputRef}
          className="flex-1 text-base text-[#383B45] leading-tight h-[46px]"
          placeholder={placeholder}
          placeholderTextColor="#CCCCCC"
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
        />
        <TouchableOpacity onPress={onSearch} className="w-5 h-5">
          <Image
            source={imagePaths.icMagnifier}
            style={{ width: 20, height: 20 }}
            contentFit="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchBar;
