/**
 * Example Usage of Zustand Messaging System
 * 
 * This file demonstrates various ways to use the messaging system
 * in different parts of the application.
 */

// ============================================================
// Example 1: Using in a Item Details Page
// ============================================================
import { useMessaging } from "@/hooks/useMessaging";
import { currentUser } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export function ItemDetailsMessagingExample() {
    const { handleCreateConversation } = useMessaging(currentUser.id);

    const handleContactSeller = (itemId: string, itemTitle: string, sellerId: string) => {
        // Create or select conversation related to this item
        const newConversation = {
            id: `conv-${Date.now()}`,
            participants: [currentUser, { id: sellerId, name: "Seller", email: "", studentId: "" }],
            itemId,
            item: { title: itemTitle } as any,
            unreadCount: 0,
        };

        handleCreateConversation(newConversation);

        // Navigate to messages page
        window.location.href = "/messages";
    };

    return (
        <Button onClick={() => handleContactSeller("item-1", "iPhone", "user-2")}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Contact Seller
        </Button>
    );
}

// ============================================================
// Example 2: Messaging Widget in Sidebar
// ============================================================
import { useMessageStore } from "@/stores/messageStore";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MessagingWidget() {
    const unreadConversations = useMessageStore((state) => {
        return state.conversations.filter((conv) => conv.unreadCount > 0);
    });
    const totalUnreadCount = useMessageStore((state) => {
        return state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
    });

    return (
        <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Messages</h3>
                {totalUnreadCount > 0 && (
                    <Badge variant="destructive">{totalUnreadCount}</Badge>
                )}
            </div>

            <div className="space-y-2">
                {unreadConversations.slice(0, 5).map((conv) => {
                    const other = conv.participants[0];
                    return (
                        <button
                            key={conv.id}
                            className="w-full p-2 hover:bg-muted rounded flex items-center gap-2 text-sm"
                        >
                            <Avatar className="h-8 w-8">
                                <AvatarFallback>{other?.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 text-left">
                                <p className="text-sm font-medium truncate">{other?.name}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    {conv.lastMessage?.content}
                                </p>
                            </div>
                            {conv.unreadCount > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                    {conv.unreadCount}
                                </Badge>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// Example 3: Unread Badge in Navigation
// ============================================================
import { Link } from "react-router-dom";

export function MessagesBadge() {
    const totalUnreadCount = useMessageStore(
        (state) =>
            state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    );

    return (
        <Link to="/messages" className="relative">
            <MessageCircle className="h-5 w-5" />
            {totalUnreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
                </span>
            )}
        </Link>
    );
}

// ============================================================
// Example 4: Quick Message Send (from anywhere)
// ============================================================
import { useToast } from "@/hooks/use-toast";

export function QuickMessageComponent() {
    const sendMessage = useMessageStore((state) => state.sendMessage);
    const { toast } = useToast();

    const sendQuickMessage = async (conversationId: string, message: string) => {
        try {
            await sendMessage(conversationId, message, currentUser.id);
            toast({
                title: "Message sent",
                description: message,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            });
        }
    };

    return (
        <button
            onClick={() =>
                sendQuickMessage("conv-1", "Hi, are you still interested in this item?")
            }
        >
            Send Quick Message
        </button>
    );
}

// ============================================================
// Example 5: Advanced Search Component
// ============================================================
import { Input } from "@/components/ui/input";

export function AdvancedConversationSearch() {
    const searchQuery = useMessageStore((state) => state.searchQuery);
    const setSearchQuery = useMessageStore((state) => state.setSearchQuery);
    const filteredConversations = useMessageStore((state) =>
        state.getFilteredConversations(currentUser.id)
    );

    return (
        <div className="space-y-4">
            <div className="relative">
                <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <p className="text-sm text-muted-foreground mt-2">
                    Found {filteredConversations.length} conversation(s)
                </p>
            </div>

            <div className="space-y-2">
                {filteredConversations.map((conv) => {
                    const other = conv.participants.find((p) => p.id !== currentUser.id);
                    return (
                        <div
                            key={conv.id}
                            className="p-3 border rounded hover:bg-muted cursor-pointer"
                        >
                            <p className="font-medium">{other?.name}</p>
                            {conv.item && (
                                <p className="text-sm text-muted-foreground">
                                    Re: {conv.item.title}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ============================================================
// Example 6: Message Statistics
// ============================================================
export function MessagingStats() {
    const conversations = useMessageStore((state) => state.conversations);
    const messages = useMessageStore((state) => state.messages);
    const unreadCount = useMessageStore((state) =>
        state.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
    );

    const stats = {
        totalConversations: conversations.length,
        totalMessages: messages.length,
        unreadMessages: unreadCount,
        averageMessagesPerConversation:
            conversations.length > 0
                ? Math.round(messages.length / conversations.length)
                : 0,
        activeConversations: conversations.filter((c) => c.lastMessage).length,
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
            <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
                <p className="text-sm text-muted-foreground">Conversations</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{stats.totalMessages}</p>
                <p className="text-sm text-muted-foreground">Messages</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-red-500">{stats.unreadMessages}</p>
                <p className="text-sm text-muted-foreground">Unread</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">
                    {stats.averageMessagesPerConversation}
                </p>
                <p className="text-sm text-muted-foreground">Avg per Conv</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold">{stats.activeConversations}</p>
                <p className="text-sm text-muted-foreground">Active</p>
            </div>
        </div>
    );
}

// ============================================================
// Example 7: Conversation Manager (Admin/Moderation)
// ============================================================
import { useMessageStore } from "@/stores/messageStore";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export function ConversationManager() {
    const conversations = useMessageStore((state) => state.conversations);
    const deleteConversation = useMessageStore((state) => state.deleteConversation);
    const deleteMessage = useMessageStore((state) => state.deleteMessage);

    const handleDeleteConversation = (convId: string) => {
        if (confirm("Are you sure you want to delete this conversation?")) {
            deleteConversation(convId);
        }
    };

    return (
        <div className="space-y-4">
            {conversations.map((conv) => {
                const messageCount = 0; // Count messages for this conversation
                return (
                    <div
                        key={conv.id}
                        className="p-4 border rounded flex items-center justify-between"
                    >
                        <div>
                            <p className="font-medium">
                                {conv.participants.map((p) => p.name).join(", ")}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {messageCount} messages
                            </p>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteConversation(conv.id)}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}

// ============================================================
// Example 8: Message Notifications
// ============================================================
import { useEffect } from "react";

export function MessageNotificationListener() {
    const messages = useMessageStore((state) => state.messages);
    const { toast } = useToast();

    useEffect(() => {
        // Listen for new messages
        // This would be called when a new message arrives from the server
        if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            // Only notify for messages from others
            if (lastMessage.senderId !== currentUser.id) {
                toast({
                    title: "New message",
                    description: lastMessage.content.substring(0, 50) + "...",
                });
            }
        }
    }, [messages, toast]);

    return null; // This is a listener-only component
}

// ============================================================
// Example 9: Direct Store Usage (Advanced)
// ============================================================
export function DirectStoreUsageExample() {
    // Access store directly for advanced use cases
    const state = useMessageStore();

    const getConversationSummary = (convId: string) => {
        const conv = state.conversations.find((c) => c.id === convId);
        const msgs = state.messages.filter((m) => m.conversationId === convId);

        return {
            participantCount: conv?.participants.length || 0,
            messageCount: msgs.length,
            firstMessage: msgs[0],
            lastMessage: msgs[msgs.length - 1],
            isUnread: (conv?.unreadCount || 0) > 0,
        };
    };

    return (
        <button
            onClick={() => {
                const summary = getConversationSummary("conv-1");
                console.log("Conversation summary:", summary);
            }}
        >
            Log Conversation Summary
        </button>
    );
}

// ============================================================
// Example 10: Testing Helper
// ============================================================
export function TestingHelper() {
    const store = useMessageStore();

    const simulateNewMessage = (conversationId: string, content: string) => {
        const newMessage = {
            id: `msg-${Date.now()}`,
            conversationId,
            senderId: "user-2", // Simulate other user
            content,
            timestamp: new Date().toISOString(),
            status: "delivered" as const,
        };

        store.addMessage(newMessage);
        store.updateConversation(conversationId, {
            lastMessage: newMessage,
            unreadCount: (store.conversations.find((c) => c.id === conversationId)?.unreadCount || 0) + 1,
        });
    };

    return (
        <button
            onClick={() => simulateNewMessage("conv-1", "This is a test message")}
        >
            Simulate New Message
        </button>
    );
}
