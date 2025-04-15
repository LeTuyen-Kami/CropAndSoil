import React from "react";
import { INotification } from "~/services/api/notification.service";
import DeliveryNotificationItem from "./DeliveryNotificationItem";
import PromotionNotificationItem from "./PromotionNotificationItem";

interface NotificationItemProps {
  notification: INotification;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
}) => {
  if (notification.type === "order") {
    return <DeliveryNotificationItem notification={notification} />;
  } else if (notification.type === "promotion") {
    return <PromotionNotificationItem notification={notification} />;
  }

  // Fallback - should never happen with proper typing
  return null;
};

export default NotificationItem;
