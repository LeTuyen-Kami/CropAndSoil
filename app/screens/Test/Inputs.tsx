import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

const Inputs: React.FC = () => {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView
      behavior={"padding"}
      keyboardVerticalOffset={100}
      style={styles.content}
    >
      <View style={styles.inner}>
        <Text style={styles.heading}>Header</Text>
        <View>
          <TextInput placeholder="Username" style={styles.textInput} />
          <TextInput placeholder="Password" style={styles.textInput} />
        </View>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Submit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.text}>Go back</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default Inputs;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    maxHeight: 600,
  },
  heading: {
    fontSize: 36,
    marginBottom: 48,
    fontWeight: "600",
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-between",
  },
  textInput: {
    height: 45,
    borderColor: "#000000",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 36,
    paddingLeft: 10,
  },
  button: {
    marginTop: 12,
    height: 45,
    borderRadius: 10,
    backgroundColor: "rgb(40, 64, 147)",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontWeight: "500",
    fontSize: 16,
    color: "white",
  },
});
