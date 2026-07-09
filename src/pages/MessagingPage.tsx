import React from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { messagingApi } from '@/api/messaging';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { ConversationListItem, Message } from '@/types/messaging';

const MessagingPage: React.FC = () => {
  const [conversations, setConversations] = React.useState<ConversationListItem[]>([]);
  const [selectedConversation, setSelectedConversation] = React.useState<ConversationListItem | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [typingUsers, setTypingUsers] = React.useState<Map<string, boolean>>(new Map());
  const [ws, setWs] = React.useState<WebSocket | null>(null);
  const [onlineStatuses, setOnlineStatuses] = React.useState<Map<string, boolean>>(new Map());
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    loadConversations();
  }, []);

  React.useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
      startTypingPoll(selectedConversation.id);
    }
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [selectedConversation]);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await messagingApi.getConversations();
      setConversations(res.data?.items || []);
    } catch (e) {
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const res = await messagingApi.getMessages(conversationId);
      setMessages(res.data?.items || []);
    } catch (e) {
      toast.error('Failed to load messages');
    }
  };

  const startTypingPoll = (conversationId: string) => {
    const interval = setInterval(async () => {
      try {
        const res = await messagingApi.getTypingIndicators(conversationId);
        const indicators = res.data?.items || [];
        const newTyping = new Map<string, boolean>();
        indicators.forEach((ind: any) => {
          newTyping.set(ind.user_id, ind.is_typing);
        });
        setTypingUsers(newTyping);
      } catch (e) {
        // Silently ignore polling errors
      }
    }, 2000);
    return () => clearInterval(interval);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const res = await messagingApi.sendMessage({
        conversation_id: selectedConversation.id,
        content: newMessage.trim(),
        message_type: 'text',
      });
      setMessages(prev => [...prev, res.data!.message]);
      setNewMessage('');
      toast.success('Message sent');
    } catch (e) {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleTyping = async () => {
    if (!selectedConversation) return;

    await messagingApi.setTypingIndicator(selectedConversation.id, true);

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(async () => {
      await messagingApi.setTypingIndicator(selectedConversation.id, false);
    }, 2000);
  };

  const getTypingText = () => {
    if (!selectedConversation) return '';
    const typing = Array.from(typingUsers.entries()).filter(([, isTyping]) => isTyping);
    if (typing.length === 0) return '';
    const names = typing.map(([userId]) => {
      const msg = messages.find(m => m.sender_id === userId || m.recipient_id === userId);
      return msg?.sender_name || msg?.recipient_name || 'Someone';
    });
    if (names.length === 1) return `${names[0]} is typing...`;
    if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
    return `${names.length} people are typing...`;
  };

  const getOnlineText = (userId: string) => {
    const isOnline = onlineStatuses.get(userId);
    return isOnline ? '🟢 Online' : '⚫ Offline';
  };

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with employers and candidates</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardContent className="p-0">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-gray-900">Conversations</h3>
            </div>
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p className="text-4xl mb-2">💬</p>
                <p>No conversations yet</p>
              </div>
            ) : (
              <div className="divide-y">
                {conversations.map((conv, index) => (
                  <motion.div
                    key={conv.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedConversation?.id === conv.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-gray-900 text-sm">{conv.other_party_name}</h4>
                          {conv.unread_count > 0 && (
                            <span className="text-xs bg-primary-600 text-white px-2 py-0.5 rounded-full">
                              {conv.unread_count}
                            </span>
                          )}
                        </div>
                        {conv.job_title && (
                          <p className="text-xs text-gray-500 mt-0.5">{conv.job_title}</p>
                        )}
                        {conv.last_message && (
                          <p className="text-sm text-gray-600 mt-1 truncate">{conv.last_message}</p>
                        )}
                      </div>
                      <div className="text-xs text-gray-400 ml-2">
                        {conv.last_message_at && new Date(conv.last_message_at).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            {!selectedConversation ? (
              <div className="h-96 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <p className="text-6xl mb-4">💬</p>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.other_party_name}</h3>
                    <p className="text-sm text-gray-500">
                      {getOnlineText(selectedConversation.other_party_id)}
                      {selectedConversation.job_title && ` · ${selectedConversation.job_title}`}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-3">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      className={`flex ${msg.sender_id === (selectedConversation?.other_party_id) ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          msg.sender_id === (selectedConversation?.other_party_id)
                            ? 'bg-gray-100 text-gray-900'
                            : 'bg-primary-600 text-white'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender_id === (selectedConversation?.other_party_id) ? 'text-gray-500' : 'text-primary-100'
                          }`}
                        >
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {msg.is_edited && ' (edited)'}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Typing indicator */}
                {typingUsers.size > 0 && (
                  <div className="px-4 py-2 text-sm text-gray-500 italic">
                    {getTypingText()}
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Button onClick={handleSendMessage} isLoading={sending} disabled={!newMessage.trim()}>
                      Send
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MessagingPage;