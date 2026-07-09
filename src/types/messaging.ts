export interface Conversation {
  id: string;
  conversation_type: string;
  employer_id?: string;
  candidate_id?: string;
  application_id?: string;
  last_message_at?: string;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationListItem {
  id: string;
  conversation_type: string;
  other_party_name: string;
  other_party_id: string;
  last_message?: string;
  last_message_at?: string;
  unread_count: number;
  application_id?: string;
  job_title?: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: string;
  attachment_url?: string;
  status: string;
  is_edited: boolean;
  edited_at?: string;
  created_at: string;
  updated_at: string;
  sender_name?: string;
  recipient_name?: string;
}

export interface TypingIndicator {
  conversation_id: string;
  user_id: string;
  user_name: string;
  is_typing: boolean;
  updated_at: string;
}

export interface OnlineStatus {
  user_id: string;
  user_name: string;
  is_online: boolean;
  last_seen: string;
}

export interface Notification {
  id: string;
  notification_type: string;
  title: string;
  message: string;
  data?: Record<string, any>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

export interface NotificationListResponse {
  items: Notification[];
  total: number;
  unread_count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ChatMessageWS {
  type: string;
  conversation_id: string;
  content: string;
  message_type?: string;
  attachment_url?: string;
}

export interface TypingIndicatorWS {
  type: string;
  conversation_id: string;
  is_typing: boolean;
}

export interface ReadReceiptWS {
  type: string;
  message_id: string;
  status: string;
}