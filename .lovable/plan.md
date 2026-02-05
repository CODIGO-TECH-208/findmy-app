

# FindMy - Campus Lost & Found Platform
*A student-friendly web app to help University of Ghana students reunite with their lost belongings*

---

## Design Theme
Using your logo's color palette:
- **Primary Blue** (#4A90D9) - Main actions, navigation, branding
- **Dark Navy** (#2D3748) - Text, accents, secondary elements
- **Light backgrounds** with clean, approachable typography
- **Rounded corners**, friendly icons, and intuitive navigation

---

## Pages & Features

### 1. Landing Page
- Hero section with FindMy logo and tagline: "Lost something? Found something? We'll help you reconnect."
- Quick stats display (items recovered, active listings)
- "Report Lost Item" and "Report Found Item" call-to-action buttons
- Recent items carousel preview
- How it works section (3 simple steps)

### 2. Authentication Pages
- **Login page** with email/password form
- **Registration page** with name, student ID, email, password fields
- Password visibility toggle and validation feedback
- "Forgot password" link (UI only for now)

### 3. Home Dashboard
- Welcome message with user's name
- Quick action cards: Post Lost Item, Post Found Item, My Items, My Claims
- Recent activity feed
- Notification bell with count badge

### 4. Post Item Flow
- **Post Lost Item Form**: Item name, category dropdown (Phones, ID Cards, Bags, Books, etc.), description, date lost, location selector, image upload (up to 5), optional reward checkbox
- **Post Found Item Form**: Similar fields without reward option
- Image preview with remove option
- Form validation with helpful error messages

### 5. Browse & Search Items
- Tab navigation: All Items | Lost | Found
- Search bar with real-time filtering
- Filter sidebar: Category, Date Range, Location
- Sort options: Newest, Category, Location
- Item cards showing: Image thumbnail, title, category badge, status tag, date, location preview
- Pagination controls

### 6. Item Details Page
- Full image gallery with lightbox
- Complete item information
- Poster info (name, verification badge, member since)
- View count and post date
- **For Found Items**: "Claim This Item" button
- **For Own Items**: Edit and Delete options
- Related items section

### 7. Claim System
- **Claim Form Modal**: Why do you believe this is yours? (required), supporting details (optional)
- **My Claims Page**: List of all claims with status badges (Pending, Accepted, Rejected)
- **Claims on My Items** (for finders): View all claims, Accept/Reject actions

### 8. Messaging System
- **Chat List**: All conversations with unread badges
- **Chat View**: 
  - Message bubbles with timestamps
  - Typing indicator animation
  - Read receipts (✓ sent, ✓✓ delivered, blue ✓✓ read)
  - Image attachment support
  - Claim status banner at top
- **Empty state** for new chats with suggested first message

### 9. User Profile
- Profile picture, name, email display
- Edit profile option
- **My Posted Items** tab
- **My Claims** tab
- Notification preferences toggles
- Logout button

### 10. Navigation & Layout
- Responsive sidebar navigation (collapsible on mobile)
- Mobile-friendly bottom navigation for key actions
- Breadcrumb navigation on detail pages
- Toast notifications for actions (item posted, claim submitted, etc.)

---

## Mock Data
The app will include realistic sample data:
- 15-20 sample lost/found items across categories
- Sample user profiles
- Mock chat conversations with various states
- Claim examples in different statuses

---

## What's Included (Frontend MVP)
✅ Complete UI for all user flows  
✅ Responsive design (mobile + desktop)  
✅ Form validation  
✅ Mock data for realistic preview  
✅ State management for navigation  
✅ Animations and transitions  

## What's NOT Included Yet
❌ Real database (Supabase)  
❌ User authentication (real login)  
❌ Real-time messaging (WebSockets)  
❌ Email notifications  
❌ Admin dashboard  

*These can be added in a follow-up phase when you're ready to go live!*

