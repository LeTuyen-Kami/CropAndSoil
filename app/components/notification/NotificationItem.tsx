import React from "react";
import { Notification } from "~/data/mockNotifications";
import DeliveryNotificationItem from "./DeliveryNotificationItem";
import PromotionNotificationItem from "./PromotionNotificationItem";

interface NotificationItemProps {
  notification: Notification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  if (notification.type === "delivery") {
    return <DeliveryNotificationItem notification={notification} />;
  } else if (notification.type === "promotion") {
    return <PromotionNotificationItem notification={notification} />;
  }

  // Fallback - should never happen with proper typing
  return null;
};

export default NotificationItem;
