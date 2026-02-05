# Admin Portal - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Start the Application

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### Step 2: Login as Admin

1. Navigate to `http://localhost:5173/login`
2. Enter admin credentials:
   - **Email**: `admin@ug.edu.gh`
   - **Password**: `admin123`
3. Click "Sign In"

### Step 3: Access Admin Portal

After login, you have two options:

**Option A: Direct URL**

- Navigate to `http://localhost:5173/admin/dashboard`

**Option B: Through User Menu**

- Click your avatar in the top-right corner
- Select "Admin Portal" from the dropdown menu

## 📋 What You Can Do

### Dashboard

View platform statistics and recent activity at a glance.

### Users (`/admin/users`)

- Search users by name, email, or student ID
- Verify/unverify user accounts
- Delete users from the platform

### Items (`/admin/items`)

- View all lost and found items
- Filter by type (Lost/Found) and status
- Change item status (Active/Claimed/Resolved)
- Delete items

### Claims (`/admin/claims`)

- Review pending claims
- View detailed claim information
- Accept or reject claims
- Filter by claim status

### Reports (`/admin/reports`)

- View analytics and statistics
- See category distribution
- Track user growth
- Monitor platform health

## 🎯 Common Tasks

### Verify a User

1. Go to `/admin/users`
2. Find the user (use search if needed)
3. Click "Verify" button
4. User badge changes to "Verified" (green)

### Approve a Claim

1. Go to `/admin/claims`
2. Find the pending claim
3. Click the eye icon to view details
4. Click "Accept" to approve

### Change Item Status

1. Go to `/admin/items`
2. Find the item
3. Click the status dropdown
4. Select new status (Active/Claimed/Resolved)

### Delete Content

1. Navigate to the appropriate section
2. Find the item/user to delete
3. Click the trash icon
4. Confirm deletion in the dialog

## 🔒 Security Notes

- Admin routes are protected - non-admin users will be redirected
- All destructive actions require confirmation
- Changes are session-based (reset on refresh with mock data)

## 📱 Mobile Access

The admin portal is fully responsive:

- Tap the hamburger menu (☰) to open navigation
- All features work on mobile devices
- Tables scroll horizontally if needed

## ⚠️ Important Notes

### Mock Data

- All data is currently mocked
- Changes reset when you refresh the page
- This is for demonstration purposes

### For Production

To use with real data:

1. Connect to backend API
2. Replace mock data calls with API calls
3. Implement proper authentication
4. Add database persistence

## 🆘 Troubleshooting

### Can't Access Admin Portal

**Problem**: Redirected to login or dashboard
**Solution**: Make sure you're logged in with admin credentials

### Pages Show Blank

**Problem**: Components not loading
**Solution**: Check browser console for errors, refresh the page

### Changes Not Saving

**Problem**: Data resets after refresh
**Solution**: Expected behavior with mock data - implement backend for persistence

### TypeScript Errors

**Problem**: Red underlines in code editor
**Solution**: These are type warnings - app will run fine. Reload TypeScript server if needed.

## 📞 Need Help?

Refer to these documents:

- **ADMIN_PORTAL.md** - Full feature documentation
- **ADMIN_TESTING.md** - Testing checklist
- **IMPLEMENTATION_SUMMARY.md** - Technical details

## 🎉 You're Ready!

The admin portal is fully functional and ready to use. Start exploring and managing your FindMy platform!

---

**Quick Links:**

- Dashboard: http://localhost:5173/admin/dashboard
- Users: http://localhost:5173/admin/users
- Items: http://localhost:5173/admin/items
- Claims: http://localhost:5173/admin/claims
- Reports: http://localhost:5173/admin/reports
