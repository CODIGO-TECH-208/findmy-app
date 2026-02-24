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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { mockItems, CATEGORIES } from "@/data/mockData";
import { Search, Trash2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const AdminItems = () => {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [items, setItems] = useState(mockItems);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

    const filteredItems = items.filter((item) => {
        const matchesSearch =
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesStatus = statusFilter === "all" || item.status === statusFilter;
        const matchesType = typeFilter === "all" || item.type === typeFilter;

        return matchesSearch && matchesStatus && matchesType;
    });

    const handleStatusChange = (itemId: string, newStatus: string) => {
        setItems((prev) =>
            prev.map((item) =>
                item.id === itemId
                    ? { ...item, status: newStatus as "active" | "claimed" | "resolved" }
                    : item
            )
        );
        toast({
            title: "Status updated",
            description: "Item status has been updated successfully.",
        });
    };

    const handleDeleteItem = () => {
        if (!deleteItemId) return;

        const item = items.find(i => i.id === deleteItemId);
        setItems((prev) => prev.filter((item) => item.id !== deleteItemId));
        toast({
            title: "Item deleted",
            description: `"${item?.title}" has been removed from the platform.`,
            variant: "destructive",
        });
        setDeleteItemId(null);
    };

    const getCategoryLabel = (category: string) => {
        const cat = CATEGORIES.find((c) => c.value === category);
        return cat ? `${cat.icon} ${cat.label}` : category;
    };

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Items Management</h1>
                    <p className="text-muted-foreground">
                        Manage all lost and found items
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Search items..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="found">Found</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full md:w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="claimed">Claimed</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="text-sm text-muted-foreground whitespace-nowrap">
                        {filteredItems.length} item{filteredItems.length !== 1 ? "s" : ""}
                    </div>
                </div>

                {/* Items Table */}
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Posted By</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredItems.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No items found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                {item.images[0] && (
                                                    <img
                                                        src={item.images[0]}
                                                        alt={item.title}
                                                        className="h-10 w-10 rounded object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {item.date}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={item.type === "lost" ? "secondary" : "default"}
                                            >
                                                {item.type === "lost" ? "Lost" : "Found"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{getCategoryLabel(item.category)}</TableCell>
                                        <TableCell>{item.location}</TableCell>
                                        <TableCell>{item.user.name}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={item.status}
                                                onValueChange={(value) => handleStatusChange(item.id, value)}
                                            >
                                                <SelectTrigger className="w-[120px]">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Active</SelectItem>
                                                    <SelectItem value="claimed">Claimed</SelectItem>
                                                    <SelectItem value="resolved">Resolved</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => navigate(`/item/${item.id}`)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteItemId(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete this item? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteItem}>
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
};

export default AdminItems;
