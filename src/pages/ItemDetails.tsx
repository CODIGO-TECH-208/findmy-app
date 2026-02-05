import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { mockItems, CATEGORIES, currentUser } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Eye,
  MessageSquare,
  CheckCircle,
  Edit,
  Trash2,
  Gift,
  Share2,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export default function ItemDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [claimReason, setClaimReason] = useState("");
  const [claimDetails, setClaimDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [claimDialogOpen, setClaimDialogOpen] = useState(false);

  const item = mockItems.find((i) => i.id === id);
  const category = CATEGORIES.find((c) => c.value === item?.category);
  const isOwner = item?.userId === currentUser.id;

  if (!item) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The item you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/browse")}>Browse Items</Button>
        </div>
      </Layout>
    );
  }

  const handleClaimSubmit = async () => {
    if (!claimReason.trim()) {
      toast({
        title: "Please provide a reason",
        description: "Tell us why you believe this item belongs to you.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setClaimDialogOpen(false);
    setClaimReason("");
    setClaimDetails("");

    toast({
      title: "Claim submitted!",
      description: "The owner will review your claim and respond soon.",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Share this link with others.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
              <img
                src={item.images[0]}
                alt={item.title}
                className="h-full w-full object-cover"
              />
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge
                  variant={item.type === "lost" ? "destructive" : "default"}
                  className={`text-sm ${
                    item.type === "found" ? "bg-success hover:bg-success/90" : ""
                  }`}
                >
                  {item.type === "lost" ? "Lost" : "Found"}
                </Badge>
                {item.reward && (
                  <Badge
                    variant="secondary"
                    className="bg-warning text-warning-foreground gap-1"
                  >
                    <Gift className="h-3 w-3" />
                    Reward
                  </Badge>
                )}
              </div>
              {item.status === "claimed" && (
                <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-xl px-6 py-3">
                    Claimed
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Item Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                  {item.title}
                </h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="text-lg">{category?.icon}</span>
                  <span>{category?.label}</span>
                </div>
              </div>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </div>

            <p className="text-foreground mb-6 leading-relaxed">
              {item.description}
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium text-foreground">{item.location}</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {item.type === "lost" ? "Date Lost" : "Date Found"}
                    </p>
                    <p className="font-medium text-foreground">
                      {format(new Date(item.date), "MMM d, yyyy")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                <span>{item.views} views</span>
              </div>
              <span>•</span>
              <span>
                Posted {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
              </span>
            </div>

            {/* Action Buttons */}
            {isOwner ? (
              <div className="flex gap-3">
                <Button className="flex-1 gap-2" asChild>
                  <Link to={`/item/${item.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    Edit Item
                  </Link>
                </Button>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : item.type === "found" && item.status === "active" ? (
              <Dialog open={claimDialogOpen} onOpenChange={setClaimDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full gap-2" size="lg">
                    <CheckCircle className="h-5 w-5" />
                    Claim This Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Claim This Item</DialogTitle>
                    <DialogDescription>
                      Tell us why you believe this item belongs to you. The finder will
                      review your claim.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reason">
                        Why do you believe this is yours? *
                      </Label>
                      <Textarea
                        id="reason"
                        placeholder="Describe identifying features, when/where you lost it..."
                        value={claimReason}
                        onChange={(e) => setClaimReason(e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="details">
                        Additional details (optional)
                      </Label>
                      <Textarea
                        id="details"
                        placeholder="Any other information that could help verify ownership..."
                        value={claimDetails}
                        onChange={(e) => setClaimDetails(e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setClaimDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleClaimSubmit} disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Submit Claim"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ) : item.type === "lost" ? (
              <Button className="w-full gap-2" size="lg" asChild>
                <Link to={`/messages?item=${item.id}`}>
                  <MessageSquare className="h-5 w-5" />
                  I Found This Item
                </Link>
              </Button>
            ) : null}

            {/* Posted By */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Posted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.user.avatar} alt={item.user.name} />
                    <AvatarFallback>
                      {item.user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-foreground">{item.user.name}</p>
                      {item.user.isVerified && (
                        <Badge variant="secondary" className="text-xs">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Member since{" "}
                      {format(new Date(item.user.memberSince), "MMMM yyyy")}
                    </p>
                  </div>
                  {!isOwner && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/messages?user=${item.userId}`}>
                        <MessageSquare className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
