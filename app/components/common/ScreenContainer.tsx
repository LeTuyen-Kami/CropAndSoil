import React, { ReactNode } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  safeArea = true,
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
  header,
  footer,
  className,
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const Container = safeArea ? SafeAreaView : View;
  const ContentContainer = scrollable ? ScrollView : View;

  // Create dynamic padding styles based on props
  const paddingStyle: any = {};
  if (paddingHorizontal !== undefined)
    paddingStyle.paddingHorizontal = paddingHorizontal;
  if (paddingVertical !== undefined)
    paddingStyle.paddingVertical = paddingVertical;

  // Create dynamic background style
  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <Container className={`flex-1 ${className || ""}`} style={[bgStyle]}>
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
      />

      {header}

      <ContentContainer
        className={`${scrollable ? "flex-grow" : "flex-1"} ${
          paddingHorizontal === undefined ? "px-4" : ""
        } ${paddingVertical === undefined ? "py-4" : ""}`}
        style={paddingStyle}
      >
        {children}
      </ContentContainer>

      {footer}
    </Container>
  );
};

export default ScreenContainer;
