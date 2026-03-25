import AdminLayout from "@/components/layout/AdminLayout";
import { useDatabaseStore } from "@/stores/databaseStore";
import { Users, Package, FileText, CheckCircle, TrendingUp, TrendingDown, ArrowUpRight, Clock, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const AdminDashboard = () => {
  const users = useDatabaseStore((s) => s.users);
  const items = useDatabaseStore((s) => s.items);
  const claims = useDatabaseStore((s) => s.claims);

  const totalUsers = users.filter((u) => u.role !== "admin").length;
  const totalItems = items.length;
  const totalClaims = claims.length;
  const resolvedItems = items.filter((i) => i.status === "resolved").length;
  const activeItems = items.filter((i) => i.status === "active").length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const resolutionRate = totalItems > 0 ? Math.round((resolvedItems / totalItems) * 100) : 0;

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, change: "+12%", up: true, color: "text-primary" },
    { label: "Total Items", value: totalItems, icon: Package, change: "+8%", up: true, color: "text-emerald-500" },
    { label: "Pending Claims", value: pendingClaims, icon: Clock, change: `${totalClaims} total`, up: false, color: "text-amber-500" },
    { label: "Resolved", value: resolvedItems, icon: CheckCircle, change: `${resolutionRate}%`, up: true, color: "text-violet-500" },
  ];

  const recentItems = items.slice(0, 6);
  const recentClaims = claims.slice(0, 5);

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Welcome back 👋</h2>
          <p className="text-muted-foreground mt-1">Here's what's happening on your platform today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted", stat.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={cn("flex items-center gap-1 text-xs font-medium", stat.up ? "text-emerald-500" : "text-muted-foreground")}>
                    {stat.up && <TrendingUp className="h-3 w-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Platform Health */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Platform Health</h3>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Resolution Rate</span>
                <span className="font-semibold text-foreground">{resolutionRate}%</span>
              </div>
              <Progress value={resolutionRate} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Active Items</span>
                <span className="font-semibold text-foreground">{totalItems > 0 ? Math.round((activeItems / totalItems) * 100) : 0}%</span>
              </div>
              <Progress value={totalItems > 0 ? (activeItems / totalItems) * 100 : 0} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Claims Processed</span>
                <span className="font-semibold text-foreground">{totalClaims > 0 ? Math.round(((totalClaims - pendingClaims) / totalClaims) * 100) : 0}%</span>
              </div>
              <Progress value={totalClaims > 0 ? ((totalClaims - pendingClaims) / totalClaims) * 100 : 0} className="h-2" />
            </div>
          </div>
        </div>

        {/* Two Column: Recent Items + Claims */}
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Recent Items - wider */}
          <div className="lg:col-span-3 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-base font-semibold text-foreground">Recent Items</h3>
              <Badge variant="secondary" className="text-xs">{activeItems} active</Badge>
            </div>
            <div className="p-5 space-y-3">
              {recentItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                  {item.images[0] ? (
                    <img src={item.images[0]} alt={item.title} className="h-10 w-10 rounded-lg object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.location} · {item.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5 border-0",
                        item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"
                      )}
                    >
                      {item.type}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] px-2 py-0.5 border-0",
                        item.status === "active" ? "bg-primary/10 text-primary" :
                        item.status === "claimed" ? "bg-amber-500/10 text-amber-600" :
                        "bg-muted text-muted-foreground"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Claims */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between p-5 pb-0">
              <h3 className="text-base font-semibold text-foreground">Recent Claims</h3>
              <Badge variant="secondary" className="text-xs">{pendingClaims} pending</Badge>
            </div>
            <div className="p-5 space-y-3">
              {recentClaims.map((claim) => (
                <div key={claim.id} className="flex items-center gap-3 rounded-lg p-2.5 hover:bg-muted/50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={claim.user.avatar} alt={claim.user.name} />
                    <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                      {claim.user.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{claim.item.title}</p>
                    <p className="text-xs text-muted-foreground">by {claim.user.name}</p>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-2 py-0.5 border-0 capitalize",
                      claim.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                      claim.status === "accepted" ? "bg-emerald-500/10 text-emerald-600" :
                      "bg-destructive/10 text-destructive"
                    )}
                  >
                    {claim.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
