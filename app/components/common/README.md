# Common Components

This directory contains reusable UI components used throughout the application.

## Button (`Button.tsx`)

A customizable button component.

**Props:**

- `title`: (string, required) The text displayed on the button.
- `variant`: ('primary' | 'secondary' | 'outline', optional, default: 'primary') The style variant of the button.
  - `primary`: Standard primary button style.
  - `secondary`: Standard secondary button style.
  - `outline`: Button with a transparent background and colored border.
- Inherits all props from React Native's `TouchableOpacity`.

**Usage:**

Used for user actions and navigation triggers.

## Carousel (`Carusel.tsx`)

A generic carousel component for displaying items in a scrollable, animated view with pagination. Uses `react-native-reanimated-carousel`.

**Props:**

- `data`: (T[], required) An array of data items to be displayed in the carousel.
- `width`: (number, optional, default: screen width) The width of the carousel container.
- `height`: (number, optional, default: screen width / 2) The height of the carousel container.
- `renderItem`: (function, required) A function that takes an item and its index and returns the React element to render for that item.

**Usage:**

Suitable for image sliders, onboarding flows, or displaying featured content.

## Header (`Header.tsx`)

A standard header component for application screens.

**Props:**

- `title`: (string, optional) The title text displayed in the header.
- `showBack`: (boolean, optional, default: true) If true, displays a "Back" button that navigates to the previous screen.
- `rightComponent`: (React.ReactNode, optional) A React node to display on the right side of the header.

**Usage:**

Provides consistent navigation and context at the top of screens.

## SearchBar (`SearchBar.tsx`)

A search input component with a search icon.

**Props:**

- `placeholder`: (string, optional, default: "Tìm kiếm sản phẩm, cửa hàng") The placeholder text for the search input.
- `value`: (string, optional) The current value of the search input.
- `onChangeText`: (function, optional) Callback function called when the text changes.
- `onSearch`: (function, optional) Callback function called when the search button is pressed or when the user submits the text input.

**Usage:**

Used for search functionality throughout the application, particularly in the SearchScreen.

## ScreenContainer (`ScreenContainer.tsx`)

A wrapper component for screens, providing consistent layout, safe area handling, and optional scrolling.

**Props:**

- `children`: (ReactNode, required) The main content of the screen.
- `scrollable`: (boolean, optional, default: false) If true, the content will be wrapped in a `ScrollView`.
- `safeArea`: (boolean, optional, default: true) If true, the content will be wrapped in a `SafeAreaView`.
- `backgroundColor`: (string, optional) Sets the background color of the container.
- `paddingHorizontal`: (number, optional) Sets horizontal padding. Defaults to theme spacing if not provided.
- `paddingVertical`: (number, optional) Sets vertical padding. Defaults to theme spacing if not provided.
- `header`: (ReactNode, optional) A React node to render above the main content (e.g., a `Header` component).
- `footer`: (ReactNode, optional) A React node to render below the main content.
- `className`: (string, optional) Additional Tailwind CSS classes for the container.

**Usage:**

Ensures consistent screen structure, handles safe areas, and provides basic layout options like scrolling and padding.

## ProductTypeChip (`ProductTypeChip.tsx`)

A customizable chip component primarily used for product type selection.

**Props:**

- `label`: (string, required) The text displayed on the chip.
- `isSelected`: (boolean, required) Whether the chip is in selected state.
- `onPress`: (function, required) Callback function called when the chip is pressed.

**Usage:**

Used for selection UI, particularly for product type or variant selection on product detail screens.
