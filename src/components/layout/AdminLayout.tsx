import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    BarChart3,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, isAdmin, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (!isAdmin) {
        navigate("/");
        return null;
    }

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const navItems = [
        {
            href: "/admin/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
            badge: null,
        },
        {
            href: "/admin/users",
            icon: Users,
            label: "Users",
            badge: null,
        },
        {
            href: "/admin/items",
            icon: Package,
            label: "Items",
            badge: null,
        },
        {
            href: "/admin/claims",
            icon: FileText,
            label: "Claims",
            badge: "5",
        },
        {
            href: "/admin/reports",
            icon: BarChart3,
            label: "Reports",
            badge: null,
        },
    ];

    const Sidebar = ({ mobile = false }) => (
        <div className={cn(
            "flex h-full flex-col",
            "border-r bg-gradient-to-b from-slate-900 to-slate-800",
            "text-white shadow-lg"
        )}>
            {/* Header */}
            <div className="flex h-20 items-center justify-between border-b border-slate-700 px-6">
                <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-2">
                        <Crown className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold">FindMy Admin</h2>
                        <p className="text-xs text-slate-400">Super Admin Portal</p>
                    </div>
                </div>
                {mobile && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-white hover:bg-slate-700"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4">
                <p className="px-3 py-2 text-xs font-semibold uppercase text-slate-400">
                    Management
                </p>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => mobile && setMobileMenuOpen(false)}
                            className={cn(
                                "group relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium",
                                "transition-all duration-200",
                                isActive
                                    ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                                    : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
                            )}
                        >
                            <Icon className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                                <span className="ml-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                                    {item.badge}
                                </span>
                            )}
                            {isActive && (
                                <ChevronRight className="h-4 w-4 flex-shrink-0" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Info */}
            <div className="border-t border-slate-700 p-4">
                <div className="mb-4 flex items-center gap-3 rounded-lg bg-slate-700/30 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                        <span className="text-sm font-bold text-white">
                            {user?.name?.charAt(0).toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold">{user?.name}</p>
                        <p className="truncate text-xs text-slate-400">Super Admin</p>
                    </div>
                </div>

                {/* Logout Button */}
                <Button
                    onClick={handleLogout}
                    className={cn(
                        "w-full justify-center gap-2 rounded-lg",
                        "bg-red-600 hover:bg-red-700 text-white",
                        "transition-all duration-200"
                    )}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden md:flex flex-col transition-all duration-300",
                sidebarOpen ? "w-72" : "w-20"
            )}>
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col">
                {/* Mobile Header */}
                <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm lg:hidden">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-slate-700 hover:bg-slate-100"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5">
                                <Crown className="h-4 w-4 text-white" />
                            </div>
                            <h1 className="text-lg font-bold text-slate-900">FindMy Admin</h1>
                        </div>
                    </div>
                </header>

                {/* Mobile Sidebar */}
                {mobileMenuOpen && (
                    <div className="absolute top-16 left-0 right-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                        <div onClick={(e) => e.stopPropagation()} className="h-[calc(100vh-4rem)] w-72 overflow-y-auto">
                            <Sidebar mobile={true} />
                        </div>
                    </div>
                )}

                {/* Main Content */}
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
