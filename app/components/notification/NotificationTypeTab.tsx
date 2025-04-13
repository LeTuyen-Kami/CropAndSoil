import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

type NotificationTab = {
  id: string;
  title: string;
};

const TABS: NotificationTab[] = [
  {
    id: "all",
    title: "Tất cả",
  },
  {
    id: "delivery",
    title: "Giao hàng",
  },
  {
    id: "promotion",
    title: "Khuyến mãi",
  },
  {
    id: "system",
    title: "Hệ thống",
  },
];

interface NotificationTypeTabProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NotificationTypeTab: React.FC<NotificationTypeTabProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab.id ? "#0EB04B" : "transparent",
              },
            ]}
            onPress={() => onTabChange(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color: activeTab === tab.id ? "#ffffff" : "#0EB04B",
                },
              ]}
            >
              {tab.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: {
    fontSize: 12,
    fontWeight: "500",
  },
});

export default NotificationTypeTab;
