import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ItemGrid } from "@/components/items/ItemGrid";
import { mockItems, mockClaims, currentUser } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  LogOut,
  Camera,
  Bell,
  Mail,
  Shield,
  CheckCircle,
} from "lucide-react";
import { format } from "date-fns";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const displayUser = user || currentUser;

  const [notifications, setNotifications] = useState({
    email: true,
    claims: true,
    messages: true,
  });

  const userItems = mockItems.filter((item) => item.userId === currentUser.id);
  const userClaims = mockClaims.filter((claim) => claim.userId === currentUser.id);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={displayUser.avatar} alt={displayUser.name} />
                  <AvatarFallback className="text-2xl">
                    {displayUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h1 className="text-2xl font-bold text-foreground">
                    {displayUser.name}
                  </h1>
                  {displayUser.isVerified && (
                    <Badge
                      variant="secondary"
                      className="gap-1 bg-success/10 text-success"
                    >
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-1">{displayUser.phone}</p>
                <p className="text-sm text-muted-foreground">
                  Member since{" "}
                  {format(new Date(displayUser.memberSince), "MMMM yyyy")}
                </p>
              </div>
              <Button variant="outline" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="items" className="space-y-6">
          <TabsList>
            <TabsTrigger value="items">My Items ({userItems.length})</TabsTrigger>
            <TabsTrigger value="claims">My Claims ({userClaims.length})</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* My Items */}
          <TabsContent value="items">
            <ItemGrid
              items={userItems}
              emptyMessage="You haven't posted any items yet."
            />
          </TabsContent>

          {/* My Claims */}
          <TabsContent value="claims">
            <div className="space-y-4">
              {userClaims.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      You haven't made any claims yet.
                    </p>
                    <Button asChild>
                      <Link to="/browse">Browse Found Items</Link>
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userClaims.map((claim) => (
                  <Card key={claim.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={claim.item.images[0]}
                          alt={claim.item.title}
                          className="h-20 w-20 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium text-foreground">
                                {claim.item.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {claim.reason}
                              </p>
                            </div>
                            <Badge
                              variant={
                                claim.status === "accepted"
                                  ? "default"
                                  : claim.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={
                                claim.status === "accepted" ? "bg-success" : ""
                              }
                            >
                              {claim.status.charAt(0).toUpperCase() +
                                claim.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Claimed on{" "}
                            {format(new Date(claim.createdAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* Notifications */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, email: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label>Claim Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about claim status changes
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.claims}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, claims: checked }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Logout */}
              <Card>
                <CardContent className="p-6">
                  <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log Out
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
