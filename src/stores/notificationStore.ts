import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'claim' | 'message' | 'item' | 'system';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  
  // Actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

// Initial mock notifications
const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'claim',
    title: 'New Claim Request',
    description: 'Someone claimed your lost iPhone 14 Pro',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    read: false,
    link: '/my-claims',
  },
  {
    id: 'notif-2',
    type: 'message',
    title: 'New Message',
    description: 'Sarah sent you a message about MacBook',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
    link: '/messages',
  },
  {
    id: 'notif-3',
    type: 'item',
    title: 'Item Match Found',
    description: 'A found item matches your lost AirPods',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    read: true,
    link: '/browse',
  },
];

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter(n => !n.read).length,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        return {
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: state.unreadCount - 1,
        };
      }
      return state;
    });
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id);
      const wasUnread = notification && !notification.read;
      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: wasUnread ? state.unreadCount - 1 : state.unreadCount,
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },
}));
