// Mock data for FindMy Campus Lost & Found Platform

export interface User {
  id: string;
  name: string;
  email: string;
  studentId: string;
  avatar?: string;
  memberSince: string;
  isVerified: boolean;
  role?: "user" | "admin";
}

export interface Item {
  id: string;
  title: string;
  description: string;
  category: ItemCategory;
  type: "lost" | "found";
  status: "active" | "claimed" | "resolved";
  images: string[];
  location: string;
  date: string;
  createdAt: string;
  userId: string;
  user: User;
  reward?: boolean;
  views: number;
}

export interface Claim {
  id: string;
  itemId: string;
  item: Item;
  userId: string;
  user: User;
  reason: string;
  details?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  image?: string;
}

export interface Conversation {
  id: string;
  participants: User[];
  itemId?: string;
  item?: Item;
  lastMessage?: Message;
  unreadCount: number;
}

export type ItemCategory =
  | "phones"
  | "id-cards"
  | "bags"
  | "books"
  | "electronics"
  | "clothing"
  | "accessories"
  | "keys"
  | "documents"
  | "other";

export const CATEGORIES: { value: ItemCategory; label: string; icon: string }[] = [
  { value: "phones", label: "Phones", icon: "📱" },
  { value: "id-cards", label: "ID Cards", icon: "🪪" },
  { value: "bags", label: "Bags", icon: "🎒" },
  { value: "books", label: "Books", icon: "📚" },
  { value: "electronics", label: "Electronics", icon: "💻" },
  { value: "clothing", label: "Clothing", icon: "👕" },
  { value: "accessories", label: "Accessories", icon: "⌚" },
  { value: "keys", label: "Keys", icon: "🔑" },
  { value: "documents", label: "Documents", icon: "📄" },
  { value: "other", label: "Other", icon: "📦" },
];

export const LOCATIONS = [
  "Balme Library",
  "Great Hall",
  "JQB Building",
  "N Block",
  "UGCS",
  "Night Market",
  "Akuafo Hall",
  "Commonwealth Hall",
  "Legon Hall",
  "Mensah Sarbah Hall",
  "Pentagon Hall",
  "Volta Hall",
  "Sports Complex",
  "Main Gate",
  "Science Block",
  "Business School",
];

// Mock Users
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Kwame Asante",
    email: "kwame.asante@st.ug.edu.gh",
    studentId: "10894521",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    memberSince: "2024-01-15",
    isVerified: true,
    role: "user",
  },
  {
    id: "user-2",
    name: "Ama Serwaa",
    email: "ama.serwaa@st.ug.edu.gh",
    studentId: "10894522",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    memberSince: "2024-02-20",
    isVerified: true,
    role: "user",
  },
  {
    id: "user-3",
    name: "Kofi Mensah",
    email: "kofi.mensah@st.ug.edu.gh",
    studentId: "10894523",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    memberSince: "2024-03-10",
    isVerified: false,
    role: "user",
  },
  {
    id: "user-4",
    name: "Abena Osei",
    email: "abena.osei@st.ug.edu.gh",
    studentId: "10894524",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    memberSince: "2024-01-25",
    isVerified: true,
    role: "user",
  },
  {
    id: "admin-1",
    name: "Admin User",
    email: "admin@ug.edu.gh",
    studentId: "ADMIN001",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    memberSince: "2023-01-01",
    isVerified: true,
    role: "admin",
  },
];

export const currentUser = mockUsers[0];

// Mock Items
export const mockItems: Item[] = [
  {
    id: "item-1",
    title: "iPhone 14 Pro - Black",
    description: "Lost my iPhone 14 Pro near the Balme Library. It has a black case with a cracked screen protector. Lock screen shows a picture of mountains.",
    category: "phones",
    type: "lost",
    status: "active",
    images: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400"],
    location: "Balme Library",
    date: "2025-02-01",
    createdAt: "2025-02-01T10:30:00Z",
    userId: "user-1",
    user: mockUsers[0],
    reward: true,
    views: 156,
  },
  {
    id: "item-2",
    title: "University Student ID Card",
    description: "Found a student ID card belonging to a Level 300 Business student. Card was found near the Night Market.",
    category: "id-cards",
    type: "found",
    status: "active",
    images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"],
    location: "Night Market",
    date: "2025-02-02",
    createdAt: "2025-02-02T14:15:00Z",
    userId: "user-2",
    user: mockUsers[1],
    views: 89,
  },
  {
    id: "item-3",
    title: "Black Jansport Backpack",
    description: "Lost my black Jansport backpack containing my laptop charger and some notebooks. Last seen at JQB.",
    category: "bags",
    type: "lost",
    status: "active",
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400"],
    location: "JQB Building",
    date: "2025-02-03",
    createdAt: "2025-02-03T09:45:00Z",
    userId: "user-3",
    user: mockUsers[2],
    views: 234,
  },
  {
    id: "item-4",
    title: "MacBook Air M2 Charger",
    description: "Found a MacBook charger in N Block lecture hall 101. White 35W charger.",
    category: "electronics",
    type: "found",
    status: "active",
    images: ["https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"],
    location: "N Block",
    date: "2025-02-03",
    createdAt: "2025-02-03T16:20:00Z",
    userId: "user-4",
    user: mockUsers[3],
    views: 67,
  },
  {
    id: "item-5",
    title: "Keys with Red Keychain",
    description: "Found a set of keys with a distinctive red keychain near the Great Hall. Has about 4 keys including what looks like a car key.",
    category: "keys",
    type: "found",
    status: "active",
    images: ["https://images.unsplash.com/photo-1582139329536-e7284fece509?w=400"],
    location: "Great Hall",
    date: "2025-02-02",
    createdAt: "2025-02-02T11:00:00Z",
    userId: "user-2",
    user: mockUsers[1],
    views: 145,
  },
  {
    id: "item-6",
    title: "Introduction to Economics Textbook",
    description: "Lost my Economics textbook somewhere around the Business School. It has my name written inside the cover.",
    category: "books",
    type: "lost",
    status: "claimed",
    images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400"],
    location: "Business School",
    date: "2025-01-28",
    createdAt: "2025-01-28T13:30:00Z",
    userId: "user-1",
    user: mockUsers[0],
    views: 78,
  },
  {
    id: "item-7",
    title: "Silver Watch - Casio",
    description: "Found a silver Casio watch on the bench near the Sports Complex. Still working.",
    category: "accessories",
    type: "found",
    status: "active",
    images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"],
    location: "Sports Complex",
    date: "2025-02-04",
    createdAt: "2025-02-04T08:15:00Z",
    userId: "user-3",
    user: mockUsers[2],
    views: 112,
  },
  {
    id: "item-8",
    title: "Blue Hoodie - Size L",
    description: "Left my blue hoodie in Commonwealth Hall common room. It has a small tear on the left sleeve.",
    category: "clothing",
    type: "lost",
    status: "active",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400"],
    location: "Commonwealth Hall",
    date: "2025-02-01",
    createdAt: "2025-02-01T19:45:00Z",
    userId: "user-4",
    user: mockUsers[3],
    reward: false,
    views: 45,
  },
  {
    id: "item-9",
    title: "Samsung Galaxy Earbuds",
    description: "Lost my Samsung Galaxy Buds case (white) somewhere between Akuafo Hall and N Block. Only the case, buds might be inside.",
    category: "electronics",
    type: "lost",
    status: "active",
    images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400"],
    location: "Akuafo Hall",
    date: "2025-02-03",
    createdAt: "2025-02-03T07:30:00Z",
    userId: "user-2",
    user: mockUsers[1],
    reward: true,
    views: 198,
  },
  {
    id: "item-10",
    title: "Passport Document",
    description: "Found a Ghanaian passport near the Main Gate. Please contact if this is yours with verification.",
    category: "documents",
    type: "found",
    status: "active",
    images: ["https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400"],
    location: "Main Gate",
    date: "2025-02-04",
    createdAt: "2025-02-04T15:00:00Z",
    userId: "user-1",
    user: mockUsers[0],
    views: 324,
  },
];

// Mock Claims
export const mockClaims: Claim[] = [
  {
    id: "claim-1",
    itemId: "item-6",
    item: mockItems[5],
    userId: "user-3",
    user: mockUsers[2],
    reason: "This is my textbook! I can verify by the notes I made on page 45 about supply and demand.",
    details: "I also wrote my name 'Kofi M.' on the inside cover in blue pen.",
    status: "pending",
    createdAt: "2025-01-29T10:00:00Z",
  },
  {
    id: "claim-2",
    itemId: "item-5",
    item: mockItems[4],
    userId: "user-1",
    user: mockUsers[0],
    reason: "Those are my keys! The red keychain is a gift from my mom.",
    details: "One of the keys is for a Toyota Corolla 2019.",
    status: "accepted",
    createdAt: "2025-02-02T14:30:00Z",
  },
  {
    id: "claim-3",
    itemId: "item-2",
    item: mockItems[1],
    userId: "user-4",
    user: mockUsers[3],
    reason: "I believe this is my student ID. I'm a Level 300 Business student.",
    status: "rejected",
    createdAt: "2025-02-02T16:00:00Z",
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    participants: [mockUsers[0], mockUsers[1]],
    itemId: "item-2",
    item: mockItems[1],
    lastMessage: {
      id: "msg-3",
      conversationId: "conv-1",
      senderId: "user-2",
      content: "Yes, come to Volta Hall reception at 4pm!",
      timestamp: "2025-02-02T15:30:00Z",
      status: "read",
    },
    unreadCount: 0,
  },
  {
    id: "conv-2",
    participants: [mockUsers[0], mockUsers[2]],
    itemId: "item-3",
    item: mockItems[2],
    lastMessage: {
      id: "msg-5",
      conversationId: "conv-2",
      senderId: "user-3",
      content: "Have you seen my backpack by any chance?",
      timestamp: "2025-02-03T10:15:00Z",
      status: "delivered",
    },
    unreadCount: 1,
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "msg-1",
    conversationId: "conv-1",
    senderId: "user-1",
    content: "Hi! I think the ID card you found might be mine.",
    timestamp: "2025-02-02T14:45:00Z",
    status: "read",
  },
  {
    id: "msg-2",
    conversationId: "conv-1",
    senderId: "user-1",
    content: "Can we meet to verify?",
    timestamp: "2025-02-02T14:46:00Z",
    status: "read",
  },
  {
    id: "msg-3",
    conversationId: "conv-1",
    senderId: "user-2",
    content: "Yes, come to Volta Hall reception at 4pm!",
    timestamp: "2025-02-02T15:30:00Z",
    status: "read",
  },
  {
    id: "msg-4",
    conversationId: "conv-2",
    senderId: "user-1",
    content: "Hi Kofi, saw your post about the lost backpack.",
    timestamp: "2025-02-03T10:00:00Z",
    status: "read",
  },
  {
    id: "msg-5",
    conversationId: "conv-2",
    senderId: "user-3",
    content: "Have you seen my backpack by any chance?",
    timestamp: "2025-02-03T10:15:00Z",
    status: "delivered",
  },
];

// Stats for landing page
export const mockStats = {
  itemsRecovered: 1247,
  activeListings: mockItems.filter((i) => i.status === "active").length,
  registeredUsers: 3542,
  successRate: 78,
};
