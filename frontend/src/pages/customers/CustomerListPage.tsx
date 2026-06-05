import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { customersApi, type CustomerFilters } from "@/api/customers.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/useToast";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CustomerListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [filters, setFilters] = useState<CustomerFilters>({
    page: 1,
    limit: 10,
  });
  const [searchInput, setSearchInput] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["customers", filters],
    queryFn: () => customersApi.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer deleted" });
      setDeleteId(null);
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to delete",
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    setFilters((prev) => ({ ...prev, search: searchInput, page: 1 }));
  };

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "lead":
        return <Badge variant="warning">Lead</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-muted-foreground">
            Manage your customer relationships
          </p>
        </div>
        <Button onClick={() => navigate("/customers/new")}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-1 min-w-[200px] gap-2">
              <Input
                placeholder="Search by name, company, email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button variant="secondary" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={filters.status || "all"}
              onValueChange={(val) =>
                setFilters((prev) => ({
                  ...prev,
                  status: val === "all" ? undefined : val,
                  page: 1,
                }))
              }
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((cust) => (
                    <TableRow
                      key={cust.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/customers/${cust.id}`)}
                    >
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {cust.first_name} {cust.last_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {cust.customer_id}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{cust.company || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {cust.email || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cust.phone || "—"}
                      </TableCell>
                      <TableCell>{statusBadge(cust.status)}</TableCell>
                      <TableCell className="text-right">
                        <div
                          className="flex justify-end gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              navigate(`/customers/${cust.id}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteId(cust.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((filters.page || 1) - 1) * (filters.limit || 10) + 1} to{" "}
            {Math.min(
              (filters.page || 1) * (filters.limit || 10),
              data?.meta?.total || 0,
            )}{" "}
            of {data?.meta?.total || 0}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) <= 1}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) - 1 }))
              }
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={(filters.page || 1) >= totalPages}
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: (prev.page || 1) + 1 }))
              }
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
