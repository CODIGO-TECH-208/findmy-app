import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockItems, mockClaims } from "@/data/mockData";
import { Users, Package, FileText, CheckCircle, TrendingUp, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
            iconColor: "text-blue-600",
            trend: "+12%",
            trendUp: true,
        },
        {
            title: "Total Items",
            value: stats.totalItems,
            description: `${stats.activeItems} active items`,
            icon: Package,
            bgColor: "bg-gradient-to-br from-green-50 to-green-100",
            iconColor: "text-green-600",
            trend: "+8%",
            trendUp: true,
        },
        {
            title: "Total Claims",
            value: stats.totalClaims,
            description: `${stats.pendingClaims} pending review`,
            icon: FileText,
            bgColor: "bg-gradient-to-br from-yellow-50 to-yellow-100",
            iconColor: "text-yellow-600",
            trend: "+5%",
            trendUp: true,
        },
        {
            title: "Resolved Items",
            value: stats.resolvedItems,
            description: "Successfully matched",
            icon: CheckCircle,
            bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
            iconColor: "text-purple-600",
            trend: "+15%",
            trendUp: true,
        },
    ];

    // Recent activity
    const recentItems = mockItems.slice(0, 5);
    const recentClaims = mockClaims.slice(0, 5);

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Super Admin Banner */}
                <div className="rounded-xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 p-8 text-white shadow-lg">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold">Super Admin Dashboard</h1>
                            <p className="text-blue-100 mt-2 text-lg">Complete platform control and management</p>
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-2 rounded-lg bg-blue-600/30 px-4 py-2 backdrop-blur">
                                <div className="h-3 w-3 rounded-full bg-green-400 animate-pulse"></div>
                                <span className="text-sm font-semibold">System Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Header */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-bold text-slate-900">Platform Overview</h2>
                    <p className="text-slate-600">Real-time metrics and key performance indicators</p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={stat.title}
                                className={cn(
                                    "rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300",
                                    "border border-gray-100",
                                    stat.bgColor
                                )}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={cn(
                                        "rounded-lg p-3",
                                        stat.bgColor
                                    )}>
                                        <Icon className={cn("h-6 w-6", stat.iconColor)} />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 text-sm font-semibold",
                                        stat.trendUp ? "text-green-600" : "text-red-600"
                                    )}>
                                        {stat.trendUp ? (
                                            <ArrowUpRight className="h-4 w-4" />
                                        ) : (
                                            <ArrowDownRight className="h-4 w-4" />
                                        )}
                                        {stat.trend}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-medium text-slate-600">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold text-slate-900">
                                        {stat.value}
                                    </p>
                                    <p className="text-xs text-slate-500 pt-2">
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Recent Activity Section */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Items */}
                    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Items</h3>
                        <div className="space-y-4">
                            {recentItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                >
                                    {item.images[0] && (
                                        <img
                                            src={item.images[0]}
                                            alt={item.title}
                                            className="h-12 w-12 rounded-lg object-cover"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {item.type === "lost" ? "🔴 Lost" : "🟢 Found"} • {item.location}
                                        </p>
                                    </div>
                                    <span
                                        className={cn(
                                            "text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap",
                                            item.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "claimed"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-gray-100 text-gray-700"
                                        )}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Claims */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Claims</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentClaims.map((claim) => (
                                    <div
                                        key={claim.id}
                                        className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                                    >
                                        {claim.item.images[0] && (
                                            <img
                                                src={claim.item.images[0]}
                                                alt={claim.item.title}
                                                className="h-12 w-12 rounded-lg object-cover"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-slate-900">{claim.item.title}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                By {claim.user.name}
                                            </p>
                                        </div>
                                        <span
                                            className={cn(
                                                "text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap",
                                                claim.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : claim.status === "accepted"
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                            )}
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
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                        <h3 className="text-lg font-bold text-slate-900">Platform Health</h3>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-slate-700">Resolution Rate</span>
                                <span className="text-sm font-bold text-green-600">
                                    {stats.totalItems > 0
                                        ? Math.round((stats.resolvedItems / stats.totalItems) * 100)
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
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
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-slate-700">Active Items</span>
                                <span className="text-sm font-bold text-blue-600">
                                    {stats.totalItems > 0
                                        ? Math.round((stats.activeItems / stats.totalItems) * 100)
                                        : 0}
                                    %
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
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
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
