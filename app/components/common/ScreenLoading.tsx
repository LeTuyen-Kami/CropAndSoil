import { atom, useAtom } from "jotai";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { COLORS } from "~/constants/theme";
import { jotaiStore } from "~/store/store";

const loadingAtom = atom(false);

export const toggleLoading = (value?: boolean) => {
  if (value !== undefined && value !== null) {
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
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );
};

export default ScreenLoading;
