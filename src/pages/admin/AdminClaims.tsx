import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { mockClaims } from "@/data/mockData";
import { Search, CheckCircle, XCircle, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminClaims = () => {
    const { toast } = useToast();
    const [claims, setClaims] = useState(mockClaims);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedClaim, setSelectedClaim] = useState<typeof mockClaims[0] | null>(null);

    const filteredClaims = claims.filter((claim) => {
        const matchesSearch =
            claim.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            claim.reason.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || claim.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const handleUpdateStatus = (claimId: string, newStatus: "accepted" | "rejected") => {
        setClaims((prev) =>
            prev.map((claim) =>
                claim.id === claimId
                    ? { ...claim, status: newStatus }
                    : claim
            )
        );
        toast({
            title: newStatus === "accepted" ? "Claim accepted" : "Claim rejected",
            description: `The claim has been ${newStatus}.`,
        });
        setSelectedClaim(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "accepted":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            default:
                return "";
        }
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Claims Management</h1>
                    <p className="text-muted-foreground">
                        Review and manage item claims
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search claims..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="accepted">Accepted</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredClaims.length} claim{filteredClaims.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* Claims Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Claimant</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Reason</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClaims.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                                        No claims found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredClaims.map((claim) => (
                                    <TableRow key={claim.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={claim.user.avatar} alt={claim.user.name} />
                                                    <AvatarFallback>
                                                        {claim.user.name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-sm">{claim.user.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {claim.user.phone}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {claim.item.images[0] && (
                                                    <img
                                                        src={claim.item.images[0]}
                                                        alt={claim.item.title}
                                                        className="h-8 w-8 rounded object-cover"
                                                    />
                                                )}
                                                <p className="text-sm">{claim.item.title}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm max-w-xs truncate">{claim.reason}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p className="text-sm">
                                                {new Date(claim.createdAt).toLocaleDateString()}
                                            </p>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={getStatusColor(claim.status)}>
                                                {claim.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedClaim(claim)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                {claim.status === "pending" && (
                                                    <>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(claim.id, "accepted")}
                                                        >
                                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleUpdateStatus(claim.id, "rejected")}
                                                        >
                                                            <XCircle className="h-4 w-4 text-red-600" />
                                                        </Button>
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

            {/* Claim Details Dialog */}
            <Dialog open={!!selectedClaim} onOpenChange={() => setSelectedClaim(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Claim Details</DialogTitle>
                        <DialogDescription>Review the claim information</DialogDescription>
                    </DialogHeader>
                    {selectedClaim && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold mb-2">Item</h3>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    {selectedClaim.item.images[0] && (
                                        <img
                                            src={selectedClaim.item.images[0]}
                                            alt={selectedClaim.item.title}
                                            className="h-16 w-16 rounded object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="font-medium">{selectedClaim.item.title}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedClaim.item.description}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Claimant</h3>
                                <div className="flex items-center gap-3 p-3 border rounded-lg">
                                    <Avatar>
                                        <AvatarImage src={selectedClaim.user.avatar} alt={selectedClaim.user.name} />
                                        <AvatarFallback>
                                            {selectedClaim.user.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">{selectedClaim.user.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {selectedClaim.user.phone}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Reason</h3>
                                <p className="p-3 border rounded-lg text-sm">{selectedClaim.reason}</p>
                            </div>

                            {selectedClaim.details && (
                                <div>
                                    <h3 className="font-semibold mb-2">Additional Details</h3>
                                    <p className="p-3 border rounded-lg text-sm">{selectedClaim.details}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="font-semibold mb-2">Status</h3>
                                <Badge className={getStatusColor(selectedClaim.status)}>
                                    {selectedClaim.status}
                                </Badge>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        {selectedClaim?.status === "pending" && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(selectedClaim.id, "rejected")}
                                >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </Button>
                                <Button
                                    onClick={() => handleUpdateStatus(selectedClaim.id, "accepted")}
                                >
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Accept
                                </Button>
                            </>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminClaims;
