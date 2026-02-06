# Messaging System Implementation

## Overview

The FindMy messaging system uses **Zustand** for centralized state management. This provides:

- **Reactive state management** for conversations and messages
- **Persistence** of selected conversation and search preferences
- **DevTools integration** for debugging
- **Type-safe actions** for all messaging operations
- **Scalable architecture** for future API integration

## Architecture

### State Management

```
┌─────────────────────────────────┐
│     useMessageStore             │
│   (Zustand + Persist)           │
├─────────────────────────────────┤
│ State:                          │
│ • conversations[]               │
│ • messages[]                    │
│ • selectedConversationId        │
│ • messageInput                  │
│ • searchQuery                   │
│ • showMobileChat                │
│ • isLoading, error              │
├─────────────────────────────────┤
│ Actions:                        │
│ • Conversation Management       │
│ • Message Operations            │
│ • Input Management              │
│ • Message Sending               │
│ • Filtering & Batching          │
└─────────────────────────────────┘
           ↓
┌──────────────────────────────────┐
│    useMessaging Hook             │
│  (Convenience wrapper)           │
├──────────────────────────────────┤
│ Computed values:                │
│ • activeConversation            │
│ • conversationMessages          │
│ • otherParticipant              │
│ • filteredConversations         │
│ • totalUnreadCount              │
│                                 │
│ Wrapped handlers:               │
│ • handleSelectConversation      │
│ • handleSendMessage             │
│ • handleCreateConversation      │
└──────────────────────────────────┘
           ↓
      Messages.tsx
      (React Component)
```

## Installation

### 1. Install Zustand

```bash
npm install zustand
```

Or with bun:

```bash
bun install zustand
```

## Usage Guide

### Basic Usage in Components

```tsx
import { useMessaging } from "@/hooks/useMessaging";
import { currentUser } from "@/data/mockData";

export function ChatComponent() {
  const {
    selectedConversationId,
    messageInput,
    filteredConversations,
    handleSelectConversation,
    handleSendMessage,
    handleInputChange,
  } = useMessaging(currentUser.id);

  return (
    <div>
      {/* Conversation list */}
      {filteredConversations.map((conv) => (
        <button
          key={conv.id}
          onClick={() => handleSelectConversation(conv.id)}
          className={selectedConversationId === conv.id ? "active" : ""}
        >
          {/* Conversation item */}
        </button>
      ))}

      {/* Message input */}
      <input
        value={messageInput}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage(messageInput);
          }
        }}
      />
    </div>
  );
}
```

### Direct Store Access

For advanced use cases, access the store directly:

```tsx
import { useMessageStore } from "@/stores/messageStore";

export function AdvancedComponent() {
  // Select specific state
  const conversations = useMessageStore((state) => state.conversations);
  const isLoading = useMessageStore((state) => state.isLoading);

  // Call actions directly
  const sendMessage = useMessageStore((state) => state.sendMessage);
  const deleteConversation = useMessageStore((state) => state.deleteConversation);

  return (
    // Component logic
  );
}
```

## Store API Reference

### State

#### Conversation State

```typescript
conversations: Conversation[]     // All conversations
selectedConversationId: string | null  // Currently selected
unreadCounts: Record<string, number>   // Unread per conversation
```

#### Message State

```typescript
messages: Message[]       // All messages
messageInput: string      // Current input text
```

#### UI State

```typescript
searchQuery: string; // Search term
showMobileChat: boolean; // Mobile chat visibility
isLoading: boolean; // Loading state
error: string | null; // Error message
```

### Actions

#### Conversation Management

```typescript
// Set selected conversation and show chat on mobile
setSelectedConversation(conversationId: string | null): void

// Create new conversation
createConversation(conversation: Conversation): void

// Update conversation (last message, unread count, etc)
updateConversation(id: string, updates: Partial<Conversation>): void

// Delete conversation
deleteConversation(id: string): void

// Mark all messages as read
markConversationAsRead(conversationId: string): void
```

#### Message Operations

```typescript
// Load messages for conversation
setMessages(conversationId: string, messages: Message[]): void

// Add single message
addMessage(message: Message): void

// Update message (e.g., delivery status)
updateMessage(messageId: string, updates: Partial<Message>): void

// Delete message
deleteMessage(messageId: string): void

// Clear all messages in conversation
clearMessages(conversationId: string): void
```

#### Message Sending

```typescript
// Send message (handles status progression)
sendMessage(
  conversationId: string,
  content: string,
  senderId: string
): Promise<void>
```

**Flow:**

1. Create message with status "sent"
2. Clear input
3. After 500ms: status → "delivered"
4. After 1500ms: status → "read"

#### Input Management

```typescript
setMessageInput(input: string): void    // Update input
clearMessageInput(): void                // Clear input
```

#### Search & Filtering

```typescript
setSearchQuery(query: string): void

// Get filtered conversations
getFilteredConversations(currentUserId: string): Conversation[]

// Get messages for conversation
getConversationMessages(conversationId: string): Message[]
```

#### Status Management

```typescript
setIsLoading(loading: boolean): void
setError(error: string | null): void
clearError(): void
```

#### Batch Operations

```typescript
// Initialize with mock/API data
initializeStore(
  conversations: Conversation[],
  messages: Message[]
): void

// Reset to initial state
reset(): void
```

## useMessaging Hook API

Convenience hook that wraps the store with computed values and handlers.

### State Properties

```typescript
// Direct from store
selectedConversationId: string | null
conversations: Conversation[]
messages: Message[]
messageInput: string
searchQuery: string
showMobileChat: boolean
isLoading: boolean
error: string | null

// Computed values
activeConversation: Conversation | null
conversationMessages: Message[]
otherParticipant: User | null
filteredConversations: Conversation[]
totalUnreadCount: number
unreadConversations: Conversation[]
```

### Handlers

```typescript
// Select conversation and mark as read
handleSelectConversation(convId: string): void

// Hide mobile chat
handleBackToList(): void

// Send message and clear input
handleSendMessage(content: string): Promise<void>

// Create and select conversation
handleCreateConversation(conversation: Conversation): void

// Delete conversation
handleDeleteConversation(convId: string): void

// Delete message
handleDeleteMessage(messageId: string): void

// Update search
handleSearchChange(query: string): void

// Update input
handleInputChange(input: string): void
```

## Data Structures

### Message

```typescript
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string; // ISO 8601
  status: "sent" | "delivered" | "read";
  image?: string; // Optional image attachment
}
```

### Conversation

```typescript
interface Conversation {
  id: string;
  participants: User[];
  itemId?: string; // Related item
  item?: Item;
  lastMessage?: Message;
  unreadCount: number;
}
```

## Features

### ✅ Implemented

- [x] Zustand store with persistence
- [x] All CRUD operations for conversations and messages
- [x] Message status tracking (sent → delivered → read)
- [x] Search and filtering
- [x] Unread count tracking
- [x] Mobile/desktop toggle
- [x] Automatic input clearing after send
- [x] Custom useMessaging hook
- [x] DevTools integration for debugging
- [x] Type safety with TypeScript

### 🔄 Ready for Backend Integration

The store is designed to easily integrate with a real backend:

```typescript
// Example: Replace mock data with API call
const sendMessage = async (conversationId, content, senderId) => {
  try {
    set({ isLoading: true });

    // Call your API
    const response = await fetch("/api/messages", {
      method: "POST",
      body: JSON.stringify({ conversationId, content, senderId }),
    });

    const newMessage = await response.json();
    get().addMessage(newMessage);
    get().clearMessageInput();

    set({ isLoading: false });
  } catch (error) {
    set({ error: error.message, isLoading: false });
  }
};
```

### 🚀 Future Enhancements

- [ ] Real-time messaging via WebSockets
- [ ] Message typing indicators
- [ ] Typing animation
- [ ] Message reactions/emojis
- [ ] Image/file attachment support
- [ ] Message editing
- [ ] Message deletion with timestamps
- [ ] Group conversations
- [ ] User presence/online status
- [ ] Read receipts with timestamps
- [ ] Voice/video call integration
- [ ] Message search across conversations
- [ ] Conversation archiving
- [ ] Message pinning
- [ ] Auto-save drafts

## Persistence

The store automatically persists:

```typescript
{
  selectedConversationId: string | null,
  searchQuery: string,
  unreadCounts: Record<string, number>
}
```

This uses localStorage under the key `message-store`.

To clear persisted data:

```typescript
localStorage.removeItem("message-store");
```

## DevTools Integration

When `NODE_ENV === "development"`, Redux DevTools can monitor the store:

1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmjabfnjnkmjlbhbjeman3b65649c5na)
2. Open DevTools to see state changes and actions

## Performance Considerations

### Selector Optimization

Use specific selectors to prevent unnecessary re-renders:

```tsx
// ❌ Bad: Re-renders on every state change
const store = useMessageStore();

// ✅ Good: Only re-renders if this specific slice changes
const conversations = useMessageStore((state) => state.conversations);
```

### Computed Values

The `useMessaging` hook uses `useMemo` for expensive computations:

```typescript
const filteredConversations = useMemo(() => {
  return getFilteredConversations(currentUserId);
}, [searchQuery, conversations, ...dependencies]);
```

### Message Loading

For large message histories, implement pagination:

```typescript
const [page, setPage] = useState(0);
const pageSize = 50;
const paginatedMessages = conversationMessages.slice(
  page * pageSize,
  (page + 1) * pageSize,
);
```

## Testing

### Unit Tests Example

```typescript
import { renderHook, act } from "@testing-library/react";
import { useMessageStore } from "@/stores/messageStore";

describe("useMessageStore", () => {
  beforeEach(() => {
    const { result } = renderHook(() => useMessageStore());
    act(() => result.current.reset());
  });

  it("should add message", () => {
    const { result } = renderHook(() => useMessageStore());
    const message = {
      id: "msg-1",
      conversationId: "conv-1",
      senderId: "user-1",
      content: "Hello",
      timestamp: "2025-02-06T10:00:00Z",
      status: "sent",
    };

    act(() => result.current.addMessage(message));

    expect(result.current.messages).toContain(message);
  });
});
```

## Troubleshooting

### Messages not appearing?

1. Check `selectedConversationId` is set
2. Verify `initializeStore` was called with mock data
3. Use Redux DevTools to inspect store state

### Unread count not updating?

Ensure `markConversationAsRead` is called when conversation is selected:

```typescript
useEffect(() => {
  if (selectedConversation) {
    markConversationAsRead(selectedConversation);
  }
}, [selectedConversation, markConversationAsRead]);
```

### Input not clearing after send?

The store automatically calls `clearMessageInput()` in `sendMessage()` action.

### LocalStorage errors?

Check browser localStorage quota:

```typescript
// Clear old data if needed
localStorage.removeItem("message-store");
```

## Migration from useState

### Before (useState)

```typescript
const [selectedConversation, setSelectedConversation] = useState<string | null>(
  null,
);
const [messageInput, setMessageInput] = useState("");
const [searchQuery, setSearchQuery] = useState("");
```

### After (Zustand)

```typescript
const selectedConversation = useMessageStore(
  (state) => state.selectedConversationId,
);
const setSelectedConversation = useMessageStore(
  (state) => state.setSelectedConversation,
);
// ... other selectors
```

Or use the custom hook for cleaner code:

```typescript
const {
  selectedConversationId,
  messageInput,
  searchQuery,
  handleSelectConversation,
  handleInputChange,
  handleSearchChange,
} = useMessaging(currentUser.id);
```

## SRS Compliance

This implementation fulfills the Messaging System requirements from the SRS:

✅ **Real-time messaging** - Ready for WebSocket integration
✅ **Message status tracking** - sent → delivered → read
✅ **Conversation management** - Create, list, search, delete
✅ **Unread badges** - Tracked per conversation
✅ **Mobile responsive** - Mobile/desktop toggle
✅ **User search** - Filter conversations by participant or item
✅ **Message persistence** - Uses Zustand persist middleware
✅ **Scalable architecture** - Ready for backend API integration

## Files

- `src/stores/messageStore.ts` - Zustand store definition
- `src/hooks/useMessaging.ts` - Custom React hook
- `src/pages/Messages.tsx` - Updated Messages page using store

## Support

For issues or questions, refer to:

- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- Project SRS document (Messaging section)
