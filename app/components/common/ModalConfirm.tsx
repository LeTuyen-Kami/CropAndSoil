import { useAtom } from "jotai";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { confirmAtom } from "~/store/atoms";
import { Button } from "../ui/button";
import { Text } from "../ui/text";

const ModalConfirm = () => {
  const [confirmState, setConfirmState] = useAtom(confirmAtom);

  if (!confirmState?.isOpen) return null;

  const handleClose = () => {
    confirmState?.onCancel?.();
    setConfirmState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  const handleConfirm = () => {
    confirmState?.onConfirm();
    setConfirmState((prev) => ({
      ...prev,
      isOpen: false,
    }));
  };

  return (
    <Animated.View
      style={[styles.overlay]}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(100).delay(200)}
    >
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>
      <Animated.View
        style={styles.modalContainer}
        entering={SlideInDown.duration(200).delay(100)}
        exiting={SlideOutDown.duration(200)}
      >
        <View className="px-5 py-4 bg-white rounded-lg">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold">{confirmState?.title}</Text>
          </View>

          <View className="py-2">
            <Text className="text-base text-gray-600">
              {confirmState?.message}
            </Text>
          </View>

          <View className="flex-row gap-3 justify-end mt-4">
            <Button variant="ghost" onPress={handleClose} className="min-w-20">
              <Text className="text-sm text-gray-600">Hủy</Text>
            </Button>
            <Button onPress={handleConfirm} className="bg-red-500 min-w-20">
              <Text className="text-sm text-white">Xác nhận</Text>
            </Button>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: "center",
    alignItems: "center",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "80%",
    maxWidth: 400,
  },
});

export default ModalConfirm;
