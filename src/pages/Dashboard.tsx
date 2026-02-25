import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useDatabaseStore } from "@/stores/databaseStore";
import {
  Plus, Search, FileText, MessageSquare, ArrowRight, Clock,
  CheckCircle, AlertCircle, Eye, TrendingUp, Package, Bell,
  ArrowUpRight, BarChart3
} from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const items = useDatabaseStore((s) => s.items);
  const claims = useDatabaseStore((s) => s.claims);

  const displayUser = user || useDatabaseStore.getState().users.find(u => u.role !== "admin");
  if (!displayUser) return null;

  const userItems = items.filter((item) => item.userId === displayUser.id);
  const userClaims = claims.filter((claim) => claim.userId === displayUser.id);
  const claimsOnUserItems = claims.filter((claim) =>
    userItems.some((item) => item.id === claim.itemId)
  );
  const totalViews = userItems.reduce((acc, item) => acc + item.views, 0);
  const activeItems = userItems.filter(i => i.status === "active").length;
  const resolvedItems = userItems.filter(i => i.status === "claimed" || i.status === "resolved").length;

  const quickActions = [
    { title: "Report Lost", description: "Post a lost item", icon: AlertCircle, href: "/post?type=lost", color: "bg-destructive/10 text-destructive" },
    { title: "Report Found", description: "Help someone out", icon: CheckCircle, href: "/post?type=found", color: "bg-success/10 text-success" },
    { title: "Browse", description: "Search items", icon: Search, href: "/browse", color: "bg-primary/10 text-primary" },
    { title: "Claims", description: "Track status", icon: FileText, href: "/my-claims", color: "bg-warning/10 text-warning" },
  ];

  const recentActivity = [
    { type: "claim", message: "Your claim on 'Keys with Red Keychain' was accepted!", time: "2 hours ago", status: "success" },
    { type: "view", message: `Your listings got ${totalViews} total views`, time: "5 hours ago", status: "info" },
    { type: "claim", message: `You have ${userClaims.length} claims submitted`, time: "1 day ago", status: "pending" },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                {displayUser.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl md:text-2xl font-display font-bold text-foreground">
                Welcome back, {displayUser.name.split(" ")[0]}!
              </h1>
              <p className="text-sm text-muted-foreground">Here's an overview of your activity</p>
            </div>
          </div>
          <Button asChild className="gap-2">
            <Link to="/post"><Plus className="h-4 w-4" />New Post</Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="relative overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <Badge variant="secondary" className="text-xs gap-1"><ArrowUpRight className="h-3 w-3" />Active</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{userItems.length}</p>
              <p className="text-xs text-muted-foreground">Total Posts</p>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>{activeItems} active</span><span>{resolvedItems} resolved</span>
                </div>
                <Progress value={userItems.length > 0 ? (resolvedItems / userItems.length) * 100 : 0} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-lg bg-warning/10 flex items-center justify-center">
                  <FileText className="h-4 w-4 text-warning" />
                </div>
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{userClaims.length}</p>
              <p className="text-xs text-muted-foreground">My Claims</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                  <Bell className="h-4 w-4 text-success" />
                </div>
                <span className="text-xs text-muted-foreground">Incoming</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{claimsOnUserItems.length}</p>
              <p className="text-xs text-muted-foreground">Claims on Items</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="h-9 w-9 rounded-lg bg-accent flex items-center justify-center">
                  <Eye className="h-4 w-4 text-accent-foreground" />
                </div>
                <div className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />+12%
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground">{totalViews}</p>
              <p className="text-xs text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.href} to={action.href}>
              <Card className="h-full transition-all hover:shadow-card hover:-translate-y-0.5 group cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center shrink-0`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm text-foreground">{action.title}</h3>
                    <p className="text-xs text-muted-foreground truncate">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardDescription>Latest updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                      activity.status === "success" ? "bg-success/10 text-success"
                        : activity.status === "pending" ? "bg-warning/10 text-warning"
                          : "bg-primary/10 text-primary"
                    }`}>
                      {activity.status === "success" ? <CheckCircle className="h-4 w-4" />
                        : activity.status === "pending" ? <Clock className="h-4 w-4" />
                          : <TrendingUp className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground leading-snug">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Items */}
          <Card className="lg:col-span-3">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">My Posted Items</CardTitle>
                  <CardDescription>Your active listings</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="gap-1 text-primary">View All<ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {userItems.slice(0, 4).map((item) => (
                  <Link key={item.id} to={`/item/${item.id}`} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 transition-colors group">
                    <img src={item.images[0]} alt={item.title} className="h-11 w-11 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant={item.type === "lost" ? "destructive" : "default"} className={`text-[10px] px-1.5 py-0 h-4 ${item.type === "found" ? "bg-success text-success-foreground" : ""}`}>
                          {item.type}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">{item.location}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="h-3 w-3" />{item.views}</div>
                      <Badge variant={item.status === "active" ? "secondary" : "outline"} className="text-[10px] mt-0.5">{item.status}</Badge>
                    </div>
                  </Link>
                ))}
                {userItems.length === 0 && (
                  <div className="text-center py-8">
                    <Package className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-3">No items posted yet</p>
                    <Button size="sm" asChild><Link to="/post"><Plus className="h-4 w-4 mr-2" />Post Item</Link></Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
