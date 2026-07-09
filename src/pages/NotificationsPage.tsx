import React from 'react';
import { motion } from 'framer-motion';
import { useNotifications, useMarkNotificationRead } from '@/hooks/useCandidate';
import { Card, CardContent } from '@/components/ui/Card';

const NotificationsPage: React.FC = () => {
const { data: notificationsResponse, isLoading } = useNotifications();
  const notificationsData = notificationsResponse?.data;
  const markRead = useMarkNotificationRead();

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      application_received: '📨',
      application_update: '📋',
      new_job_match: '💼',
      job_saved: '🔖',
      message_received: '💬',
      interview_scheduled: '📅',
      password_changed: '🔐',
      account_locked: '⚠️',
      system: 'ℹ️',
    };
    return icons[type] || '📢';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
        <p className="text-gray-600 mt-2">
          {notificationsData?.unread_count || 0} unread notifications
        </p>
      </motion.div>

      {!notificationsData?.items?.length ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-6xl mb-4">🔔</p>
            <p className="text-gray-500">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notificationsData.items?.map((notification: any, index: number) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className={`py-4 ${!notification.is_read ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className="text-3xl">
                      {getNotificationIcon(notification.notification_type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => markRead.mutate(notification.id)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;