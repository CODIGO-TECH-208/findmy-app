import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  User,
  Item,
  Claim,
  Message,
  Conversation,
  ItemCategory,
  mockUsers,
  mockItems,
  mockClaims,
  mockConversations,
  mockMessages,
  mockStats,
} from "@/data/mockData";

interface DatabaseState {
  // Data tables
  users: User[];
  items: Item[];
  claims: Claim[];
  conversations: Conversation[];
  messages: Message[];
  initialized: boolean;

  // ── Users CRUD ──
  getUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  getUsersByRole: (role: "user" | "admin") => User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // ── Items CRUD ──
  getItems: () => Item[];
  getItemById: (id: string) => Item | undefined;
  getItemsByUser: (userId: string) => Item[];
  getItemsByType: (type: "lost" | "found") => Item[];
  getItemsByStatus: (status: "active" | "claimed" | "resolved") => Item[];
  getItemsByCategory: (category: ItemCategory) => Item[];
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;

  // ── Claims CRUD ──
  getClaims: () => Claim[];
  getClaimById: (id: string) => Claim | undefined;
  getClaimsByUser: (userId: string) => Claim[];
  getClaimsByItem: (itemId: string) => Claim[];
  getClaimsByStatus: (status: "pending" | "accepted" | "rejected") => Claim[];
  addClaim: (claim: Claim) => void;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  deleteClaim: (id: string) => void;

  // ── Conversations CRUD ──
  getConversations: () => Conversation[];
  getConversationById: (id: string) => Conversation | undefined;
  getConversationsByUser: (userId: string) => Conversation[];
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;

  // ── Messages CRUD ──
  getMessages: () => Message[];
  getMessagesByConversation: (conversationId: string) => Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;

  // ── Stats ──
  getStats: () => {
    itemsRecovered: number;
    activeListings: number;
    registeredUsers: number;
    successRate: number;
  };

  // ── Init ──
  initialize: () => void;
  reset: () => void;
}

export const useDatabaseStore = create<DatabaseState>()(
  persist(
    (set, get) => ({
      users: [],
      items: [],
      claims: [],
      conversations: [],
      messages: [],
      initialized: false,

      // ── Initialize with mock data if not already populated ──
      initialize: () => {
        const state = get();
        if (!state.initialized) {
          set({
            users: mockUsers,
            items: mockItems,
            claims: mockClaims,
            conversations: mockConversations,
            messages: mockMessages,
            initialized: true,
          });
        }
      },

      reset: () => {
        set({
          users: mockUsers,
          items: mockItems,
          claims: mockClaims,
          conversations: mockConversations,
          messages: mockMessages,
          initialized: true,
        });
      },

      // ── Users ──
      getUsers: () => get().users,
      getUserById: (id) => get().users.find((u) => u.id === id),
      getUsersByRole: (role) => get().users.filter((u) => u.role === role),
      addUser: (user) =>
        set((s) => ({ users: [...s.users, user] })),
      updateUser: (id, updates) =>
        set((s) => ({
          users: s.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        })),
      deleteUser: (id) =>
        set((s) => ({ users: s.users.filter((u) => u.id !== id) })),

      // ── Items ──
      getItems: () => get().items,
      getItemById: (id) => get().items.find((i) => i.id === id),
      getItemsByUser: (userId) => get().items.filter((i) => i.userId === userId),
      getItemsByType: (type) => get().items.filter((i) => i.type === type),
      getItemsByStatus: (status) => get().items.filter((i) => i.status === status),
      getItemsByCategory: (category) => get().items.filter((i) => i.category === category),
      addItem: (item) =>
        set((s) => ({ items: [item, ...s.items] })),
      updateItem: (id, updates) =>
        set((s) => ({
          items: s.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        })),
      deleteItem: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),

      // ── Claims ──
      getClaims: () => get().claims,
      getClaimById: (id) => get().claims.find((c) => c.id === id),
      getClaimsByUser: (userId) => get().claims.filter((c) => c.userId === userId),
      getClaimsByItem: (itemId) => get().claims.filter((c) => c.itemId === itemId),
      getClaimsByStatus: (status) => get().claims.filter((c) => c.status === status),
      addClaim: (claim) =>
        set((s) => ({ claims: [claim, ...s.claims] })),
      updateClaim: (id, updates) =>
        set((s) => ({
          claims: s.claims.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        })),
      deleteClaim: (id) =>
        set((s) => ({ claims: s.claims.filter((c) => c.id !== id) })),

      // ── Conversations ──
      getConversations: () => get().conversations,
      getConversationById: (id) => get().conversations.find((c) => c.id === id),
      getConversationsByUser: (userId) =>
        get().conversations.filter((c) =>
          c.participants.some((p) => p.id === userId)
        ),
      addConversation: (conversation) =>
        set((s) => ({ conversations: [conversation, ...s.conversations] })),
      updateConversation: (id, updates) =>
        set((s) => ({
          conversations: s.conversations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        })),
      deleteConversation: (id) =>
        set((s) => ({
          conversations: s.conversations.filter((c) => c.id !== id),
        })),

      // ── Messages ──
      getMessages: () => get().messages,
      getMessagesByConversation: (conversationId) =>
        get().messages.filter((m) => m.conversationId === conversationId),
      addMessage: (message) =>
        set((s) => ({ messages: [...s.messages, message] })),
      updateMessage: (id, updates) =>
        set((s) => ({
          messages: s.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        })),
      deleteMessage: (id) =>
        set((s) => ({ messages: s.messages.filter((m) => m.id !== id) })),

      // ── Stats ──
      getStats: () => {
        const state = get();
        const activeListings = state.items.filter((i) => i.status === "active").length;
        const resolvedItems = state.items.filter(
          (i) => i.status === "resolved" || i.status === "claimed"
        ).length;
        const registeredUsers = state.users.filter((u) => u.role !== "admin").length;
        return {
          itemsRecovered: resolvedItems > 0 ? resolvedItems : mockStats.itemsRecovered,
          activeListings,
          registeredUsers: registeredUsers > 0 ? registeredUsers : mockStats.registeredUsers,
          successRate:
            state.items.length > 0
              ? Math.round((resolvedItems / state.items.length) * 100)
              : mockStats.successRate,
        };
      },
    }),
    {
      name: "findmy-database",
    }
  )
);
