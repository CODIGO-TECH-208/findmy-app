# Admin Portal Navigation Map

```
FindMy Admin Portal
│
├── 🏠 Dashboard (/admin/dashboard)
│   ├── Platform Statistics
│   │   ├── Total Users
│   │   ├── Total Items
│   │   ├── Total Claims
│   │   └── Resolved Items
│   ├── Recent Activity
│   │   ├── Recent Items (Last 5)
│   │   └── Recent Claims (Last 5)
│   └── Platform Health
│       ├── Resolution Rate
│       └── Active Items
│
├── 👥 Users (/admin/users)
│   ├── Search Users
│   ├── User List
│   └── Actions
│       ├── Verify/Unverify
│       └── Delete User
│
├── 📦 Items (/admin/items)
│   ├── Filter Options
│   │   ├── By Type (Lost/Found)
│   │   └── By Status (Active/Claimed/Resolved)
│   ├── Search Items
│   ├── Items List
│   └── Actions
│       ├── Change Status
│       ├── View Details
│       └── Delete Item
│
├── 📋 Claims (/admin/claims)
│   ├── Filter by Status
│   │   ├── Pending
│   │   ├── Accepted
│   │   └── Rejected
│   ├── Search Claims
│   ├── Claims List
│   └── Actions
│       ├── View Details
│       ├── Accept Claim
│       └── Reject Claim
│
└── 📊 Reports (/admin/reports)
    ├── Overview Statistics
    ├── Charts & Analytics
    │   ├── Items by Category
    │   ├── Items by Status
    │   ├── Lost vs Found
    │   ├── Claims Statistics
    │   └── User Growth Trend
    └── Platform Metrics
```

## Component Hierarchy

```
App
└── AdminRoute (Protection Layer)
    └── AdminLayout
        ├── Sidebar Navigation
        │   ├── Dashboard
        │   ├── Users
        │   ├── Items
        │   ├── Claims
        │   ├── Reports
        │   └── Logout
        │
        └── Main Content Area
            └── [Admin Page Component]
                ├── AdminDashboard
                ├── AdminUsers
                ├── AdminItems
                ├── AdminClaims
                └── AdminReports
```

## User Flow Diagram

```
Start
  │
  ├─→ Not Logged In
  │   └─→ Redirect to /login
  │       └─→ Enter admin credentials
  │           ├─→ Success → Admin Dashboard
  │           └─→ Fail → Stay on login
  │
  └─→ Logged In
      ├─→ Is Admin?
      │   ├─→ Yes → Access Admin Portal
      │   │   ├─→ View Dashboard
      │   │   ├─→ Manage Users
      │   │   ├─→ Manage Items
      │   │   ├─→ Review Claims
      │   │   └─→ View Reports
      │   │
      │   └─→ No → Redirect to /dashboard
      │       └─→ Regular User Features
      │
      └─→ Logout
          └─→ Return to Landing Page
```

## Data Flow

```
User Action
    ↓
Component State Update
    ↓
UI Re-renders
    ↓
Toast Notification (Success/Error)
    ↓
[In Production]
    ↓
API Call to Backend
    ↓
Database Update
    ↓
Response to Frontend
```

## Admin Actions Map

### User Management Actions

```
User
├─→ Verify → Toggle isVerified flag → Update badge → Toast notification
├─→ Unverify → Toggle isVerified flag → Update badge → Toast notification
└─→ Delete → Confirmation dialog → Remove from list → Toast notification
```

### Item Management Actions

```
Item
├─→ Change Status → Select dropdown → Update status → Toast notification
├─→ View Details → Navigate to /item/:id page
└─→ Delete → Confirmation dialog → Remove from list → Toast notification
```

### Claims Management Actions

```
Claim
├─→ View Details → Open dialog → Show full information
├─→ Accept → Update status to "accepted" → Close dialog → Toast notification
└─→ Reject → Update status to "rejected" → Close dialog → Toast notification
```

## Screen Layouts

### Desktop Layout (≥768px)

```
┌─────────────────────────────────────────┐
│  Sidebar (Fixed)  │  Main Content       │
│                   │                     │
│  - Dashboard      │  [Page Content]     │
│  - Users          │                     │
│  - Items          │  • Statistics       │
│  - Claims         │  • Tables           │
│  - Reports        │  • Charts           │
│                   │  • Filters          │
│  [Logout]         │  • Actions          │
└─────────────────────────────────────────┘
```

### Mobile Layout (<768px)

```
┌─────────────────────┐
│  Header             │
│  [☰ Menu] [Title]   │
├─────────────────────┤
│  Main Content       │
│                     │
│  [Page Content]     │
│  Stacked Layout     │
│                     │
└─────────────────────┘
```

## Key Features by Page

### Dashboard

- 4 Statistics Cards
- 2 Activity Lists
- 2 Health Metrics

### Users

- Search Bar
- Data Table (5 columns)
- 2 Action Buttons per User

### Items

- 3 Filter Controls
- Data Table (7 columns)
- 3 Action Buttons per Item

### Claims

- 2 Filter Controls
- Data Table (6 columns)
- Up to 3 Action Buttons per Claim
- Detail Dialog

### Reports

- 4 Overview Cards
- 5 Analytics Charts
- 1 Growth Trend Visualization

## Integration Points

```
Admin Portal ←→ Main App
    ↓
Shared Components:
- AuthContext (Authentication)
- UI Components (shadcn/ui)
- Mock Data (mockData.ts)
- Router (React Router)
    ↓
Navigation:
- User Menu → "Admin Portal" Link
- Direct URL Access
- Route Protection (AdminRoute)
```

---

This navigation map provides a complete overview of the admin portal structure, flow, and features.
