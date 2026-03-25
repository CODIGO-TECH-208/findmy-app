import { useState } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useDatabaseStore } from "@/stores/databaseStore";
import { Search, CheckCircle, XCircle, Trash2, Users, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AdminUsers = () => {
  const { toast } = useToast();
  const users = useDatabaseStore((s) => s.users);
  const updateUser = useDatabaseStore((s) => s.updateUser);
  const deleteUser = useDatabaseStore((s) => s.deleteUser);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  const filteredUsers = users
    .filter((u) => u.role !== "admin")
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const verifiedCount = filteredUsers.filter((u) => u.isVerified).length;

  const handleVerifyUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    updateUser(userId, { isVerified: !user?.isVerified });
    toast({ title: user?.isVerified ? "User unverified" : "User verified", description: `${user?.name} has been ${user?.isVerified ? "unverified" : "verified"}.` });
  };

  const handleDeleteUser = () => {
    if (!deleteUserId) return;
    const user = users.find((u) => u.id === deleteUserId);
    deleteUser(deleteUserId);
    toast({ title: "User deleted", description: `${user?.name} has been removed.`, variant: "destructive" });
    setDeleteUserId(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Users</h2>
            <p className="text-sm text-muted-foreground">Manage platform users and verification status</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium text-foreground">{filteredUsers.length}</span>
              <span className="text-muted-foreground">users</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 px-3 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="font-medium text-emerald-600">{verifiedCount}</span>
              <span className="text-emerald-600/70">verified</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
        </div>

        {/* Table */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Phone</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Member Since</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">{user.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium text-foreground">{user.name}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{user.phone}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-0 text-xs",
                          user.isVerified ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                        )}
                      >
                        {user.isVerified ? "Verified" : "Unverified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.memberSince}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => handleVerifyUser(user.id)} className="h-8 px-2.5">
                          {user.isVerified ? <XCircle className="h-4 w-4 text-muted-foreground" /> : <CheckCircle className="h-4 w-4 text-emerald-500" />}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setDeleteUserId(user.id)} className="h-8 px-2.5 hover:text-destructive hover:bg-destructive/10">
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

      <AlertDialog open={!!deleteUserId} onOpenChange={() => setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. The user and all associated data will be permanently removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminUsers;
