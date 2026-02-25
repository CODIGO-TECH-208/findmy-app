import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Message, Conversation } from "@/data/mockData";

export interface MessageStoreState {
    // State
    conversations: Conversation[];
    messages: Message[];
    selectedConversationId: string | null;
    messageInput: string;
    searchQuery: string;
    showMobileChat: boolean;
    isLoading: boolean;
    error: string | null;
    unreadCounts: Record<string, number>;

    // Actions - Conversation Management
    setSelectedConversation: (conversationId: string | null) => void;
    setSearchQuery: (query: string) => void;
    setShowMobileChat: (show: boolean) => void;
    setConversations: (conversations: Conversation[]) => void;
    createConversation: (conversation: Conversation) => void;
    updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
    deleteConversation: (conversationId: string) => void;
    markConversationAsRead: (conversationId: string) => void;

    // Actions - Message Management
    setMessages: (conversationId: string, messages: Message[]) => void;
    addMessage: (message: Message) => void;
    updateMessage: (messageId: string, updates: Partial<Message>) => void;
    deleteMessage: (messageId: string) => void;
    clearMessages: (conversationId: string) => void;

    // Actions - Input Management
    setMessageInput: (input: string) => void;
    clearMessageInput: () => void;

    // Actions - Message Sending
    sendMessage: (conversationId: string, content: string, senderId: string) => Promise<void>;

    // Actions - Filtering
    getFilteredConversations: (currentUserId: string) => Conversation[];
    getConversationMessages: (conversationId: string) => Message[];

    // Actions - Status Management
    setIsLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;

    // Actions - Batch Operations
    initializeStore: (conversations: Conversation[], messages: Message[]) => void;
    reset: () => void;
}

const initialState = {
    conversations: [],
    messages: [],
    selectedConversationId: null,
    messageInput: "",
    searchQuery: "",
    showMobileChat: false,
    isLoading: false,
    error: null,
    unreadCounts: {},
};

export const useMessageStore = create<MessageStoreState>()(
    devtools(
        persist(
            (set, get) => ({
                ...initialState,

                // Conversation Management
                setSelectedConversation: (conversationId) => {
                    set({ selectedConversationId: conversationId, showMobileChat: !!conversationId });
                },

                setSearchQuery: (query) => {
                    set({ searchQuery: query });
                },

                setShowMobileChat: (show) => {
                    set({ showMobileChat: show });
                },

                setConversations: (conversations) => {
                    set({ conversations });
                },

                createConversation: (conversation) => {
                    set((state) => ({
                        conversations: [conversation, ...state.conversations],
                    }));
                },

                updateConversation: (conversationId, updates) => {
                    set((state) => ({
                        conversations: state.conversations.map((conv) =>
                            conv.id === conversationId ? { ...conv, ...updates } : conv
                        ),
                    }));
                },

                deleteConversation: (conversationId) => {
                    set((state) => ({
                        conversations: state.conversations.filter((conv) => conv.id !== conversationId),
                        selectedConversationId:
                            state.selectedConversationId === conversationId
                                ? state.conversations[0]?.id || null
                                : state.selectedConversationId,
                    }));
                },

                markConversationAsRead: (conversationId) => {
                    set((state) => ({
                        conversations: state.conversations.map((conv) =>
                            conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
                        ),
                        unreadCounts: {
                            ...state.unreadCounts,
                            [conversationId]: 0,
                        },
                    }));
                },

                // Message Management
                setMessages: (conversationId, messages) => {
                    set((state) => {
                        const filteredMessages = state.messages.filter(
                            (msg) => msg.conversationId !== conversationId
                        );
                        return {
                            messages: [...filteredMessages, ...messages],
                        };
                    });
                },

                addMessage: (message) => {
                    set((state) => ({
                        messages: [...state.messages, message],
                    }));
                },

                updateMessage: (messageId, updates) => {
                    set((state) => ({
                        messages: state.messages.map((msg) =>
                            msg.id === messageId ? { ...msg, ...updates } : msg
                        ),
                    }));
                },

                deleteMessage: (messageId) => {
                    set((state) => ({
                        messages: state.messages.filter((msg) => msg.id !== messageId),
                    }));
                },

                clearMessages: (conversationId) => {
                    set((state) => ({
                        messages: state.messages.filter((msg) => msg.conversationId !== conversationId),
                    }));
                },

                // Input Management
                setMessageInput: (input) => {
                    set({ messageInput: input });
                },

                clearMessageInput: () => {
                    set({ messageInput: "" });
                },

                // Message Sending
                sendMessage: async (conversationId, content, senderId) => {
                    if (!content.trim()) return;

                    try {
                        set({ isLoading: true, error: null });

                        // Create new message
                        const newMessage: Message = {
                            id: `msg-${Date.now()}`,
                            conversationId,
                            senderId,
                            content,
                            timestamp: new Date().toISOString(),
                            status: "sent",
                        };

                        // Add message to store
                        get().addMessage(newMessage);

                        // Clear input
                        get().clearMessageInput();

                        // Simulate message delivery progression
                        setTimeout(() => {
                            get().updateMessage(newMessage.id, { status: "delivered" });
                        }, 500);

                        setTimeout(() => {
                            get().updateMessage(newMessage.id, { status: "read" });
                        }, 1500);

                        // Update conversation's last message
                        const conversation = get().conversations.find((c) => c.id === conversationId);
                        if (conversation) {
                            get().updateConversation(conversationId, {
                                lastMessage: newMessage,
                            });
                        }

                        set({ isLoading: false });
                    } catch (error) {
                        set({
                            error: error instanceof Error ? error.message : "Failed to send message",
                            isLoading: false,
                        });
                    }
                },

                // Filtering
                getFilteredConversations: (currentUserId) => {
                    const state = get();
                    return state.conversations.filter((conv) => {
                        const other = conv.participants.find((p) => p.id !== currentUserId);
                        return (
                            other?.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                            conv.item?.title.toLowerCase().includes(state.searchQuery.toLowerCase())
                        );
                    });
                },

                getConversationMessages: (conversationId) => {
                    const state = get();
                    return state.messages.filter((msg) => msg.conversationId === conversationId);
                },

                // Status Management
                setIsLoading: (loading) => {
                    set({ isLoading: loading });
                },

                setError: (error) => {
                    set({ error });
                },

                clearError: () => {
                    set({ error: null });
                },

                // Batch Operations
                initializeStore: (conversations, messages) => {
                    set({
                        conversations,
                        messages,
                        selectedConversationId: conversations[0]?.id || null,
                    });
                },

                reset: () => {
                    set(initialState);
                },
            }),
            {
                name: "message-store",
                partialize: (state) => ({
                    // Only persist essential state
                    selectedConversationId: state.selectedConversationId,
                    searchQuery: state.searchQuery,
                    unreadCounts: state.unreadCounts,
                }),
            }
        ),
        { name: "MessageStore", enabled: process.env.NODE_ENV === "development" }
    )
);
