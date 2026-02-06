import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { mockItems, mockClaims, currentUser } from "@/data/mockData";
import { Plus, Search, FileText, MessageSquare, ArrowRight, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const displayUser = user || currentUser;

  const userItems = mockItems.filter((item) => item.userId === currentUser.id);
  const userClaims = mockClaims.filter((claim) => claim.userId === currentUser.id);
  const claimsOnUserItems = mockClaims.filter((claim) =>
    userItems.some((item) => item.id === claim.itemId)
  );

  const quickActions = [
    {
      title: "Post Lost Item",
      description: "Report something you've lost",
      icon: AlertCircle,
      href: "/post?type=lost",
      color: "bg-destructive/10 text-destructive",
    },
    {
      title: "Post Found Item",
      description: "Help someone find their stuff",
      icon: CheckCircle,
      href: "/post?type=found",
      color: "bg-success/10 text-success",
    },
    {
      title: "Browse Items",
      description: "Search for your belongings",
      icon: Search,
      href: "/browse",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "My Claims",
      description: "Track your claim status",
      icon: FileText,
      href: "/my-claims",
      color: "bg-warning/10 text-warning",
    },
  ];

  const recentActivity = [
    {
      type: "claim",
      message: "Your claim on 'Keys with Red Keychain' was accepted!",
      time: "2 hours ago",
      status: "success",
    },
    {
      type: "view",
      message: "Your 'iPhone 14 Pro' listing got 45 new views",
      time: "5 hours ago",
      status: "info",
    },
    {
      type: "claim",
      message: "New claim submitted on your 'Economics Textbook'",
      time: "1 day ago",
      status: "pending",
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Welcome back, {displayUser.name.split(" ")[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your items
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{userItems.length}</p>
              <p className="text-sm text-muted-foreground">My Posts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-warning">{userClaims.length}</p>
              <p className="text-sm text-muted-foreground">My Claims</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-success">{claimsOnUserItems.length}</p>
              <p className="text-sm text-muted-foreground">Claims on Items</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">
                {userItems.reduce((acc, item) => acc + item.views, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.href} to={action.href}>
                <Card className="h-full transition-all hover:shadow-card hover:-translate-y-1">
                  <CardContent className="p-4">
                    <div
                      className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${action.color} mb-3`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {action.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest updates on your items</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 pb-3 border-b last:border-0"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${activity.status === "success"
                          ? "bg-success/10 text-success"
                          : activity.status === "pending"
                            ? "bg-warning/10 text-warning"
                            : "bg-primary/10 text-primary"
                        }`}
                    >
                      {activity.status === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : activity.status === "pending" ? (
                        <Clock className="h-4 w-4" />
                      ) : (
                        <MessageSquare className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* My Items Preview */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">My Posted Items</CardTitle>
                  <CardDescription>Your active listings</CardDescription>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/profile" className="gap-1">
                    View All
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userItems.slice(0, 3).map((item) => (
                  <Link
                    key={item.id}
                    to={`/item/${item.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-foreground truncate">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant={item.type === "lost" ? "destructive" : "default"}
                          className={`text-xs ${item.type === "found" ? "bg-success" : ""
                            }`}
                        >
                          {item.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.views} views
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
                {userItems.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-sm text-muted-foreground mb-3">
                      You haven't posted any items yet
                    </p>
                    <Button size="sm" asChild>
                      <Link to="/post">
                        <Plus className="h-4 w-4 mr-2" />
                        Post Item
                      </Link>
                    </Button>
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
