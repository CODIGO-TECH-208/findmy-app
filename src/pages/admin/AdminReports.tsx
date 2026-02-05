import { useState, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUsers, mockItems, mockClaims, CATEGORIES } from "@/data/mockData";
import { BarChart3, TrendingUp, Users, Package } from "lucide-react";

const AdminReports = () => {
    const [analytics, setAnalytics] = useState({
        itemsByCategory: [] as { category: string; count: number; label: string }[],
        itemsByType: { lost: 0, found: 0 },
        itemsByStatus: { active: 0, claimed: 0, resolved: 0 },
        claimsByStatus: { pending: 0, accepted: 0, rejected: 0 },
        userGrowth: [] as { month: string; count: number }[],
    });

    useEffect(() => {
        // Items by category
        const categoryCounts = CATEGORIES.map((cat) => ({
            category: cat.value,
            label: cat.label,
            count: mockItems.filter((item) => item.category === cat.value).length,
        })).filter((cat) => cat.count > 0);

        // Items by type
        const itemsByType = {
            lost: mockItems.filter((item) => item.type === "lost").length,
            found: mockItems.filter((item) => item.type === "found").length,
        };

        // Items by status
        const itemsByStatus = {
            active: mockItems.filter((item) => item.status === "active").length,
            claimed: mockItems.filter((item) => item.status === "claimed").length,
            resolved: mockItems.filter((item) => item.status === "resolved").length,
        };

        // Claims by status
        const claimsByStatus = {
            pending: mockClaims.filter((claim) => claim.status === "pending").length,
            accepted: mockClaims.filter((claim) => claim.status === "accepted").length,
            rejected: mockClaims.filter((claim) => claim.status === "rejected").length,
        };

        // User growth (mock data by month)
        const userGrowth = [
            { month: "Jan", count: 5 },
            { month: "Feb", count: 12 },
            { month: "Mar", count: 18 },
            { month: "Apr", count: 25 },
            { month: "May", count: 32 },
            { month: "Jun", count: mockUsers.filter(u => u.role !== "admin").length },
        ];

        setAnalytics({
            itemsByCategory: categoryCounts,
            itemsByType,
            itemsByStatus,
            claimsByStatus,
            userGrowth,
        });
    }, []);

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Reports & Analytics</h1>
                    <p className="text-muted-foreground">
                        Platform statistics and insights
                    </p>
                </div>

                {/* Overview Stats */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{mockItems.length}</div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.itemsByType.lost} lost, {analytics.itemsByType.found} found
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {mockUsers.filter(u => u.role !== "admin").length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {mockUsers.filter(u => u.isVerified && u.role !== "admin").length} verified
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {mockItems.length > 0
                                    ? Math.round((analytics.itemsByStatus.resolved / mockItems.length) * 100)
                                    : 0}
                                %
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {analytics.itemsByStatus.resolved} items resolved
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
                            <BarChart3 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {analytics.claimsByStatus.pending}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Awaiting review
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Items by Category */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items by Category</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {analytics.itemsByCategory.map((cat) => {
                                    const maxCount = Math.max(...analytics.itemsByCategory.map(c => c.count));
                                    const percentage = (cat.count / maxCount) * 100;
                                    return (
                                        <div key={cat.category}>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium">{cat.label}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {cat.count}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-600"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Items by Status */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Items by Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Active</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.itemsByStatus.active}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-600"
                                            style={{
                                                width: `${mockItems.length > 0
                                                        ? (analytics.itemsByStatus.active / mockItems.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Claimed</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.itemsByStatus.claimed}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-600"
                                            style={{
                                                width: `${mockItems.length > 0
                                                        ? (analytics.itemsByStatus.claimed / mockItems.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Resolved</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.itemsByStatus.resolved}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-600"
                                            style={{
                                                width: `${mockItems.length > 0
                                                        ? (analytics.itemsByStatus.resolved / mockItems.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lost vs Found */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Lost vs Found Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Lost Items</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.itemsByType.lost} (
                                            {mockItems.length > 0
                                                ? Math.round((analytics.itemsByType.lost / mockItems.length) * 100)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-500"
                                            style={{
                                                width: `${mockItems.length > 0
                                                        ? (analytics.itemsByType.lost / mockItems.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Found Items</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.itemsByType.found} (
                                            {mockItems.length > 0
                                                ? Math.round((analytics.itemsByType.found / mockItems.length) * 100)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500"
                                            style={{
                                                width: `${mockItems.length > 0
                                                        ? (analytics.itemsByType.found / mockItems.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Claims Statistics */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Claims Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Pending</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.claimsByStatus.pending}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-600"
                                            style={{
                                                width: `${mockClaims.length > 0
                                                        ? (analytics.claimsByStatus.pending / mockClaims.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Accepted</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.claimsByStatus.accepted}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-600"
                                            style={{
                                                width: `${mockClaims.length > 0
                                                        ? (analytics.claimsByStatus.accepted / mockClaims.length) * 100
                                                        : 0
                                                    }%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Rejected</span>
                                        <span className="text-sm text-muted-foreground">
                                            {analytics.claimsByStatus.rejected}
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-red-600"
                                            style={{
                                                width: `${mockClaims.length > 0
                                                        ? (analytics.claimsByStatus.rejected / mockClaims.length) * 100
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

                {/* User Growth Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>User Growth Trend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-end justify-between h-48 gap-4">
                            {analytics.userGrowth.map((data, index) => {
                                const maxCount = Math.max(...analytics.userGrowth.map(d => d.count));
                                const height = (data.count / maxCount) * 100;
                                return (
                                    <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="relative w-full">
                                            <div
                                                className="w-full bg-blue-600 rounded-t transition-all"
                                                style={{ height: `${height * 1.5}px` }}
                                            >
                                                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium">
                                                    {data.count}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="text-sm text-muted-foreground">{data.month}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
};

export default AdminReports;
