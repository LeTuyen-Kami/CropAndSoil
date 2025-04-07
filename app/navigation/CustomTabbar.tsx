import React from "react";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Platform, TouchableOpacity } from "react-native";
import { View, Text, StyleSheet } from "react-native";
import { imagePaths } from "~/assets/imagePath";
import { BOTTOM_TAB_HEIGHT } from "~/utils";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const iconMap: { [key: string]: { icon: any; activeIcon: any } } = {
    Home: {
      icon: imagePaths.icHome,
      activeIcon: imagePaths.icHomeActive,
    },
    TempSearch: {
      icon: imagePaths.icSearch,
      activeIcon: imagePaths.icSearch,
    },
    Notifications: {
      icon: imagePaths.icBell,
      activeIcon: imagePaths.icBellActive,
    },
    Profile: {
      icon: imagePaths.icProfile,
      activeIcon: imagePaths.icProfileActive,
    },
  };

  const labelMap: { [key: string]: string } = {
    Home: "Trang chủ",
    TempSearch: "Tìm kiếm",
    Notifications: "Thông báo",
    Profile: "Tài khoản",
  };

  const activeColor = "#159747";
  const inactiveColor = "#7A7F88";

  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = labelMap[route.name] ?? options.title ?? route.name;
        const isFocused = state.index === index;
        const iconSource = iconMap[route.name];

        const onPress = () => {
          if (route.name === "TempSearch") {
            navigation.navigate("Search");
          } else {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        if (index === Math.floor(state.routes.length / 2) - 1) {
          return (
            <React.Fragment key="scan-button">
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
              >
                <Image
                  contentFit="contain"
                  source={isFocused ? iconSource.activeIcon : iconSource.icon}
                  style={[
                    styles.tabIcon,
                    {
                      tintColor: isFocused ? activeColor : inactiveColor,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.tabLabel,
                    { color: isFocused ? activeColor : inactiveColor },
                    isFocused ? styles.tabLabelFocused : styles.tabLabelNormal,
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("ShoppingCart")}
                style={styles.scanButtonContainer}
              >
                <LinearGradient
                  colors={["#07BE4D", "#0D823A"]}
                  style={styles.scanButtonGradient}
                >
                  <Image
                    source={imagePaths.icScan}
                    style={styles.scanIcon}
                    contentFit="contain"
                  />
                </LinearGradient>
              </TouchableOpacity>
            </React.Fragment>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
          >
            <Image
              source={isFocused ? iconSource.activeIcon : iconSource.icon}
              style={[styles.tabIcon]}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? activeColor : inactiveColor },
                isFocused ? styles.tabLabelFocused : styles.tabLabelNormal,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    height: BOTTOM_TAB_HEIGHT,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === "ios" ? 30 : 10,
    paddingHorizontal: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  tabIcon: {
    width: 24,
    height: 24,
  },
  scanIcon: {
    width: 30,
    height: 30,
    tintColor: "#FFFFFF",
  },
  tabLabel: {
    marginTop: 4,
    fontFamily: "Roboto",
    fontWeight: "500",
  },
  tabLabelNormal: {
    fontSize: 12,
  },
  tabLabelFocused: {
    fontSize: 14,
  },
  scanButtonContainer: {
    position: "relative",
    top: -25,
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
  },
  scanButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#0D823A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
});
