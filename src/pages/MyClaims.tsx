import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockClaims, mockItems, currentUser } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";
import {
  Check,
  X,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";

export default function MyClaims() {
  const { toast } = useToast();

  const userItems = mockItems.filter((item) => item.userId === currentUser.id);
  const claimsOnMyItems = mockClaims.filter((claim) =>
    userItems.some((item) => item.id === claim.itemId)
  );
  const myClaims = mockClaims.filter((claim) => claim.userId === currentUser.id);

  const handleAcceptClaim = (claimId: string) => {
    toast({
      title: "Claim accepted",
      description: "The claimant will be notified. You can now chat with them.",
    });
  };

  const handleRejectClaim = (claimId: string) => {
    toast({
      title: "Claim rejected",
      description: "The claimant has been notified.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "accepted":
        return (
          <Badge className="bg-success hover:bg-success/90 gap-1">
            <CheckCircle className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Claims
          </h1>
          <p className="text-muted-foreground">
            Manage claims on your items and track your submitted claims
          </p>
        </div>

        <Tabs defaultValue="received" className="space-y-6">
          <TabsList>
            <TabsTrigger value="received">
              Claims Received ({claimsOnMyItems.length})
            </TabsTrigger>
            <TabsTrigger value="submitted">
              My Claims ({myClaims.length})
            </TabsTrigger>
          </TabsList>

          {/* Claims Received */}
          <TabsContent value="received">
            {claimsOnMyItems.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No claims on your items yet.
                  </p>
                  <Button asChild>
                    <Link to="/post">Post an Item</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {claimsOnMyItems.map((claim) => (
                  <Card key={claim.id}>
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        <img
                          src={claim.item.images[0]}
                          alt={claim.item.title}
                          className="h-24 w-24 md:h-28 md:w-28 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <Link
                                to={`/item/${claim.item.id}`}
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {claim.item.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Claim by {claim.user.name}
                              </p>
                            </div>
                            {getStatusBadge(claim.status)}
                          </div>

                          <div className="flex items-center gap-2 mb-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={claim.user.avatar} />
                              <AvatarFallback>
                                {claim.user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {claim.user.name}
                            </span>
                            {claim.user.isVerified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>

                          <Card className="bg-muted/50 mb-3">
                            <CardContent className="p-3">
                              <p className="text-sm font-medium mb-1">
                                Reason for claim:
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {claim.reason}
                              </p>
                              {claim.details && (
                                <p className="text-sm text-muted-foreground mt-2">
                                  <span className="font-medium">Details:</span>{" "}
                                  {claim.details}
                                </p>
                              )}
                            </CardContent>
                          </Card>

                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Submitted{" "}
                              {format(new Date(claim.createdAt), "MMM d, yyyy 'at' h:mm a")}
                            </p>
                            {claim.status === "pending" && (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="gap-1"
                                >
                                  <MessageSquare className="h-4 w-4" />
                                  Chat
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  className="gap-1"
                                  onClick={() => handleRejectClaim(claim.id)}
                                >
                                  <X className="h-4 w-4" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  className="gap-1 bg-success hover:bg-success/90"
                                  onClick={() => handleAcceptClaim(claim.id)}
                                >
                                  <Check className="h-4 w-4" />
                                  Accept
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* My Claims */}
          <TabsContent value="submitted">
            {myClaims.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't submitted any claims yet.
                  </p>
                  <Button asChild>
                    <Link to="/browse">Browse Found Items</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {myClaims.map((claim) => (
                  <Card key={claim.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={claim.item.images[0]}
                          alt={claim.item.title}
                          className="h-20 w-20 rounded-lg object-cover shrink-0"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <Link
                                to={`/item/${claim.item.id}`}
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {claim.item.title}
                              </Link>
                              <p className="text-sm text-muted-foreground">
                                Posted by {claim.item.user.name}
                              </p>
                            </div>
                            {getStatusBadge(claim.status)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            Your reason: {claim.reason}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">
                              Submitted{" "}
                              {format(new Date(claim.createdAt), "MMM d, yyyy")}
                            </p>
                            {claim.status === "accepted" && (
                              <Button size="sm" className="gap-1">
                                <MessageSquare className="h-4 w-4" />
                                Message Owner
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
