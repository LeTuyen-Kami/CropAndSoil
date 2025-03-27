import { View, ScrollView } from "react-native";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { ENV } from "~/utils";

const Buttons = () => {
  return (
    <ScreenContainer header={<Header title="Buttons" />} scrollable>
      <View className="p-0">
        <Text className="mb-2 ont-bold text-foreground">
          Welcome to Your App
        </Text>
        <Text className="mb-8 text-neutral-600">
          Start building something amazing!
        </Text>

        {/* Default variant */}
        <Button
          className="w-full mb-4"
          onPress={() => console.log("Default pressed")}
        >
          <Text>Default Button 123</Text>
        </Button>

        {/* Light Solid variant */}
        <Button
          variant="lightSolid"
          className="w-full mb-4"
          onPress={() => console.log("Light Solid pressed")}
        >
          <Text>Light Solid Button</Text>
        </Button>

        {/* Outline variant */}
        <Button
          variant="outline"
          className="w-full mb-4"
          onPress={() => console.log("Outline pressed")}
        >
          <Text>Outline Button</Text>
        </Button>

        {/* Light Outline variant */}
        <Button
          variant="lightOutline"
          className="w-full mb-4"
          onPress={() => console.log("Light Outline pressed")}
        >
          <Text>Light Outline Button</Text>
        </Button>

        {/* Ghost variant */}
        <Button
          variant="ghost"
          className="w-full mb-4"
          onPress={() => console.log("Ghost pressed")}
        >
          <Text>Ghost Button</Text>
        </Button>

        {/* Disabled buttons */}
        <Button
          disabled
          className="w-full mb-4"
          onPress={() => console.log("Disabled pressed")}
        >
          <Text>Disabled Button</Text>
        </Button>

        <Button
          disabled
          variant="lightSolid"
          className="w-full mb-4"
          onPress={() => console.log("Disabled light solid pressed")}
        >
          <Text>Disabled Light Solid</Text>
        </Button>

        <Button
          disabled
          variant="outline"
          className="w-full mb-4"
          onPress={() => console.log("Disabled outline pressed")}
        >
          <Text>Disabled Outline</Text>
        </Button>

        <Button
          disabled
          variant="ghost"
          className="w-full mb-4"
          onPress={() => console.log("Disabled ghost pressed")}
        >
          <Text>Disabled Ghost</Text>
        </Button>

        {/* Different sizes */}
        <View className="flex-row justify-between w-full mt-4">
          <Button size="sm" onPress={() => console.log("Small pressed")}>
            <Text>Small</Text>
          </Button>

          <Button
            size="default"
            onPress={() => console.log("Default size pressed")}
          >
            <Text>Default</Text>
          </Button>

          <Button size="lg" onPress={() => console.log("Large pressed")}>
            <Text>Large</Text>
          </Button>
        </View>

        <Text className="mt-4 text-foreground">
          API URL: {ENV.EXPO_PUBLIC_BASE_URL}
        </Text>
      </View>
    </ScreenContainer>
  );
};

export default Buttons;
