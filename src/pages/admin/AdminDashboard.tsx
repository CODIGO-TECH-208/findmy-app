import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockItems, mockClaims } from "@/data/mockData";
import { Users, Package, FileText, CheckCircle, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalItems: 0,
        totalClaims: 0,
        resolvedItems: 0,
        activeItems: 0,
        pendingClaims: 0,
    });

    useEffect(() => {
        // Calculate statistics
        const totalUsers = mockUsers.filter(u => u.role !== "admin").length;
        const totalItems = mockItems.length;
        const totalClaims = mockClaims.length;
        const resolvedItems = mockItems.filter(item => item.status === "resolved").length;
        const activeItems = mockItems.filter(item => item.status === "active").length;
        const pendingClaims = mockClaims.filter(claim => claim.status === "pending").length;

        setStats({
            totalUsers,
            totalItems,
            totalClaims,
            resolvedItems,
            activeItems,
            pendingClaims,
        });
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            description: "Registered users",
            icon: Users,
            color: "text-blue-600",
        },
        {
            title: "Total Items",
            value: stats.totalItems,
            description: `${stats.activeItems} active items`,
            icon: Package,
            color: "text-green-600",
        },
        {
            title: "Total Claims",
            value: stats.totalClaims,
            description: `${stats.pendingClaims} pending review`,
            icon: FileText,
            color: "text-yellow-600",
        },
        {
            title: "Resolved Items",
            value: stats.resolvedItems,
            description: "Successfully matched",
            icon: CheckCircle,
            color: "text-purple-600",
        },
    ];

    // Recent activity
    const recentItems = mockItems.slice(0, 5);
    const recentClaims = mockClaims.slice(0, 5);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard</h1>
                    <p className="text-muted-foreground">Overview of FindMy platform</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <Card key={stat.title}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <Icon className={`h-4 w-4 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {stat.description}
                                    </p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Recent Activity Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Recent Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{item.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {item.type === "lost" ? "Lost" : "Found"} • {item.location}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${item.status === "active"
                                                    ? "bg-green-100 text-green-700"
                                                    : item.status === "claimed"
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                        >
                                            {item.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Claims */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Claims</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentClaims.map((claim) => (
                                    <div
                                        key={claim.id}
                                        className="flex items-start justify-between border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{claim.item.title}</p>
                                            <p className="text-xs text-muted-foreground">
                                                By {claim.user.name}
                                            </p>
                                        </div>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full ${claim.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : claim.status === "accepted"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                        >
                                            {claim.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Platform Health */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Platform Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Resolution Rate</span>
                                    <span className="text-sm text-muted-foreground">
                                        {stats.totalItems > 0
                                            ? Math.round((stats.resolvedItems / stats.totalItems) * 100)
                                            : 0}
                                        %
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-600"
                                        style={{
                                            width: `${stats.totalItems > 0
                                                    ? (stats.resolvedItems / stats.totalItems) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Active Items</span>
                                    <span className="text-sm text-muted-foreground">
                                        {stats.totalItems > 0
                                            ? Math.round((stats.activeItems / stats.totalItems) * 100)
                                            : 0}
                                        %
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-600"
                                        style={{
                                            width: `${stats.totalItems > 0
                                                    ? (stats.activeItems / stats.totalItems) * 100
                                                    : 0
                                                }%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
