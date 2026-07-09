import apiClient from './client';
import type {
  Conversation,
  ConversationListItem,
  Message,
  TypingIndicator,
  OnlineStatus,
  Notification,
  ChatMessageWS,
  TypingIndicatorWS,
} from '@/types/messaging';

export const messagingApi = {
  getConversations: async () => {
    const response = await apiClient.get<{ success: boolean; data: { items: ConversationListItem[]; total: number } }>('/messaging/conversations');
    return response.data;
  },

  getConversation: async (conversationId: string) => {
    const response = await apiClient.get<{ success: boolean; data: Conversation }>(`/messaging/conversations/${conversationId}`);
    return response.data;
  },

  createConversation: async (data: { employer_id?: string; candidate_id: string; application_id?: string }) => {
    const response = await apiClient.post<{ success: boolean; data: Conversation }>('/messaging/conversations', data);
    return response.data;
  },

  getMessages: async (conversationId: string, skip: number = 0, limit: number = 50) => {
    const response = await apiClient.get<{ success: boolean; data: { items: Message[]; total: number } }>(
      `/messaging/conversations/${conversationId}/messages`,
      { params: { skip, limit } }
    );
    return response.data;
  },

  sendMessage: async (data: { conversation_id: string; content: string; message_type?: string; attachment_url?: string }) => {
    const response = await apiClient.post<{ success: boolean; data: { message: Message; notification: any } }>('/messaging/messages', data);
    return response.data;
  },

  markMessageRead: async (messageId: string) => {
    const response = await apiClient.patch<{ success: boolean; data: Message }>(`/messaging/messages/${messageId}/read`);
    return response.data;
  },

  setTypingIndicator: async (conversationId: string, is_typing: boolean) => {
    const response = await apiClient.post<{ success: boolean; data: TypingIndicator }>(
      `/messaging/conversations/${conversationId}/typing`,
      null,
      { params: { is_typing } }
    );
    return response.data;
  },

  getTypingIndicators: async (conversationId: string) => {
    const response = await apiClient.get<{ success: boolean; data: { items: TypingIndicator[]; total: number } }>(
      `/messaging/conversations/${conversationId}/typing`
    );
    return response.data;
  },

  getOnlineStatus: async (userId: string) => {
    const response = await apiClient.get<{ success: boolean; data: OnlineStatus }>(`/messaging/users/${userId}/online-status`);
    return response.data;
  },

  setOnlineStatus: async (is_online: boolean, socket_id?: string) => {
    const response = await apiClient.post<{ success: boolean; data: OnlineStatus }>('/messaging/users/online-status', null, {
      params: { is_online, socket_id },
    });
    return response.data;
  },

  getNotifications: async (skip: number = 0, limit: number = 20) => {
    const response = await apiClient.get<{ success: boolean; data: NotificationListResponse }>('/messaging/notifications', {
      params: { skip, limit },
    });
    return response.data;
  },

  markNotificationRead: async (notificationId?: string, markAll: boolean = false) => {
    const response = await apiClient.patch<{ success: boolean; message: string }>('/messaging/notifications/mark-read', {
      notification_id: notificationId,
      mark_all: markAll,
    });
    return response.data;
  },
};