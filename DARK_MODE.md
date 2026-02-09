# Dark Mode Implementation

## Overview

Dark and light mode have been successfully implemented in the FindMy application using a custom theme provider.

## Features

- **Theme Options**: Light, Dark, and System (auto-detect)
- **Persistent Storage**: User's theme preference is saved in localStorage
- **Theme Toggle**: Available in both Navbar and Admin Layout
- **System Preference Detection**: Automatically detects and respects OS theme preference

## Implementation Details

### Components Created

1. **ThemeContext.tsx** (`src/contexts/ThemeContext.tsx`)
   - Manages theme state and provides theme switching functionality
   - Persists theme preference in localStorage
   - Detects and applies system theme preferences

2. **ThemeToggle.tsx** (`src/components/ui/theme-toggle.tsx`)
   - Dropdown menu with Sun, Moon, and Monitor icons
   - Allows users to switch between Light, Dark, and System themes
   - Shows checkmark next to currently selected theme

### Integration Points

- **App.tsx**: Wrapped with ThemeProvider
- **Navbar.tsx**: Theme toggle added to navigation bar
- **AdminLayout.tsx**: Theme toggle added to both mobile and desktop headers

## How It Works

### Theme Switching

The theme is controlled by adding a `dark` or `light` class to the root HTML element:

```tsx
document.documentElement.classList.add("dark"); // or 'light'
```

### CSS Variables

All colors are defined using CSS custom properties in `src/index.css`:

- Light mode colors: defined in `:root`
- Dark mode colors: defined in `.dark`

Tailwind automatically switches between these variables based on the class.

### Usage in Components

Components should use semantic Tailwind classes that automatically adapt:

- `bg-background` - Background color
- `text-foreground` - Primary text color
- `text-muted-foreground` - Muted text color
- `bg-card` - Card background
- `border-border` - Border color

## User Experience

1. Click the sun/moon icon in the navigation bar
2. Select preferred theme (Light, Dark, or System)
3. Theme is applied immediately and saved for future sessions
4. System theme option automatically follows OS preference

## Browser Support

- Works in all modern browsers
- Gracefully falls back to light mode in older browsers
- localStorage ensures preference persists across sessions
