import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  LayoutDashboard,
  Users,
  Package,
  FileText,
  BarChart3,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useDatabaseStore } from "@/stores/databaseStore";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/items", icon: Package, label: "Items" },
  { href: "/admin/claims", icon: FileText, label: "Claims" },
  { href: "/admin/reports", icon: BarChart3, label: "Analytics" },
];

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const claims = useDatabaseStore((s) => s.claims);
  const pendingClaims = claims.filter((c) => c.status === "pending").length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const currentPage = navItems.find((n) => location.pathname === n.href);

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Logo */}
      <div className={cn("flex h-16 items-center border-b border-border px-4", collapsed && !mobile ? "justify-center" : "gap-3")}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
          FM
        </div>
        {(!collapsed || mobile) && (
          <span className="text-lg font-bold text-foreground tracking-tight">FindMy</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1">
        {(!collapsed || mobile) && (
          <p className="px-3 pb-2 pt-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Menu
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          const hasBadge = item.href === "/admin/claims" && pendingClaims > 0;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => mobile && setMobileOpen(false)}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                collapsed && !mobile ? "justify-center" : "",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              {(!collapsed || mobile) && <span className="flex-1">{item.label}</span>}
              {hasBadge && (!collapsed || mobile) && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                  {pendingClaims}
                </span>
              )}
              {hasBadge && collapsed && !mobile && (
                <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-destructive ring-2 ring-card" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-border p-3 space-y-2">
        <div className={cn("flex items-center gap-3 rounded-lg p-2", collapsed && !mobile ? "justify-center" : "")}>
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {(!collapsed || mobile) && (
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground">Administrator</p>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            collapsed && !mobile ? "px-0" : "justify-start gap-2"
          )}
          size="sm"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {(!collapsed || mobile) && <span>Sign out</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className={cn(
        "hidden md:flex flex-col transition-all duration-200 relative",
        collapsed ? "w-[68px]" : "w-64"
      )}>
        <SidebarContent />
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-foreground">{currentPage?.label || "Admin"}</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden lg:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="w-64 pl-9 h-9 bg-muted/50 border-0" />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-[18px] w-[18px]" />
              {pendingClaims > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive" />
              )}
            </Button>
            <ThemeToggle />
          </div>
        </header>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 top-16 z-50 md:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative h-full w-64" onClick={(e) => e.stopPropagation()}>
              <SidebarContent mobile />
            </div>
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
