import React, { ReactNode } from "react";
import { SafeAreaView, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useColorScheme } from "~/lib/useColorScheme";
import { cn } from "~/lib/utils";
import { BOTTOM_TAB_HEIGHT } from "~/utils";

interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  safeArea?: boolean;
  backgroundColor?: string;
  paddingHorizontal?: number;
  paddingVertical?: number;
  paddingBottom?: number;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  hasBottomTabs?: boolean;
  refreshControl?: any;
  wrapperClassName?: string;
}

const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  safeArea = true,
  backgroundColor,
  paddingHorizontal,
  paddingVertical,
  paddingBottom,
  header,
  footer,
  className,
  hasBottomTabs = true,
  refreshControl,
  wrapperClassName,
}) => {
  const { isDarkColorScheme } = useColorScheme();
  const Container = safeArea ? SafeAreaView : View;
  const ContentContainer = scrollable ? KeyboardAwareScrollView : View;

  // Create dynamic padding styles based on props
  const paddingStyle: any = {};
  if (paddingHorizontal !== undefined)
    paddingStyle.paddingHorizontal = paddingHorizontal;
  if (paddingVertical !== undefined)
    paddingStyle.paddingVertical = paddingVertical;
  if (paddingBottom !== undefined) {
    paddingStyle.paddingBottom = paddingBottom;
  } else if (hasBottomTabs) {
    // Add default padding at the bottom to prevent content from being hidden by the tab bar
    paddingStyle.paddingBottom = BOTTOM_TAB_HEIGHT;
  }

  // Create dynamic background style
  const bgStyle = backgroundColor ? { backgroundColor } : {};

  return (
    <Container className={`flex-1 ${className || ""}`} style={[bgStyle]}>
      {/* <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isDarkColorScheme ? "light-content" : "dark-content"}
      /> */}

      {header}
      <ContentContainer
        className={cn(
          scrollable ? "flex-grow" : "flex-1",
          paddingHorizontal === undefined ? "px-4" : "",
          paddingVertical === undefined ? "py-4" : "",
          wrapperClassName
        )}
        bottomOffset={50}
        style={paddingStyle}
        contentContainerStyle={
          scrollable && hasBottomTabs ? { paddingBottom: 20 } : undefined
        }
        {...(refreshControl && scrollable ? { refreshControl } : {})}
      >
        {children}
      </ContentContainer>

      {footer}
    </Container>
  );
};

export default ScreenContainer;
