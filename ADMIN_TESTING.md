# Admin Portal Testing Guide

## Quick Start

### 1. Login as Admin

Navigate to the login page and use these credentials:

- **Email**: `admin@ug.edu.gh`
- **Password**: `admin123`

### 2. Access Admin Portal

After login, navigate to: `http://localhost:5173/admin/dashboard`

## Testing Checklist

### Dashboard

- [ ] View shows correct statistics (users, items, claims, resolved items)
- [ ] Recent items list displays latest 5 items
- [ ] Recent claims list displays latest 5 claims
- [ ] Platform health metrics show resolution rate and active items
- [ ] All stat cards display accurate numbers

### User Management (`/admin/users`)

- [ ] User list displays all non-admin users
- [ ] Search functionality works for name, email, and student ID
- [ ] Verify button toggles user verification status
- [ ] Unverify button works on verified users
- [ ] Delete button shows confirmation dialog
- [ ] User deletion removes user from list
- [ ] Toast notifications appear for all actions
- [ ] User count updates correctly

### Items Management (`/admin/items`)

- [ ] All items display with images and details
- [ ] Filter by type (Lost/Found) works
- [ ] Filter by status (Active/Claimed/Resolved) works
- [ ] Search functionality works
- [ ] Status dropdown allows changing item status
- [ ] View button navigates to item details page
- [ ] Delete button shows confirmation dialog
- [ ] Item deletion removes item from list
- [ ] Item count updates correctly

### Claims Management (`/admin/claims`)

- [ ] All claims display with claimant and item info
- [ ] Filter by status works (Pending/Accepted/Rejected)
- [ ] Search functionality works
- [ ] View button opens detailed claim dialog
- [ ] Accept button changes claim status to accepted
- [ ] Reject button changes claim status to rejected
- [ ] Detail dialog shows full claim information
- [ ] Status badges update correctly
- [ ] Claims count updates correctly

### Reports & Analytics (`/admin/reports`)

- [ ] Overview statistics display correctly
- [ ] Items by category chart shows all categories with items
- [ ] Items by status breakdown displays correctly
- [ ] Lost vs Found comparison shows accurate percentages
- [ ] Claims statistics show correct distribution
- [ ] User growth chart displays trend data
- [ ] All progress bars render correctly
- [ ] Percentages calculate accurately

## Mobile Responsiveness Testing

### Mobile Menu

- [ ] Hamburger menu appears on mobile screens
- [ ] Sidebar opens from sheet component
- [ ] All navigation items are accessible
- [ ] Logout button works in mobile view

### Tables on Mobile

- [ ] Tables are scrollable horizontally if needed
- [ ] Content remains readable
- [ ] Action buttons are accessible
- [ ] Filters work on mobile devices

## Expected Behavior

### User Verification

When you click "Verify" on an unverified user:

1. Badge changes from "Unverified" to "Verified" (green)
2. Button changes to "Unverify"
3. Toast notification appears
4. State persists during the session

### Item Status Change

When you change an item's status:

1. Dropdown updates immediately
2. Toast notification confirms the change
3. State persists during the session
4. Filters reflect the new status

### Claim Approval/Rejection

When you approve or reject a claim:

1. Status badge updates
2. Accept/Reject buttons disappear (if from pending)
3. Dialog closes (if from detail view)
4. Toast notification appears
5. Claims count updates if filtering by status

## Known Limitations (Mock Data)

- Data resets on page refresh (no backend persistence)
- Changes are session-only
- No real authentication/authorization
- No email notifications
- No audit logs
- Statistics are calculated from mock data

## Browser Testing

Test in these browsers:

- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Testing

- [ ] Page loads quickly
- [ ] Search is responsive
- [ ] Filters apply instantly
- [ ] No lag when switching between pages
- [ ] Tables render smoothly with data

## Accessibility Testing

- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] Buttons have hover states
- [ ] Focus indicators are visible
- [ ] Color contrast is sufficient

## Security Testing

- [ ] Non-admin users cannot access admin routes (redirected)
- [ ] Admin routes show proper authentication checks
- [ ] Delete actions require confirmation
- [ ] Sensitive actions show appropriate warnings

## Common Issues & Solutions

### Issue: Admin pages show blank screen

**Solution**: Check if you're logged in as admin. Logout and login with admin credentials.

### Issue: Changes don't persist after refresh

**Solution**: This is expected behavior with mock data. Implement backend API for persistence.

### Issue: TypeScript errors in IDE

**Solution**: These are type-checking warnings. The app will run fine. Reload TypeScript server.

### Issue: Sidebar doesn't show on mobile

**Solution**: Click the hamburger menu icon in the top-right corner.

## Next Steps for Production

1. Implement backend API endpoints
2. Add real authentication with JWT tokens
3. Implement role-based access control middleware
4. Add email notifications for admin actions
5. Implement audit logging
6. Add data export functionality
7. Implement pagination for large datasets
8. Add real-time updates with WebSockets
9. Implement bulk actions
10. Add advanced filtering and sorting

## Support

For bugs or feature requests, please contact the development team.
