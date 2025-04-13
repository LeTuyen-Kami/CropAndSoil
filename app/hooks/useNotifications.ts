import { useState, useMemo } from "react";
import {
  MOCK_NOTIFICATIONS,
  Notification,
  filterNotificationsByType,
} from "~/data/mockNotifications";

export const useNotifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [notifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const filteredNotifications = useMemo(() => {
    return filterNotificationsByType(notifications, activeTab);
  }, [notifications, activeTab]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const getUnreadCount = (type: string) => {
    if (type === "all") {
      return notifications.filter((n) => !n.isRead).length;
    }
    return notifications.filter((n) => !n.isRead && n.type === type).length;
  };

  return {
    notifications: filteredNotifications,
    activeTab,
    handleTabChange,
    getUnreadCount,
  };
};
