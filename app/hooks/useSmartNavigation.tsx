import { useNavigation } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import { RootStackScreenProps } from "~/navigation/types";
import { authAtom } from "~/store/atoms";
export const useSmartNavigation = () => {
  const auth = useAtomValue(authAtom);
  const navigation = useNavigation<RootStackScreenProps<"MainTabs">>();

  const checkAuthThen = (action: () => void) => {
    if (auth?.token) {
      action();
    } else {
      navigation.navigate("Login");
    }
  };

  return {
    smartNavigate: (screenName: string, params?: any) =>
      checkAuthThen(() => navigation.navigate(screenName, params)),

    smartPush: (screenName: string, params?: any) =>
      checkAuthThen(() => navigation.push(screenName, params)),

    smartReplace: (screenName: string, params?: any) =>
      checkAuthThen(() => navigation.replace(screenName, params)),
    navigate: (screenName: string, params?: any) =>
      navigation.navigate(screenName, params),
    push: (screenName: string, params?: any) =>
      navigation.push(screenName, params),
    replace: (screenName: string, params?: any) =>
      navigation.replace(screenName, params),
    smartGoBack: () => {
      navigation.goBack(); // thường không cần auth, nhưng để đây cho đầy đủ
    },

    smartPop: (count = 1) => {
      navigation.pop(count);
    },
  };
};
