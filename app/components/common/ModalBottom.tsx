import { TouchableWithoutFeedback } from "react-native";
import { View } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ModalBottomProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalBottom = ({ isOpen, onClose, children }: ModalBottomProps) => {
  const { bottom } = useSafeAreaInsets();
  if (!isOpen) return null;

  return (
    <View className="absolute top-0 right-0 bottom-0 left-0">
      <KeyboardAvoidingView
        className="relative flex-col flex-1 justify-end"
        behavior="padding"
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <Animated.View
            className="absolute top-0 right-0 bottom-0 left-0 bg-black/20"
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(100).delay(200)}
          />
        </TouchableWithoutFeedback>

        <Animated.View
          className="w-full bg-white rounded-t-3xl"
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(300)}
          style={[
            {
              paddingBottom: bottom,
            },
          ]}
        >
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ModalBottom;
