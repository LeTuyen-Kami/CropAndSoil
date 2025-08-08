import { useState } from "react";
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "../ui/text";
import { Button } from "../ui/button";
import { Ionicons } from "@expo/vector-icons";

interface SecurityPinModalProps {
  visible: boolean;
  onClose: () => void;
  onVerify: (pin: string) => boolean;
  title?: string;
  subtitle?: string;
}

const SecurityPinModal = ({
  visible,
  onClose,
  onVerify,
  title = "Security Verification",
  subtitle = "Enter PIN to access Network Logger",
}: SecurityPinModalProps) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const handleVerify = () => {
    if (pin.length < 4) {
      setError("PIN must be at least 4 characters");
      return;
    }

    const isValid = onVerify(pin);
    if (isValid) {
      setPin("");
      setError("");
      setAttempts(0);
      onClose();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setError(`Invalid PIN. Attempts: ${newAttempts}/3`);

      if (newAttempts >= 3) {
        setPin("");
        setError("Too many failed attempts. Try again later.");
        setTimeout(() => {
          onClose();
          setError("");
          setAttempts(0);
        }, 2000);
      }
    }
  };

  const handleClose = () => {
    setPin("");
    setError("");
    setAttempts(0);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="p-6 mx-4 w-80 bg-white rounded-2xl">
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <Ionicons name="shield-checkmark" size={24} color="#DC2626" />
                <Text className="ml-2 text-lg font-semibold">{title}</Text>
              </View>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="mb-6 text-sm text-gray-600">{subtitle}</Text>

            <TextInput
              value={pin}
              onChangeText={setPin}
              placeholder="Enter PIN"
              secureTextEntry
              maxLength={10}
              keyboardType="numeric"
              className="px-4 py-3 mb-3 text-base rounded-lg border border-gray-300"
              autoFocus
              style={{
                color: "black",
              }}
              onSubmitEditing={handleVerify}
            />

            {error ? (
              <Text className="mb-4 text-sm text-red-500">{error}</Text>
            ) : null}

            <View className="flex-row gap-3">
              <Button
                onPress={handleClose}
                variant="outline"
                className="flex-1"
              >
                <Text>Cancel</Text>
              </Button>
              <Button
                onPress={handleVerify}
                className="flex-1 bg-red-600"
                disabled={attempts >= 3}
              >
                <Text className="text-white">Verify</Text>
              </Button>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SecurityPinModal;
