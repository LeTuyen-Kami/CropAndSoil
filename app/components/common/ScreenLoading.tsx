import { atom, useAtom } from "jotai";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { jotaiStore } from "~/store/store";

const loadingAtom = atom(false);

export const toggleLoading = (value?: boolean) => {
  if (value) {
    jotaiStore.set(loadingAtom, value);
  } else {
    const previousValue = jotaiStore.get(loadingAtom);
    jotaiStore.set(loadingAtom, !previousValue);
  }
};

const ScreenLoading = () => {
  const [loading] = useAtom(loadingAtom);

  if (!loading) return null;

  return (
    <View
      style={[
        StyleSheet.absoluteFillObject,
        {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        },
      ]}
    >
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

export default ScreenLoading;
