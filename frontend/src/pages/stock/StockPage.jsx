import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { stockApi } from "@/api/inventory.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/useToast";
import {
  Plus,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function StockPage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [typeFilter, setTypeFilter] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [formData, setFormData] = useState({
    product_id: "",
    type: "in",
    quantity: "",
    reference: "",
    notes: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["stock-movements", page, typeFilter],
    queryFn: () =>
      stockApi.getAll({ page, limit: 15, type: typeFilter || undefined }),
  });

  const mutation = useMutation({
    mutationFn: stockApi.createMovement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast({ title: "Stock movement recorded" });
      setShowDialog(false);
      setFormData({
        product_id: "",
        type: "in",
        quantity: "",
        reference: "",
        notes: "",
      });
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to record movement",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.product_id || !formData.quantity) return;
    mutation.mutate({
      product_id: parseInt(formData.product_id),
      type: formData.type,
      quantity: parseInt(formData.quantity),
      reference: formData.reference || undefined,
      notes: formData.notes || undefined,
    });
  };

  const typeBadge = (type) => {
    switch (type) {
      case "in":
        return (
          <Badge variant="success" className="gap-1">
            <ArrowDownLeft className="h-3 w-3" />
            Stock In
          </Badge>
        );
      case "out":
        return (
          <Badge variant="destructive" className="gap-1">
            <ArrowUpRight className="h-3 w-3" />
            Stock Out
          </Badge>
        );
      case "adjustment":
        return (
          <Badge variant="secondary" className="gap-1">
            <RefreshCw className="h-3 w-3" />
            Adjustment
          </Badge>
        );
      default:
        return <Badge>{type}</Badge>;
    }
  };

  const totalPages = data?.meta?.totalPages || 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">
            Track inventory inflows, outflows, and adjustments
          </p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Record Movement
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardContent className="p-4">
          <Select
            value={typeFilter || "all"}
            onValueChange={(val) => {
              setTypeFilter(val === "all" ? "" : val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Movement Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="in">Stock In</SelectItem>
              <SelectItem value="out">Stock Out</SelectItem>
              <SelectItem value="adjustment">Adjustment</SelectItem>
            </SelectContent>
          </Select>
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
                  <TableHead>Product</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Before</TableHead>
                  <TableHead className="text-right">After</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data && data.data.length > 0 ? (
                  data.data.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{movement.product_name}</p>
                          <p className="text-xs text-muted-foreground">
                            {movement.sku}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{typeBadge(movement.type)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {movement.quantity}
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {movement.previous_quantity}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {movement.new_quantity}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {movement.reference || "—"}
                      </TableCell>
                      <TableCell>{movement.performed_by_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(movement.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No stock movements found
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
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Record Movement Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Stock Movement</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Product ID</Label>
              <Input
                type="number"
                placeholder="Enter product ID (e.g., 1, 2, 3...)"
                value={formData.product_id}
                onChange={(e) =>
                  setFormData({ ...formData, product_id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select
                value={formData.type}
                onValueChange={(val) => setFormData({ ...formData, type: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Stock In (Receiving)</SelectItem>
                  <SelectItem value="out">Stock Out (Issuing)</SelectItem>
                  <SelectItem value="adjustment">
                    Adjustment (Set quantity)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min="1"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input
                placeholder="PO-2024-001 or REQ-2024-001"
                value={formData.reference}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Input
                placeholder="Optional notes..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                Record Movement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
