import { useMemo } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Badge } from "@/components/ui/badge";
import { useDatabaseStore } from "@/stores/databaseStore";
import { CATEGORIES } from "@/data/mockData";
import { BarChart3, TrendingUp, Users, Package, PieChart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart as RePieChart, Pie, Legend, AreaChart, Area 
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a4de6c'];

const AdminReports = () => {
  const items = useDatabaseStore((s) => s.items);
  const users = useDatabaseStore((s) => s.users);
  const claims = useDatabaseStore((s) => s.claims);

  const analytics = useMemo(() => {
    const categoryCounts = CATEGORIES.map((cat) => ({
      name: cat.label,
      count: items.filter((i) => i.category === cat.value).length,
    })).filter((c) => c.count > 0).sort((a, b) => b.count - a.count);

    const typeData = [
      { name: 'Lost', value: items.filter((i) => i.type === "lost").length },
      { name: 'Found', value: items.filter((i) => i.type === "found").length }
    ];

    const statusData = [
      { name: 'Active', value: items.filter((i) => i.status === "active").length },
      { name: 'Claimed', value: items.filter((i) => i.status === "claimed").length },
      { name: 'Resolved', value: items.filter((i) => i.status === "resolved").length }
    ];

    const claimsData = [
      { name: 'Pending', value: claims.filter((c) => c.status === "pending").length },
      { name: 'Accepted', value: claims.filter((c) => c.status === "accepted").length },
      { name: 'Rejected', value: claims.filter((c) => c.status === "rejected").length }
    ];

    const total = items.length;
    const resolved = items.filter((i) => i.status === "resolved").length;
    const totalUsers = users.filter((u) => u.role !== "admin").length;
    const verified = users.filter((u) => u.isVerified && u.role !== "admin").length;

    return { categoryCounts, typeData, statusData, claimsData, total, resolved, totalUsers, verified };
  }, [items, users, claims]);

  const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics & Performance</h2>
          <p className="text-sm text-muted-foreground">Detailed insights into your campus lost and found platform.</p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Items Listed", value: analytics.total, icon: Package, sub: `${analytics.statusData[0].value} currently active`, color: "text-primary" },
            { label: "User Base", value: analytics.totalUsers, icon: Users, sub: `${analytics.verified} verified accounts`, color: "text-emerald-500" },
            { label: "Success Rate", value: `${pct(analytics.resolved, analytics.total)}%`, icon: TrendingUp, sub: "Items successfully reunited", color: "text-violet-500" },
            { label: "Active Claims", value: claims.length, icon: Activity, sub: `${analytics.claimsData[0].value} pending review`, color: "text-amber-500" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-border bg-card p-5 group hover:shadow-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors", s.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-3xl font-extrabold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {s.sub}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Category Distribution Chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-primary/10 rounded-lg"><BarChart3 className="h-4 w-4 text-primary" /></div>
              <h3 className="text-base font-bold text-foreground">Items by Category</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.categoryCounts} layout="vertical" margin={{ left: 30, right: 30 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} style={{ fontSize: '12px' }} />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }} 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} 
                  />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20}>
                    {analytics.categoryCounts.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lost vs Found Pie Chart */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-violet-500/10 rounded-lg"><PieChart className="h-3 w-3 text-violet-600" /></div>
              <h3 className="text-base font-bold text-foreground">Lost vs Found Ratio</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={analytics.typeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {analytics.typeData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : '#10b981'} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Legend iconType="circle" />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="h-4 w-4 text-emerald-600" /></div>
              <h3 className="text-base font-bold text-foreground">Status Distribution</h3>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.statusData} margin={{ left: -20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} style={{ fontSize: '11px', fontWeight: 500 }} />
                  <YAxis axisLine={false} tickLine={false} style={{ fontSize: '11px' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorVal)" />
                  <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

           {/* Claims Health */}
           <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <div className="p-2 bg-amber-500/10 rounded-lg"><Activity className="h-4 w-4 text-amber-600" /></div>
              <h3 className="text-base font-bold text-foreground">Claims Review Cycle</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {analytics.claimsData.map((s, i) => (
                <div key={i} className="text-center p-4 rounded-2xl bg-muted/30 border border-border/50">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-tight">{s.name}</p>
                  <p className="text-2xl font-black mt-1">{s.value}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4">
               <div>
                  <div className="flex justify-between text-xs font-bold mb-2">
                    <span className="uppercase text-muted-foreground">Verification Accuracy</span>
                    <span className="text-primary">{pct(analytics.verified, analytics.totalUsers)}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-1000" 
                      style={{ width: `${pct(analytics.verified, analytics.totalUsers)}%` }} 
                    />
                  </div>
               </div>
               <p className="text-xs text-muted-foreground italic leading-relaxed pt-2">
                 Maintaining a high verification rate ensures the platform remains safe for all Legon students.
               </p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
