import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ProductTypeChipProps {
  label: string;
  isSelected?: boolean;
  onPress?: () => void;
}

const ProductTypeChip = ({
  label,
  isSelected = false,
  onPress,
}: ProductTypeChipProps) => {
  return (
    <TouchableOpacity
      disabled
      style={[
        styles.productTypeChip,
        isSelected && styles.productTypeChipSelected,
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.productTypeChipText,
          isSelected && styles.productTypeChipTextSelected,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productTypeChip: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 32,
    borderRadius: 1000,
    borderWidth: 1.2,
    borderColor: "#DEF1E5",
    backgroundColor: "#FFFFFF",
  },
  productTypeChipSelected: {
    backgroundColor: "#DEF1E5",
    borderColor: "#BEE2CC",
  },
  productTypeChipText: {
    fontFamily: "Roboto",
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.25,
    textAlign: "center",
    color: "#159747",
  },
  productTypeChipTextSelected: {
    color: "#159747",
  },
});

export default ProductTypeChip;
