import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Claim } from "@/data/mockData";
import { useDatabaseStore } from "@/stores/databaseStore";
import { Search, CheckCircle, XCircle, Eye, FileText, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdminClaims = () => {
  const { toast } = useToast();
  const claims = useDatabaseStore((s) => s.claims);
  const updateClaim = useDatabaseStore((s) => s.updateClaim);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  const filteredClaims = claims.filter((claim) => {
    const matchesSearch = claim.item.title.toLowerCase().includes(searchQuery.toLowerCase()) || claim.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || claim.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = claims.filter((c) => c.status === "pending").length;
  const acceptedCount = claims.filter((c) => c.status === "accepted").length;

  const handleUpdateStatus = (claimId: string, newStatus: "accepted" | "rejected") => {
    updateClaim(claimId, { status: newStatus });
    toast({ title: newStatus === "accepted" ? "Claim accepted" : "Claim rejected" });
    setSelectedClaim(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Claims</h2>
            <p className="text-sm text-muted-foreground">Review and manage item ownership claims</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-0 bg-amber-500/10 text-amber-600 gap-1"><Clock className="h-3 w-3" />{pendingCount} pending</Badge>
            <Badge variant="outline" className="border-0 bg-emerald-500/10 text-emerald-600 gap-1"><CheckCircle className="h-3 w-3" />{acceptedCount} accepted</Badge>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search claims..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent><SelectItem value="all">All</SelectItem><SelectItem value="pending">Pending</SelectItem><SelectItem value="accepted">Accepted</SelectItem><SelectItem value="rejected">Rejected</SelectItem></SelectContent>
          </Select>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Claimant</TableHead>
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Reason</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Date</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClaims.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No claims found</TableCell></TableRow>
              ) : (
                filteredClaims.map((claim) => (
                  <TableRow key={claim.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={claim.user.avatar} alt={claim.user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">{claim.user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{claim.user.name}</p>
                          <p className="text-xs text-muted-foreground">{claim.user.phone}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {claim.item.images[0] && <img src={claim.item.images[0]} alt={claim.item.title} className="h-8 w-8 rounded-lg object-cover" />}
                        <p className="text-sm truncate max-w-[150px]">{claim.item.title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell"><p className="text-sm text-muted-foreground max-w-[200px] truncate">{claim.reason}</p></TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border-0 text-xs capitalize",
                        claim.status === "pending" ? "bg-amber-500/10 text-amber-600" :
                        claim.status === "accepted" ? "bg-emerald-500/10 text-emerald-600" :
                        "bg-destructive/10 text-destructive"
                      )}>{claim.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedClaim(claim)} className="h-8 px-2.5"><Eye className="h-4 w-4" /></Button>
                        {claim.status === "pending" && (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(claim.id, "accepted")} className="h-8 px-2.5 hover:text-emerald-500 hover:bg-emerald-500/10"><CheckCircle className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="sm" onClick={() => handleUpdateStatus(claim.id, "rejected")} className="h-8 px-2.5 hover:text-destructive hover:bg-destructive/10"><XCircle className="h-4 w-4" /></Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Claim Details</DialogTitle>
            <DialogDescription>Review full claim information</DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                {selectedClaim.item.images[0] && <img src={selectedClaim.item.images[0]} alt={selectedClaim.item.title} className="h-14 w-14 rounded-lg object-cover" />}
                <div><p className="font-medium text-foreground">{selectedClaim.item.title}</p><p className="text-sm text-muted-foreground">{selectedClaim.item.description}</p></div>
              </div>
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <Avatar className="h-10 w-10"><AvatarImage src={selectedClaim.user.avatar} /><AvatarFallback className="bg-primary/10 text-primary text-xs">{selectedClaim.user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback></Avatar>
                <div><p className="font-medium text-foreground">{selectedClaim.user.name}</p><p className="text-sm text-muted-foreground">{selectedClaim.user.phone}</p></div>
              </div>
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Reason</p>
                <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{selectedClaim.reason}</p>
              </div>
              {selectedClaim.details && (
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Details</p>
                  <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">{selectedClaim.details}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedClaim?.status === "pending" && (
              <>
                <Button variant="outline" onClick={() => handleUpdateStatus(selectedClaim.id, "rejected")} className="gap-1.5"><XCircle className="h-4 w-4" />Reject</Button>
                <Button onClick={() => handleUpdateStatus(selectedClaim.id, "accepted")} className="gap-1.5"><CheckCircle className="h-4 w-4" />Accept</Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminClaims;
