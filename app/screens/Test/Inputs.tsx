import { View } from "react-native";
import Header from "~/components/common/Header";
import ScreenContainer from "~/components/common/ScreenContainer";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

const Inputs: React.FC = () => {
  return (
    <ScreenContainer header={<Header title="Inputs" />} scrollable>
      <Text>Test Input</Text>
      <Input
        placeholder="Test Input"
        rightIcon={<Text>Test</Text>}
        className="border border-neutral-400"
        error="Test Error"
      />
    </ScreenContainer>
  );
};

export default Inputs;
