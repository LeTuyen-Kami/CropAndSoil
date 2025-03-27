import React from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ENV } from "~/utils";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/types";
import ScreenContainer from "~/components/common/ScreenContainer";
const TestScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleNavigateToInput = () => {
    navigation.navigate("Inputs");
  };

  const handleNavigateToButton = () => {
    navigation.navigate("Buttons");
  };

  return (
    <ScreenContainer>
      <View className="flex-1 items-center justify-center gap-4">
        <Button onPress={handleNavigateToButton}>
          <Text>Test Button</Text>
        </Button>

        <Button onPress={handleNavigateToInput}>
          <Text>Test Input</Text>
        </Button>
      </View>
    </ScreenContainer>
  );
};

export default TestScreen;
