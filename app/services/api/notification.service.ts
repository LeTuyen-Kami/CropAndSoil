import { PaginatedResponse, PaginationRequests } from "~/types";
import { typedAxios } from "../base";

export interface Payload {
  id: number;
}

export interface INotification {
  content: string;
  createdAt: string;
  id: number;
  payload: Payload;
  thumbnail: string;
  title: string;
  type: string;
  isRead: boolean;
}

class NotificationService {
  async getNotifications(data: PaginationRequests) {
    return typedAxios.get<PaginatedResponse<INotification>>("/notifications", {
      params: data,
    });
  }

  async getNotificationsDetail(id: string) {
    return typedAxios.get<INotification>(`/notifications/${id}`);
  }
}

export const notificationService = new NotificationService();
