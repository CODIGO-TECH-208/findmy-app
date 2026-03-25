import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CATEGORIES } from "@/data/mockData";
import { useDatabaseStore } from "@/stores/databaseStore";
import { Search, Trash2, Eye, Package, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const AdminItems = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const items = useDatabaseStore((s) => s.items);
  const updateItem = useDatabaseStore((s) => s.updateItem);
  const deleteItem = useDatabaseStore((s) => s.deleteItem);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleStatusChange = (itemId: string, newStatus: string) => {
    updateItem(itemId, { status: newStatus as "active" | "claimed" | "resolved" });
    toast({ title: "Status updated" });
  };

  const handleDeleteItem = () => {
    if (!deleteItemId) return;
    const item = items.find((i) => i.id === deleteItemId);
    deleteItem(deleteItemId);
    toast({ title: "Item deleted", description: `"${item?.title}" removed.`, variant: "destructive" });
    setDeleteItemId(null);
  };

  const getCategoryLabel = (category: string) => {
    const cat = CATEGORIES.find((c) => c.value === category);
    return cat ? `${cat.icon} ${cat.label}` : category;
  };

  const activeCount = items.filter((i) => i.status === "active").length;
  const lostCount = items.filter((i) => i.type === "lost").length;
  const foundCount = items.filter((i) => i.type === "found").length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Items</h2>
            <p className="text-sm text-muted-foreground">Manage all lost and found listings</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="border-0 bg-muted gap-1"><Package className="h-3 w-3" />{items.length} total</Badge>
            <Badge variant="outline" className="border-0 bg-destructive/10 text-destructive">{lostCount} lost</Badge>
            <Badge variant="outline" className="border-0 bg-emerald-500/10 text-emerald-600">{foundCount} found</Badge>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
          </div>
          <div className="flex items-center gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Types</SelectItem><SelectItem value="lost">Lost</SelectItem><SelectItem value="found">Found</SelectItem></SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent><SelectItem value="all">All Status</SelectItem><SelectItem value="active">Active</SelectItem><SelectItem value="claimed">Claimed</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold hidden md:table-cell">Category</TableHead>
                <TableHead className="font-semibold hidden lg:table-cell">Location</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="h-32 text-center text-muted-foreground">No items found</TableCell></TableRow>
              ) : (
                filteredItems.map((item) => (
                  <TableRow key={item.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {item.images[0] ? (
                          <img src={item.images[0]} alt={item.title} className="h-10 w-10 rounded-lg object-cover" />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center"><Package className="h-4 w-4 text-muted-foreground" /></div>
                        )}
                        <div className="min-w-0">
                          <p className="font-medium text-foreground truncate max-w-[200px]">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("border-0 text-xs", item.type === "lost" ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600")}>
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">{getCategoryLabel(item.category)}</TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">{item.location}</TableCell>
                    <TableCell>
                      <Select value={item.status} onValueChange={(v) => handleStatusChange(item.id, v)}>
                        <SelectTrigger className="w-[110px] h-8 text-xs"><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="active">Active</SelectItem><SelectItem value="claimed">Claimed</SelectItem><SelectItem value="resolved">Resolved</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/item/${item.id}`)} className="h-8 px-2.5"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteItemId(item.id)} className="h-8 px-2.5 hover:text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!deleteItemId} onOpenChange={() => setDeleteItemId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete item?</AlertDialogTitle><AlertDialogDescription>This action cannot be undone.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDeleteItem} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminItems;
