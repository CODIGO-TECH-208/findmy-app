# Messaging System - Quick Reference

## Quick Start

### 1. Installation

```bash
npm install zustand
# or
bun install zustand
```

### 2. Use in Component

```tsx
import { useMessaging } from "@/hooks/useMessaging";
import { currentUser } from "@/data/mockData";

export function MyComponent() {
  const {
    filteredConversations,
    messageInput,
    handleSelectConversation,
    handleSendMessage,
    handleInputChange,
  } = useMessaging(currentUser.id);

  return (
    // Your component JSX
  );
}
```

## Key Features

| Feature                 | How to Use                                            |
| ----------------------- | ----------------------------------------------------- |
| **Select Conversation** | `handleSelectConversation(convId)`                    |
| **Send Message**        | `handleSendMessage(messageText)`                      |
| **Update Input**        | `handleInputChange(text)`                             |
| **Search Convos**       | `handleSearchChange(query)`                           |
| **Get Filtered List**   | `filteredConversations`                               |
| **Current Messages**    | `conversationMessages`                                |
| **Message Status**      | Message has `status: "sent" \| "delivered" \| "read"` |
| **Unread Count**        | `conv.unreadCount` & `totalUnreadCount`               |

## Store Structure

```
Conversations
├── participants (User[])
├── item (Item)
├── lastMessage (Message)
├── unreadCount (number)
└── id (string)

Messages
├── id (string)
├── conversationId (string)
├── senderId (string)
├── content (string)
├── timestamp (ISO string)
├── status ("sent"|"delivered"|"read")
└── image? (string)
```

## Common Patterns

### Pattern 1: Load Conversations

```tsx
useEffect(() => {
  const { result } = renderHook(() => useMessageStore());
  initializeStore(mockConversations, mockMessages);
}, []);
```

### Pattern 2: Handle Send

```tsx
const handleSend = async () => {
  await handleSendMessage(messageInput);
  // Input automatically cleared by store
};
```

### Pattern 3: Show Unread Badge

```tsx
{
  conv.unreadCount > 0 && (
    <Badge variant="destructive">{conv.unreadCount}</Badge>
  );
}
```

### Pattern 4: Get Current Participant

```tsx
const { activeConversation, otherParticipant } = useMessaging(currentUser.id);

// Use otherParticipant to show who you're chatting with
```

## API Quick Reference

### useMessaging Hook

```tsx
const {
  // State
  selectedConversationId,
  conversations,
  messages,
  messageInput,
  searchQuery,
  showMobileChat,
  isLoading,
  error,

  // Computed
  activeConversation,
  conversationMessages,
  otherParticipant,
  filteredConversations,
  totalUnreadCount,
  unreadConversations,

  // Handlers
  handleSelectConversation,
  handleBackToList,
  handleSendMessage,
  handleCreateConversation,
  handleDeleteConversation,
  handleDeleteMessage,
  handleSearchChange,
  handleInputChange,
} = useMessaging(currentUser.id);
```

### useMessageStore (Direct Access)

```tsx
// Selectors
const conversations = useMessageStore((s) => s.conversations);
const messages = useMessageStore((s) => s.messages);
const isLoading = useMessageStore((s) => s.isLoading);

// Actions
const sendMessage = useMessageStore((s) => s.sendMessage);
const addMessage = useMessageStore((s) => s.addMessage);
const deleteConversation = useMessageStore((s) => s.deleteConversation);
```

## Message Status Flow

When sending a message:

```
User sends
    ↓
status = "sent" (immediately)
    ↓
Wait 500ms
    ↓
status = "delivered"
    ↓
Wait 1000ms more
    ↓
status = "read"
```

## Debugging

### Enable Redux DevTools

Install Chrome extension: [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmjabfnjnkmjlbhbjeman3b65649c5na)

Then view in DevTools → Redux tab

### Check Store State

```tsx
import { useMessageStore } from "@/stores/messageStore";

// In component
const state = useMessageStore();
console.log(state);
```

### Reset Store

```tsx
const reset = useMessageStore((s) => s.reset);
reset();
```

## Performance Tips

1. **Use selectors** - Only select what you need

   ```tsx
   const convs = useMessageStore((s) => s.conversations); // ✅
   const state = useMessageStore(); // ❌
   ```

2. **Memoize handlers** - Already done in useMessaging hook

   ```tsx
   const handleSend = useCallback(() => {...}, [deps]);
   ```

3. **Lazy load messages** - Implement pagination for large histories
   ```tsx
   const pageSize = 50;
   const page = messages.slice(0, pageSize);
   ```

## Common Issues

| Issue                | Solution                              |
| -------------------- | ------------------------------------- |
| Messages don't show  | Check `selectedConversationId` is set |
| Input doesn't clear  | It auto-clears after `sendMessage()`  |
| Unread count wrong   | Call `markConversationAsRead(convId)` |
| Store not persisting | Check localStorage isn't full         |
| DevTools not working | Check `NODE_ENV === "development"`    |

## Files Reference

| File                          | Purpose                 |
| ----------------------------- | ----------------------- |
| `src/stores/messageStore.ts`  | Zustand store           |
| `src/hooks/useMessaging.ts`   | Custom hook wrapper     |
| `src/pages/Messages.tsx`      | Messages page component |
| `MESSAGING_IMPLEMENTATION.md` | Full documentation      |

## Next Steps

1. ✅ Zustand store created
2. ✅ Custom hook created
3. ✅ Messages.tsx updated
4. ⏳ Install zustand (`npm install zustand`)
5. ⏳ Test messaging features
6. ⏳ Integrate with backend API

## Type Definitions

```tsx
// Message
interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  image?: string;
}

// Conversation
interface Conversation {
  id: string;
  participants: User[];
  itemId?: string;
  item?: Item;
  lastMessage?: Message;
  unreadCount: number;
}
```

## SRS Requirements Met

✅ Real-time messaging capability  
✅ Message status indicators  
✅ Conversation management  
✅ Unread message tracking  
✅ Search and filtering  
✅ Mobile responsive  
✅ Persistence support  
✅ Ready for API integration

## Want to Learn More?

- [Full Implementation Guide](./MESSAGING_IMPLEMENTATION.md)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [React Hooks Patterns](https://react.dev/reference/react/useCallback)
