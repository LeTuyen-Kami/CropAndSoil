import React, { ReactNode } from "react";
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { cn } from "~/lib/utils";
import Animated, { FadeInUp, SlideInUp } from "react-native-reanimated";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";

interface CenterModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  wrapperClassName?: string;
  hasCloseButton?: boolean;
  canCloseOnTouchOutside?: boolean;
  footer?: ReactNode;
}

const CenterModal: React.FC<CenterModalProps> = ({
  visible,
  onClose,
  children,
  wrapperClassName,
  hasCloseButton = true,
  canCloseOnTouchOutside = true,
  footer,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback
        onPress={canCloseOnTouchOutside ? onClose : undefined}
      >
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View
              style={styles.modalContainer}
              className={cn(
                "bg-white rounded-[10px] w-[80%] max-h-[80%]",
                wrapperClassName
              )}
            >
              {children}
              {hasCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  className="absolute top-2 right-2"
                >
                  <AntDesign name="close" size={24} color="#AEAEAE" />
                </TouchableOpacity>
              )}
            </View>
          </TouchableWithoutFeedback>
          {footer}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default CenterModal;
