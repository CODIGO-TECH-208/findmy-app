# FindMy Admin Portal

## Overview

The Admin Portal is a comprehensive management interface for the FindMy Lost & Found platform. It provides administrators with tools to manage users, items, claims, and view analytics.

## Features

### 1. Dashboard (`/admin/dashboard`)

- **Overview Statistics**: Total users, items, claims, and resolved items
- **Recent Activity**: Latest items posted and claims submitted
- **Platform Health**: Visual metrics showing resolution rates and active items
- **Quick Insights**: At-a-glance view of platform performance

### 2. User Management (`/admin/users`)

- **User List**: View all registered users with search functionality
- **User Verification**: Verify/unverify user accounts
- **User Deletion**: Remove users from the platform
- **Search & Filter**: Find users by name, email, or student ID
- **User Details**: View avatar, email, student ID, and verification status

### 3. Items Management (`/admin/items`)

- **Item List**: View all lost and found items
- **Status Management**: Change item status (active, claimed, resolved)
- **Filter Options**: Filter by type (lost/found) and status
- **Search**: Search items by title, description, or location
- **Item Details**: View item images, category, location, and posted user
- **Item Deletion**: Remove inappropriate or spam items

### 4. Claims Management (`/admin/claims`)

- **Claims Review**: View all claims submitted by users
- **Claim Approval**: Accept or reject claims
- **Filter by Status**: View pending, accepted, or rejected claims
- **Detailed View**: Review claim reasons and additional details
- **Search**: Find claims by item title, claimant name, or reason
- **Quick Actions**: Approve/reject claims directly from the list

### 5. Reports & Analytics (`/admin/reports`)

- **Category Distribution**: Visual breakdown of items by category
- **Status Analytics**: Items distribution by status (active, claimed, resolved)
- **Lost vs Found**: Comparison of lost and found items
- **Claims Statistics**: Breakdown of claims by status
- **User Growth**: Trend visualization of user registrations
- **Resolution Rate**: Platform effectiveness metrics

## Access

### Admin Login Credentials

- **Email**: `admin@ug.edu.gh`
- **Password**: `admin123`

### Protected Routes

All admin routes are protected and require admin role authentication:

- `/admin/dashboard`
- `/admin/users`
- `/admin/items`
- `/admin/claims`
- `/admin/reports`

## Technical Implementation

### Files Structure

```
src/
├── components/
│   └── layout/
│       └── AdminLayout.tsx          # Admin sidebar layout
├── pages/
│   └── admin/
│       ├── AdminDashboard.tsx       # Dashboard with statistics
│       ├── AdminUsers.tsx           # User management
│       ├── AdminItems.tsx           # Items management
│       ├── AdminClaims.tsx          # Claims management
│       └── AdminReports.tsx         # Analytics and reports
├── contexts/
│   └── AuthContext.tsx              # Updated with admin role support
└── data/
    └── mockData.ts                  # Updated with admin user
```

### Key Components

- **AdminLayout**: Responsive layout with sidebar navigation
- **Protected Routes**: Role-based access control
- **Real-time Updates**: State management for data changes
- **Toast Notifications**: User feedback for actions

### UI Components Used

- Tables for data display
- Cards for statistics
- Dialogs for detailed views
- Alert dialogs for confirmations
- Badges for status indicators
- Select dropdowns for filters
- Search inputs for filtering

## Features Implementation

### User Verification

Admins can verify users to indicate they are legitimate members of the campus community. Verified users get a green badge next to their name.

### Item Status Management

Admins can change item status:

- **Active**: Item is still lost/found
- **Claimed**: Someone has claimed the item
- **Resolved**: Item has been successfully returned

### Claims Review

Admins can review claims with full context:

- View item details
- View claimant information
- Read claim reason and additional details
- Accept or reject claims

### Analytics

Visual charts and statistics provide insights:

- Bar charts for categorical data
- Progress bars for percentage metrics
- Trend lines for growth tracking

## Mobile Responsive

The admin portal is fully responsive with:

- Collapsible sidebar on mobile
- Touch-friendly buttons and controls
- Responsive tables and cards
- Mobile-optimized navigation

## Future Enhancements

- Export reports to PDF/CSV
- Email notifications for admin actions
- Activity logs and audit trails
- Bulk actions for items and users
- Advanced filtering and sorting
- Real-time dashboard updates
- Push notifications for pending claims
- User activity monitoring
- Automated spam detection
- Integration with university systems

## Usage Guidelines

### Best Practices

1. Verify users promptly to maintain trust
2. Review claims within 24 hours
3. Regularly monitor pending items
4. Check analytics weekly for trends
5. Remove spam or inappropriate content immediately

### Security

- Admin credentials should be kept secure
- Only authorized personnel should have admin access
- All admin actions should be documented
- Regular security audits recommended

## Support

For issues or questions about the admin portal, contact the development team.
