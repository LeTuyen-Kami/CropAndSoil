import { AntDesign } from "@expo/vector-icons";
import { atom, useAtom } from "jotai";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  LinearTransition,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
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

// Create the toast atom for multiple toasts
export const toastsAtom = atom<ToastData[]>([]);

export const toast = (
  message: string,
  type: ToastType = "success",
  position: ToastPosition = "top",
  duration: number = 3000,
  id: string = Math.random().toString(36).substring(2, 9)
) => {
  const newToast = {
    id,
    message,
    type,
    position,
    duration,
  };

  jotaiStore.set(toastsAtom, (prev) => [...prev, newToast]);

  // Auto remove toast after duration
  setTimeout(() => {
    jotaiStore.set(toastsAtom, (prev) =>
      prev.filter((toast) => toast.id !== id)
    );
  }, duration);
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
      return <AntDesign name="checkcircleo" size={20} color="#fff" />;
    case "error":
      return <AntDesign name="closecircleo" size={20} color="#fff" />;
    case "warning":
      return <AntDesign name="exclamationcircleo" size={20} color="#fff" />;
    case "info":
      return <AntDesign name="questioncircleo" size={20} color="#fff" />;
    default:
      return null;
  }
};

// Toast background colors
const getToastBackgroundColor = (type: ToastType) => {
  switch (type) {
    case "success":
      return "rgba(40, 167, 69, 0.9)";
    case "error":
      return "rgba(220, 53, 69, 0.9)";
    case "warning":
      return "rgba(255, 193, 7, 0.9)";
    case "info":
      return "rgba(23, 162, 184, 0.9)";
    default:
      return "rgba(52, 58, 64, 0.9)";
  }
};

// Toast component
const Toast = ({ toast, onHide }: { toast: ToastData; onHide: () => void }) => {
  const backgroundColor = getToastBackgroundColor(toast.type);
  const entering =
    toast.position === "top"
      ? SlideInUp.springify().damping(15)
      : SlideInDown.springify().damping(15);
  const exiting =
    toast.position === "top"
      ? SlideOutUp.springify().damping(15)
      : SlideOutDown.springify().damping(15);

  return (
    <Animated.View
      entering={entering}
      exiting={exiting}
      layout={LinearTransition}
      style={[styles.toast, { backgroundColor }]}
      onTouchEnd={onHide}
    >
      <View style={styles.iconContainer}>{getToastIcon(toast.type)}</View>
      <Text style={styles.message}>{toast.message}</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onHide}>
        <AntDesign name="close" size={16} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// ToastHolder component
export const ToastHolder = () => {
  const [toasts, setToasts] = useAtom(toastsAtom);
  const insets = useSafeAreaInsets();

  const handleHideToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  if (!toasts.length) return null;

  // Group toasts by position
  const topToasts = toasts.filter((toast) => toast.position !== "bottom");
  const bottomToasts = toasts.filter((toast) => toast.position === "bottom");

  return (
    <>
      {topToasts.length > 0 && (
        <View style={[styles.container, { top: insets.top + 10 }]}>
          {topToasts.map((toast) => (
            <Animated.View
              key={toast.id}
              style={styles.toastWrapper}
              layout={LinearTransition}
            >
              <Toast toast={toast} onHide={() => handleHideToast(toast.id)} />
            </Animated.View>
          ))}
        </View>
      )}

      {bottomToasts.length > 0 && (
        <View style={[styles.container, { bottom: insets.bottom + 10 }]}>
          {bottomToasts.map((toast) => (
            <Animated.View
              key={toast.id}
              style={styles.toastWrapper}
              layout={LinearTransition}
            >
              <Toast toast={toast} onHide={() => handleHideToast(toast.id)} />
            </Animated.View>
          ))}
        </View>
      )}
    </>
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
  toastWrapper: {
    width: "100%",
    marginBottom: 8,
    alignItems: "center",
  },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
    maxWidth: 500,
    width: "90%",
  },
  iconContainer: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  closeButton: {
    marginLeft: 12,
    padding: 2,
  },
});

// For backward compatibility
export const toastAtom = toastsAtom;

export default ToastHolder;
