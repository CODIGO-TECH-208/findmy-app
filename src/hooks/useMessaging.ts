import { useCallback, useMemo } from "react";
import { useMessageStore } from "@/stores/messageStore";
import { Message, Conversation } from "@/data/mockData";

/**
 * Custom hook for messaging functionality
 * Provides convenient methods and selectors for message operations
 */
export const useMessaging = (currentUserId: string) => {
    // Store selectors
    const selectedConversationId = useMessageStore((state) => state.selectedConversationId);
    const conversations = useMessageStore((state) => state.conversations);
    const messages = useMessageStore((state) => state.messages);
    const messageInput = useMessageStore((state) => state.messageInput);
    const searchQuery = useMessageStore((state) => state.searchQuery);
    const showMobileChat = useMessageStore((state) => state.showMobileChat);
    const isLoading = useMessageStore((state) => state.isLoading);
    const error = useMessageStore((state) => state.error);

    // Store actions
    const setSelectedConversation = useMessageStore((state) => state.setSelectedConversation);
    const setMessageInput = useMessageStore((state) => state.setMessageInput);
    const setSearchQuery = useMessageStore((state) => state.setSearchQuery);
    const setShowMobileChat = useMessageStore((state) => state.setShowMobileChat);
    const sendMessage = useMessageStore((state) => state.sendMessage);
    const addMessage = useMessageStore((state) => state.addMessage);
    const updateMessage = useMessageStore((state) => state.updateMessage);
    const deleteMessage = useMessageStore((state) => state.deleteMessage);
    const createConversation = useMessageStore((state) => state.createConversation);
    const deleteConversation = useMessageStore((state) => state.deleteConversation);
    const markConversationAsRead = useMessageStore((state) => state.markConversationAsRead);
    const getFilteredConversations = useMessageStore((state) => state.getFilteredConversations);
    const getConversationMessages = useMessageStore((state) => state.getConversationMessages);

    // Get current active conversation
    const activeConversation = useMemo(() => {
        return conversations.find((c) => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    // Get current conversation messages
    const conversationMessages = useMemo(() => {
        return getConversationMessages(selectedConversationId || "");
    }, [selectedConversationId, messages, getConversationMessages]);

    // Get other participant in current conversation
    const otherParticipant = useMemo(() => {
        return activeConversation?.participants.find((p) => p.id !== currentUserId) || null;
    }, [activeConversation, currentUserId]);

    // Get filtered conversations based on search
    const filteredConversations = useMemo(() => {
        return getFilteredConversations(currentUserId);
    }, [searchQuery, conversations, getFilteredConversations, currentUserId]);

    // Get total unread count
    const totalUnreadCount = useMemo(() => {
        return conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    }, [conversations]);

    // Get unread conversations
    const unreadConversations = useMemo(() => {
        return conversations.filter((conv) => conv.unreadCount > 0);
    }, [conversations]);

    // Handler callbacks
    const handleSelectConversation = useCallback(
        (convId: string) => {
            setSelectedConversation(convId);
            setShowMobileChat(true);
            markConversationAsRead(convId);
        },
        [setSelectedConversation, setShowMobileChat, markConversationAsRead]
    );

    const handleBackToList = useCallback(() => {
        setShowMobileChat(false);
    }, [setShowMobileChat]);

    const handleSendMessage = useCallback(
        async (content: string) => {
            if (!selectedConversationId || !content.trim()) return;
            await sendMessage(selectedConversationId, content, currentUserId);
        },
        [selectedConversationId, sendMessage, currentUserId]
    );

    const handleCreateConversation = useCallback(
        (conversation: Conversation) => {
            createConversation(conversation);
            setSelectedConversation(conversation.id);
        },
        [createConversation, setSelectedConversation]
    );

    const handleDeleteConversation = useCallback(
        (convId: string) => {
            deleteConversation(convId);
        },
        [deleteConversation]
    );

    const handleDeleteMessage = useCallback(
        (messageId: string) => {
            deleteMessage(messageId);
        },
        [deleteMessage]
    );

    const handleSearchChange = useCallback(
        (query: string) => {
            setSearchQuery(query);
        },
        [setSearchQuery]
    );

    const handleInputChange = useCallback(
        (input: string) => {
            setMessageInput(input);
        },
        [setMessageInput]
    );

    return {
        // State
        selectedConversationId,
        conversations,
        messages,
        messageInput,
        searchQuery,
        showMobileChat,
        isLoading,
        error,
        activeConversation,
        conversationMessages,
        otherParticipant,
        filteredConversations,
        totalUnreadCount,
        unreadConversations,

        // Actions
        handleSelectConversation,
        handleBackToList,
        handleSendMessage,
        handleCreateConversation,
        handleDeleteConversation,
        handleDeleteMessage,
        handleSearchChange,
        handleInputChange,

        // Direct store access (for advanced use)
        setMessageInput,
        addMessage,
        updateMessage,
    };
};

export default useMessaging;
