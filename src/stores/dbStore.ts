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

interface DbState {
  // Data collections
  users: User[];
  items: Item[];
  claims: Claim[];
  conversations: Conversation[];
  messages: Message[];
  stats: typeof mockStats;

  // Current user helper
  currentUserId: string | null;

  // ──── USER CRUD ────
  getUser: (id: string) => User | undefined;
  getUsers: (filter?: Partial<User>) => User[];
  addUser: (user: Omit<User, "id">) => User;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUserId: (id: string | null) => void;

  // ──── ITEM CRUD ────
  getItem: (id: string) => Item | undefined;
  getItems: (filter?: { type?: string; status?: string; category?: string; userId?: string; search?: string }) => Item[];
  addItem: (item: Omit<Item, "id" | "createdAt" | "views">) => Item;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;

  // ──── CLAIM CRUD ────
  getClaim: (id: string) => Claim | undefined;
  getClaims: (filter?: { userId?: string; itemId?: string; status?: string }) => Claim[];
  getClaimsForUserItems: (userId: string) => Claim[];
  addClaim: (claim: Omit<Claim, "id" | "createdAt">) => Claim;
  updateClaim: (id: string, updates: Partial<Claim>) => void;
  deleteClaim: (id: string) => void;

  // ──── CONVERSATION CRUD ────
  getConversation: (id: string) => Conversation | undefined;
  getConversations: () => Conversation[];
  addConversation: (conv: Omit<Conversation, "id">) => Conversation;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  deleteConversation: (id: string) => void;

  // ──── MESSAGE CRUD ────
  getMessage: (id: string) => Message | undefined;
  getMessagesByConversation: (conversationId: string) => Message[];
  addMessage: (msg: Omit<Message, "id" | "timestamp">) => Message;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;

  // ──── STATS ────
  getStats: () => typeof mockStats;
  refreshStats: () => void;

  // ──── RESET ────
  resetToDefaults: () => void;
}

const generateId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const useDbStore = create<DbState>()(
  persist(
    (set, get) => ({
      // Initialize with mock data
      users: [...mockUsers],
      items: [...mockItems],
      claims: [...mockClaims],
      conversations: [...mockConversations],
      messages: [...mockMessages],
      stats: { ...mockStats },
      currentUserId: null,

      // ──── USER CRUD ────
      getUser: (id) => get().users.find((u) => u.id === id),

      getUsers: (filter) => {
        let users = get().users;
        if (filter) {
          if (filter.role) users = users.filter((u) => u.role === filter.role);
          if (filter.isVerified !== undefined) users = users.filter((u) => u.isVerified === filter.isVerified);
        }
        return users;
      },

      addUser: (userData) => {
        const newUser: User = {
          ...userData,
          id: generateId("user"),
        };
        set((state) => ({ users: [...state.users, newUser] }));
        return newUser;
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? { ...u, ...updates } : u)),
        }));
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((u) => u.id !== id),
          items: state.items.filter((i) => i.userId !== id),
          claims: state.claims.filter((c) => c.userId !== id),
        }));
      },

      setCurrentUserId: (id) => set({ currentUserId: id }),

      // ──── ITEM CRUD ────
      getItem: (id) => get().items.find((i) => i.id === id),

      getItems: (filter) => {
        let items = get().items;
        if (filter) {
          if (filter.type) items = items.filter((i) => i.type === filter.type);
          if (filter.status) items = items.filter((i) => i.status === filter.status);
          if (filter.category) items = items.filter((i) => i.category === filter.category);
          if (filter.userId) items = items.filter((i) => i.userId === filter.userId);
          if (filter.search) {
            const q = filter.search.toLowerCase();
            items = items.filter(
              (i) =>
                i.title.toLowerCase().includes(q) ||
                i.description.toLowerCase().includes(q) ||
                i.location.toLowerCase().includes(q)
            );
          }
        }
        return items;
      },

      addItem: (itemData) => {
        const newItem: Item = {
          ...itemData,
          id: generateId("item"),
          createdAt: new Date().toISOString(),
          views: 0,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
        get().refreshStats();
        return newItem;
      },

      updateItem: (id, updates) => {
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
        get().refreshStats();
      },

      deleteItem: (id) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
          claims: state.claims.filter((c) => c.itemId !== id),
        }));
        get().refreshStats();
      },

      // ──── CLAIM CRUD ────
      getClaim: (id) => get().claims.find((c) => c.id === id),

      getClaims: (filter) => {
        let claims = get().claims;
        if (filter) {
          if (filter.userId) claims = claims.filter((c) => c.userId === filter.userId);
          if (filter.itemId) claims = claims.filter((c) => c.itemId === filter.itemId);
          if (filter.status) claims = claims.filter((c) => c.status === filter.status);
        }
        return claims;
      },

      getClaimsForUserItems: (userId) => {
        const state = get();
        const userItemIds = state.items.filter((i) => i.userId === userId).map((i) => i.id);
        return state.claims.filter((c) => userItemIds.includes(c.itemId));
      },

      addClaim: (claimData) => {
        const newClaim: Claim = {
          ...claimData,
          id: generateId("claim"),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ claims: [...state.claims, newClaim] }));
        return newClaim;
      },

      updateClaim: (id, updates) => {
        set((state) => ({
          claims: state.claims.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      deleteClaim: (id) => {
        set((state) => ({
          claims: state.claims.filter((c) => c.id !== id),
        }));
      },

      // ──── CONVERSATION CRUD ────
      getConversation: (id) => get().conversations.find((c) => c.id === id),

      getConversations: () => get().conversations,

      addConversation: (convData) => {
        const newConv: Conversation = {
          ...convData,
          id: generateId("conv"),
        };
        set((state) => ({ conversations: [newConv, ...state.conversations] }));
        return newConv;
      },

      updateConversation: (id, updates) => {
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteConversation: (id) => {
        set((state) => ({
          conversations: state.conversations.filter((c) => c.id !== id),
          messages: state.messages.filter((m) => m.conversationId !== id),
        }));
      },

      // ──── MESSAGE CRUD ────
      getMessage: (id) => get().messages.find((m) => m.id === id),

      getMessagesByConversation: (conversationId) =>
        get().messages.filter((m) => m.conversationId === conversationId),

      addMessage: (msgData) => {
        const newMsg: Message = {
          ...msgData,
          id: generateId("msg"),
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ messages: [...state.messages, newMsg] }));
        return newMsg;
      },

      updateMessage: (id, updates) => {
        set((state) => ({
          messages: state.messages.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      deleteMessage: (id) => {
        set((state) => ({
          messages: state.messages.filter((m) => m.id !== id),
        }));
      },

      // ──── STATS ────
      getStats: () => {
        const state = get();
        return {
          itemsRecovered: state.items.filter((i) => i.status === "resolved").length + mockStats.itemsRecovered,
          activeListings: state.items.filter((i) => i.status === "active").length,
          registeredUsers: state.users.filter((u) => u.role !== "admin").length,
          successRate: mockStats.successRate,
        };
      },

      refreshStats: () => {
        const state = get();
        set({
          stats: {
            itemsRecovered: state.items.filter((i) => i.status === "resolved").length + mockStats.itemsRecovered,
            activeListings: state.items.filter((i) => i.status === "active").length,
            registeredUsers: state.users.filter((u) => u.role !== "admin").length,
            successRate: mockStats.successRate,
          },
        });
      },

      // ──── RESET ────
      resetToDefaults: () => {
        set({
          users: [...mockUsers],
          items: [...mockItems],
          claims: [...mockClaims],
          conversations: [...mockConversations],
          messages: [...mockMessages],
          stats: { ...mockStats },
          currentUserId: null,
        });
      },
    }),
    {
      name: "findmy-db",
    }
  )
);
