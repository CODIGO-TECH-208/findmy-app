import { renderHook, act, waitFor } from '@testing-library/react';
import { useMessageStore } from '@/stores/messageStore';
import { useMessaging } from '@/hooks/useMessaging';
import { Conversation, Message } from '@/data/mockData';

describe('Messaging System', () => {
    beforeEach(() => {
        // Reset store before each test
        const { result } = renderHook(() => useMessageStore());
        act(() => result.current.reset());
    });

    describe('useMessageStore', () => {
        it('should initialize with empty state', () => {
            const { result } = renderHook(() => useMessageStore());

            expect(result.current.conversations).toEqual([]);
            expect(result.current.messages).toEqual([]);
            expect(result.current.selectedConversationId).toBeNull();
            expect(result.current.messageInput).toBe('');
        });

        it('should add a conversation', () => {
            const { result } = renderHook(() => useMessageStore());

            const newConversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 0,
            };

            act(() => result.current.createConversation(newConversation));

            expect(result.current.conversations).toHaveLength(1);
            expect(result.current.conversations[0]).toEqual(newConversation);
        });

        it('should set selected conversation', () => {
            const { result } = renderHook(() => useMessageStore());

            act(() => result.current.setSelectedConversation('conv-1'));

            expect(result.current.selectedConversationId).toBe('conv-1');
        });

        it('should add a message', () => {
            const { result } = renderHook(() => useMessageStore());

            const newMessage: Message = {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'user-1',
                content: 'Hello!',
                timestamp: '2025-02-06T10:00:00Z',
                status: 'sent',
            };

            act(() => result.current.addMessage(newMessage));

            expect(result.current.messages).toHaveLength(1);
            expect(result.current.messages[0]).toEqual(newMessage);
        });

        it('should update message status', () => {
            const { result } = renderHook(() => useMessageStore());

            const message: Message = {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'user-1',
                content: 'Hello!',
                timestamp: '2025-02-06T10:00:00Z',
                status: 'sent',
            };

            act(() => result.current.addMessage(message));
            act(() => result.current.updateMessage('msg-1', { status: 'delivered' }));

            expect(result.current.messages[0].status).toBe('delivered');
        });

        it('should delete a message', () => {
            const { result } = renderHook(() => useMessageStore());

            const message: Message = {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'user-1',
                content: 'Hello!',
                timestamp: '2025-02-06T10:00:00Z',
                status: 'sent',
            };

            act(() => result.current.addMessage(message));
            expect(result.current.messages).toHaveLength(1);

            act(() => result.current.deleteMessage('msg-1'));
            expect(result.current.messages).toHaveLength(0);
        });

        it('should update message input', () => {
            const { result } = renderHook(() => useMessageStore());

            act(() => result.current.setMessageInput('Hello world'));

            expect(result.current.messageInput).toBe('Hello world');
        });

        it('should clear message input', () => {
            const { result } = renderHook(() => useMessageStore());

            act(() => result.current.setMessageInput('Hello'));
            act(() => result.current.clearMessageInput());

            expect(result.current.messageInput).toBe('');
        });

        it('should update search query', () => {
            const { result } = renderHook(() => useMessageStore());

            act(() => result.current.setSearchQuery('John'));

            expect(result.current.searchQuery).toBe('John');
        });

        it('should mark conversation as read', () => {
            const { result } = renderHook(() => useMessageStore());

            const conversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 5,
            };

            act(() => result.current.createConversation(conversation));
            act(() => result.current.markConversationAsRead('conv-1'));

            expect(result.current.conversations[0].unreadCount).toBe(0);
        });

        it('should send message with status progression', async () => {
            const { result } = renderHook(() => useMessageStore());

            const conversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 0,
            };

            act(() => result.current.createConversation(conversation));
            act(() => result.current.setSelectedConversation('conv-1'));

            await act(async () => {
                await result.current.sendMessage('conv-1', 'Hello!', 'user-1');
            });

            expect(result.current.messages).toHaveLength(1);
            expect(result.current.messages[0].status).toBe('sent');
            expect(result.current.messageInput).toBe('');

            // Wait for delivery status
            await waitFor(() => {
                expect(result.current.messages[0].status).toBe('delivered');
            }, { timeout: 1000 });

            // Wait for read status
            await waitFor(() => {
                expect(result.current.messages[0].status).toBe('read');
            }, { timeout: 2000 });
        });

        it('should delete conversation', () => {
            const { result } = renderHook(() => useMessageStore());

            const conv1: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 0,
            };
            const conv2: Conversation = {
                id: 'conv-2',
                participants: [],
                unreadCount: 0,
            };

            act(() => {
                result.current.createConversation(conv1);
                result.current.createConversation(conv2);
            });

            expect(result.current.conversations).toHaveLength(2);

            act(() => result.current.deleteConversation('conv-1'));

            expect(result.current.conversations).toHaveLength(1);
            expect(result.current.conversations[0].id).toBe('conv-2');
        });

        it('should get filtered conversations', () => {
            const { result } = renderHook(() => useMessageStore());

            // Mock data would be added here
            // For now, just verify the method exists and works
            const filtered = result.current.getFilteredConversations('user-1');
            expect(Array.isArray(filtered)).toBe(true);
        });

        it('should get conversation messages', () => {
            const { result } = renderHook(() => useMessageStore());

            const msg1: Message = {
                id: 'msg-1',
                conversationId: 'conv-1',
                senderId: 'user-1',
                content: 'Hello',
                timestamp: '2025-02-06T10:00:00Z',
                status: 'sent',
            };
            const msg2: Message = {
                id: 'msg-2',
                conversationId: 'conv-2',
                senderId: 'user-2',
                content: 'Hi',
                timestamp: '2025-02-06T10:01:00Z',
                status: 'sent',
            };

            act(() => {
                result.current.addMessage(msg1);
                result.current.addMessage(msg2);
            });

            const convMessages = result.current.getConversationMessages('conv-1');
            expect(convMessages).toHaveLength(1);
            expect(convMessages[0].id).toBe('msg-1');
        });

        it('should handle error state', () => {
            const { result } = renderHook(() => useMessageStore());

            const error = 'Network error';
            act(() => result.current.setError(error));

            expect(result.current.error).toBe(error);

            act(() => result.current.clearError());

            expect(result.current.error).toBeNull();
        });
    });

    describe('useMessaging Hook', () => {
        it('should return all expected properties', () => {
            const { result } = renderHook(() => useMessaging('user-1'));

            expect(result.current).toHaveProperty('selectedConversationId');
            expect(result.current).toHaveProperty('conversations');
            expect(result.current).toHaveProperty('messages');
            expect(result.current).toHaveProperty('messageInput');
            expect(result.current).toHaveProperty('searchQuery');
            expect(result.current).toHaveProperty('handleSelectConversation');
            expect(result.current).toHaveProperty('handleSendMessage');
        });

        it('should compute active conversation', () => {
            const { result: storeResult } = renderHook(() => useMessageStore());

            const conversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 0,
            };

            act(() => {
                storeResult.current.createConversation(conversation);
                storeResult.current.setSelectedConversation('conv-1');
            });

            const { result: hookResult } = renderHook(() => useMessaging('user-1'));

            expect(hookResult.current.activeConversation?.id).toBe('conv-1');
        });

        it('should compute total unread count', () => {
            const { result: storeResult } = renderHook(() => useMessageStore());

            const conv1: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 3,
            };
            const conv2: Conversation = {
                id: 'conv-2',
                participants: [],
                unreadCount: 2,
            };

            act(() => {
                storeResult.current.createConversation(conv1);
                storeResult.current.createConversation(conv2);
            });

            const { result: hookResult } = renderHook(() => useMessaging('user-1'));

            expect(hookResult.current.totalUnreadCount).toBe(5);
        });

        it('should handle select conversation', () => {
            const { result: storeResult } = renderHook(() => useMessageStore());
            const { result: hookResult } = renderHook(() => useMessaging('user-1'));

            const conversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 1,
            };

            act(() => storeResult.current.createConversation(conversation));
            act(() => hookResult.current.handleSelectConversation('conv-1'));

            expect(hookResult.current.selectedConversationId).toBe('conv-1');
        });

        it('should handle back to list', () => {
            const { result } = renderHook(() => useMessaging('user-1'));

            // Initially showMobileChat might be false
            act(() => result.current.handleBackToList());

            // Verify it was called without error
            expect(result.current).toBeDefined();
        });
    });

    describe('Message Status Flow', () => {
        it('should progress message status: sent -> delivered -> read', async () => {
            const { result } = renderHook(() => useMessageStore());

            const conversation: Conversation = {
                id: 'conv-1',
                participants: [],
                unreadCount: 0,
            };

            act(() => {
                result.current.createConversation(conversation);
                result.current.setSelectedConversation('conv-1');
            });

            await act(async () => {
                await result.current.sendMessage('conv-1', 'Test message', 'user-1');
            });

            const initialStatus = result.current.messages[0].status;
            expect(initialStatus).toBe('sent');

            // Wait for delivered
            await waitFor(
                () => {
                    expect(result.current.messages[0].status).toBe('delivered');
                },
                { timeout: 1000 }
            );

            // Wait for read
            await waitFor(
                () => {
                    expect(result.current.messages[0].status).toBe('read');
                },
                { timeout: 2000 }
            );
        });
    });
});
