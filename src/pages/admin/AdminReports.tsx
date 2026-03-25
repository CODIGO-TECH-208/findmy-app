import { useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useDatabaseStore } from "@/stores/databaseStore";
import { CATEGORIES } from "@/data/mockData";
import { BarChart3, TrendingUp, Users, Package, PieChart, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

const AdminReports = () => {
  const items = useDatabaseStore((s) => s.items);
  const users = useDatabaseStore((s) => s.users);
  const claims = useDatabaseStore((s) => s.claims);

  const analytics = useMemo(() => {
    const categoryCounts = CATEGORIES.map((cat) => ({
      category: cat.value,
      label: cat.label,
      icon: cat.icon,
      count: items.filter((i) => i.category === cat.value).length,
    })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

    const lost = items.filter((i) => i.type === "lost").length;
    const found = items.filter((i) => i.type === "found").length;
    const active = items.filter((i) => i.status === "active").length;
    const claimed = items.filter((i) => i.status === "claimed").length;
    const resolved = items.filter((i) => i.status === "resolved").length;
    const pending = claims.filter((c) => c.status === "pending").length;
    const accepted = claims.filter((c) => c.status === "accepted").length;
    const rejected = claims.filter((c) => c.status === "rejected").length;
    const totalUsers = users.filter((u) => u.role !== "admin").length;
    const verified = users.filter((u) => u.isVerified && u.role !== "admin").length;

    return { categoryCounts, lost, found, active, claimed, resolved, pending, accepted, rejected, totalUsers, verified };
  }, [items, users, claims]);

  const total = items.length;
  const totalClaims = claims.length;

  const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

  const StatBar = ({ label, value, total, color }: { label: string; value: number; total: number; color: string }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{value} <span className="text-muted-foreground font-normal">({pct(value, total)}%)</span></span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className={cn("h-full rounded-full transition-all duration-500", color)} style={{ width: `${pct(value, total)}%` }} />
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-sm text-muted-foreground">Platform statistics and performance insights</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Items", value: total, icon: Package, sub: `${analytics.active} active`, color: "text-primary" },
            { label: "Users", value: analytics.totalUsers, icon: Users, sub: `${analytics.verified} verified`, color: "text-emerald-500" },
            { label: "Resolution Rate", value: `${pct(analytics.resolved, total)}%`, icon: TrendingUp, sub: `${analytics.resolved} resolved`, color: "text-violet-500" },
            { label: "Claims", value: totalClaims, icon: BarChart3, sub: `${analytics.pending} pending`, color: "text-amber-500" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-muted", s.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Items by Category */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Items by Category</h3>
            </div>
            <div className="space-y-4">
              {analytics.categoryCounts.map((cat) => {
                const maxCount = analytics.categoryCounts[0]?.count || 1;
                return (
                  <div key={cat.category} className="flex items-center gap-3">
                    <span className="text-lg w-7 text-center">{cat.icon}</span>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-foreground">{cat.label}</span>
                        <span className="text-muted-foreground">{cat.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(cat.count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Lost vs Found */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Item Breakdown</h3>
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Type Distribution</p>
                <div className="space-y-3">
                  <StatBar label="Lost" value={analytics.lost} total={total} color="bg-destructive" />
                  <StatBar label="Found" value={analytics.found} total={total} color="bg-emerald-500" />
                </div>
              </div>
              <div className="border-t border-border pt-5">
                <p className="text-sm font-medium text-foreground mb-3">Status Distribution</p>
                <div className="space-y-3">
                  <StatBar label="Active" value={analytics.active} total={total} color="bg-primary" />
                  <StatBar label="Claimed" value={analytics.claimed} total={total} color="bg-amber-500" />
                  <StatBar label="Resolved" value={analytics.resolved} total={total} color="bg-violet-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Claims Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Claims Overview</h3>
            </div>
            <div className="space-y-3">
              <StatBar label="Pending" value={analytics.pending} total={totalClaims} color="bg-amber-500" />
              <StatBar label="Accepted" value={analytics.accepted} total={totalClaims} color="bg-emerald-500" />
              <StatBar label="Rejected" value={analytics.rejected} total={totalClaims} color="bg-destructive" />
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Pending", value: analytics.pending, color: "bg-amber-500/10 text-amber-600" },
                { label: "Accepted", value: analytics.accepted, color: "bg-emerald-500/10 text-emerald-600" },
                { label: "Rejected", value: analytics.rejected, color: "bg-destructive/10 text-destructive" },
              ].map((s) => (
                <div key={s.label} className={cn("rounded-lg p-3 text-center", s.color)}>
                  <p className="text-xl font-bold">{s.value}</p>
                  <p className="text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* User Stats */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-primary" />
              <h3 className="text-base font-semibold text-foreground">User Insights</h3>
            </div>
            <div className="space-y-3">
              <StatBar label="Verified" value={analytics.verified} total={analytics.totalUsers} color="bg-emerald-500" />
              <StatBar label="Unverified" value={analytics.totalUsers - analytics.verified} total={analytics.totalUsers} color="bg-muted-foreground" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{analytics.totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-1">Total Users</p>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-4 text-center">
                <p className="text-2xl font-bold text-emerald-600">{pct(analytics.verified, analytics.totalUsers)}%</p>
                <p className="text-xs text-emerald-600/70 mt-1">Verification Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
