import { AntDesign } from "@expo/vector-icons";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { jotaiStore } from "~/store/store";

// Define the toast type
export type ToastType = "success" | "error" | "warning" | "info";

// Define the toast position
export type ToastPosition = "top" | "bottom";

// Define the toast data structure
export interface ToastData {
  id: string;
  message: string;
  type: ToastType;
  position?: ToastPosition;
  duration?: number;
}

// Create the toast atom
export const toastAtom = atom<ToastData | null>(null);

export const toast = (
  message: string,
  type: ToastType = "success",
  position: ToastPosition = "top",
  duration: number = 3000,
  id: string = Math.random().toString(36).substring(2, 9)
) => {
  jotaiStore.set(toastAtom, {
    id: id,
    message,
    type,
    position,
    duration,
  });
};

toast.error = (
  message: string,
  position: ToastPosition = "top",
  duration: number = 3000,
  id?: string
) => {
  toast(message, "error", position, duration, id);
};

toast.success = (
  message: string,
  position: ToastPosition = "top",
  duration: number = 3000,
  id?: string
) => {
  toast(message, "success", position, duration, id);
};

toast.warning = (
  message: string,
  position: ToastPosition = "top",
  duration: number = 3000,
  id?: string
) => {
  toast(message, "warning", position, duration, id);
};

toast.info = (
  message: string,
  position: ToastPosition = "top",
  duration: number = 3000,
  id?: string
) => {
  toast(message, "info", position, duration, id);
};

// Toast icons
const getToastIcon = (type: ToastType) => {
  switch (type) {
    case "success":
      return <AntDesign name="checkcircleo" size={20} color="#047857" />;
    case "error":
      return <AntDesign name="closecircleo" size={20} color="#b91c1c" />;
    case "warning":
      return <AntDesign name="exclamationcircleo" size={20} color="#92400e" />;
    case "info":
      return <AntDesign name="questioncircleo" size={20} color="#0369a1" />;
    default:
      return null;
  }
};

// Toast colors
const getToastColors = (type: ToastType) => {
  switch (type) {
    case "success":
      return {
        background: "#d1fae5",
        text: "#047857",
        border: "#34d399",
      };
    case "error":
      return {
        background: "#fee2e2",
        text: "#b91c1c",
        border: "#f87171",
      };
    case "warning":
      return {
        background: "#fffbeb",
        text: "#92400e",
        border: "#fbbf24",
      };
    case "info":
      return {
        background: "#e0f2fe",
        text: "#0369a1",
        border: "#38bdf8",
      };
    default:
      return {
        background: "#f3f4f6",
        text: "#1f2937",
        border: "#9ca3af",
      };
  }
};

// Toast component
const Toast = ({ toast, onHide }: { toast: ToastData; onHide: () => void }) => {
  const opacity = useSharedValue(0);
  const offset = useSharedValue(toast.position === "top" ? -100 : 100);
  const colors = getToastColors(toast.type);

  useEffect(() => {
    // Show animation
    opacity.value = withTiming(1, { duration: 300 });
    offset.value = withTiming(0, { duration: 300 });

    // Auto-hide after duration
    const timeout = setTimeout(() => {
      hideToast();
    }, toast.duration || 3000);

    return () => clearTimeout(timeout);
  }, [toast.id]);

  const hideToast = () => {
    opacity.value = withTiming(0, { duration: 300 });
    offset.value = withTiming(
      toast.position === "top" ? -100 : 100,
      { duration: 300 },
      () => runOnJS(onHide)()
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: offset.value }],
  }));

  return (
    <Animated.View
      style={[
        styles.toast,
        animatedStyle,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <View style={styles.iconContainer}>{getToastIcon(toast.type)}</View>
      <Text style={[styles.message, { color: colors.text }]}>
        {toast.message}
      </Text>
      <TouchableOpacity style={styles.closeButton} onPress={hideToast}>
        <AntDesign name="close" size={16} color={colors.text} />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ToastHolder component
export const ToastHolder = () => {
  const [toast, setToast] = useAtom(toastAtom);
  const insets = useSafeAreaInsets();

  const handleHideToast = () => {
    setToast(null);
  };

  if (!toast) return null;

  return (
    <View
      style={[
        styles.container,
        toast.position === "top"
          ? { top: insets.top + 10 }
          : { bottom: insets.bottom + 10 },
      ]}
    >
      <Toast toast={toast} onHide={handleHideToast} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: 500,
    width: "100%",
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    fontSize: 18,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
  },
  closeButton: {
    marginLeft: 12,
    padding: 2,
  },
});

export default ToastHolder;
