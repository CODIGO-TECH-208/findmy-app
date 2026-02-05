import { ReactNode } from "react";
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
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, isAdmin } = useAuth();

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
        },
        {
            href: "/admin/users",
            icon: Users,
            label: "Users",
        },
        {
            href: "/admin/items",
            icon: Package,
            label: "Items",
        },
        {
            href: "/admin/claims",
            icon: FileText,
            label: "Claims",
        },
        {
            href: "/admin/reports",
            icon: BarChart3,
            label: "Reports",
        },
    ];

    const Sidebar = () => (
        <div className="flex h-full flex-col border-r bg-muted/40">
            <div className="flex h-16 items-center border-b px-6">
                <h2 className="text-xl font-bold">FindMy Admin</h2>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent ${isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t p-4">
                <Button
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    );

    return (
        <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <aside className="hidden w-64 md:block">
                <Sidebar />
            </aside>

            {/* Mobile Menu */}
            <div className="flex w-full flex-col md:hidden">
                <header className="flex h-16 items-center justify-between border-b px-4">
                    <h2 className="text-xl font-bold">FindMy Admin</h2>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <Sidebar />
                        </SheetContent>
                    </Sheet>
                </header>
            </div>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <div className="container mx-auto p-6">{children}</div>
            </main>
        </div>
    );
};

export default AdminLayout;
