import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { imagePaths } from "~/assets/imagePath";

export interface FallbackUIProps {
  error: Error;
  resetError: () => void;
}

const FallBackUI: React.FC<FallbackUIProps> = ({ error, resetError }) => {
  const goToMainTabs = () => {
    resetError();
  };

  return (
    <View style={styles.container}>
      <Image
        source={imagePaths.objectError}
        style={styles.errorImage}
        contentFit="contain"
      />
      <Text style={styles.title}>Đã xảy ra lỗi!</Text>
      <Text style={styles.error}>{error.toString()}</Text>
      <Text style={styles.message}>
        Rất tiếc, ứng dụng đã gặp sự cố không mong muốn. Vui lòng thử lại hoặc
        quay về trang chủ.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={goToMainTabs}
        >
          <Image
            source={imagePaths.icHome}
            style={[styles.buttonIcon, styles.homeIcon]}
            contentFit="contain"
          />
          <Text style={[styles.buttonText, styles.primaryButtonText]}>
            Về trang chủ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FallBackUI;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  errorImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#dc3545",
  },
  error: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 10,
    textAlign: "center",
  },
  message: {
    fontSize: 16,
    color: "#343a40",
    marginBottom: 30,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    gap: 12,
  },
  button: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    minWidth: 120,
  },
  primaryButton: {
    backgroundColor: "#0D823A",
    borderWidth: 0,
  },
  buttonIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  homeIcon: {
    tintColor: "#fff",
  },
  buttonText: {
    color: "#343a40",
    fontWeight: "600",
    fontSize: 15,
  },
  primaryButtonText: {
    color: "#ffffff",
  },
});
