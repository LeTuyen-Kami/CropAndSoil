import { AxiosResponse } from "axios";
import { axiosInstance } from "../base";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "order" | "product" | "system" | "promotion";
  isRead: boolean;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

class NotificationService {
  async getNotifications(): Promise<AxiosResponse<Notification[]>> {
    return axiosInstance.get("/notifications");
  }

  async getUnreadCount(): Promise<AxiosResponse<{ count: number }>> {
    return axiosInstance.get("/notifications/unread-count");
  }

  async markAsRead(
    notificationId: string
  ): Promise<AxiosResponse<Notification>> {
    return axiosInstance.patch(`/notifications/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<AxiosResponse<void>> {
    return axiosInstance.patch("/notifications/mark-all-read");
  }

  async deleteNotification(
    notificationId: string
  ): Promise<AxiosResponse<void>> {
    return axiosInstance.delete(`/notifications/${notificationId}`);
  }
}

export const notificationService = new NotificationService();
