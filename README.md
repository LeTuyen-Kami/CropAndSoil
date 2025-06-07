# CropAndSoil App

## TypeScript Navigation Setup

This project uses React Navigation with TypeScript for type-safe navigation between screens.

### Navigation Structure

The app uses a combination of stack and tab navigation:

- Root Stack Navigator
  - Main Tab Navigator
    - Home Screen
    - Test Screen

### How to Use Type-Safe Navigation

#### 1. Define Screen Parameters

All navigation parameters are defined in `app/navigation/types.ts`:

```typescript
// For tab screens
export type TabParamList = {
  Home: undefined;
  Test: undefined;
  // Add new tab screens here with their params
};

// For stack screens
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  // Add other stack screens here with their params
};
```

#### 2. Using Navigation in Screens

There are two ways to use type-safe navigation in your screens:

**Method 1: Using useNavigation hook (Recommended)**

```typescript
import { useNavigation } from "@react-navigation/native";
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import type { TabParamList } from "~/navigation/types";

// Define the navigation prop type for this specific screen
type ScreenNavigationProp = BottomTabNavigationProp<TabParamList, 'Home'>;

export const MyScreen: React.FC = () => {
  // Use the typed navigation hook
  const navigation = useNavigation<ScreenNavigationProp>();

  // Now you get type-safe navigation methods
  const handleNavigate = () => {
    navigation.navigate('Test'); // Type-safe, will show error if screen doesn't exist
  };

  return (
    // Your component JSX
  );
};
```

**Method 2: Using Screen Props**

```typescript
import type { TabScreenProps } from "~/navigation/types";

// Use the pre-defined screen props type
export const MyScreen: React.FC<TabScreenProps<'Home'>> = ({ navigation }) => {
  // Navigation is already typed
  const handleNavigate = () => {
    navigation.navigate('Test');
  };

  return (
    // Your component JSX
  );
};
```

#### 3. Adding New Screens

1. Add the screen to the appropriate param list in `app/navigation/types.ts`
2. Add the screen component to the navigator in `app/navigation/AppNavigator.tsx`
3. Use type-safe navigation in your components

### Benefits

- Catch navigation errors at compile time
- Autocomplete for screen names
- Type checking for screen parameters
- Better developer experience

### Update dev mode

```
curl -X POST https://rainbow-freezing-antlion.glitch.me/update \
  -H "Content-Type: application/json" \
  -d '{
    "enableNetworkLogger": true,
    "enableSentry": false,
    "deviceId": "1234567890"
  }'
```
