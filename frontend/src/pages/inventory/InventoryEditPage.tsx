import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { inventoryApi } from "@/api/inventory.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category_id: z.string().optional(),
  supplier_id: z.string().optional(),
  description: z.string().optional(),
  quantity: z.string().default("0"),
  min_stock_level: z.string().default("10"),
  unit_price: z.string().min(1, "Unit price is required"),
  cost_price: z.string().optional(),
});

type ProductForm = z.infer<typeof productSchema>;

export default function InventoryEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ["inventory", id],
    queryFn: () => inventoryApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        sku: product.sku,
        category_id: product.category_id?.toString() || "",
        supplier_id: product.supplier_id?.toString() || "",
        description: product.description || "",
        quantity: product.quantity.toString(),
        min_stock_level: product.min_stock_level.toString(),
        unit_price: product.unit_price.toString(),
        cost_price: product.cost_price?.toString() || "",
      });
    }
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => inventoryApi.update(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast({ title: "Product updated successfully" });
      navigate("/inventory");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductForm) => {
    mutation.mutate({
      name: data.name,
      sku: data.sku,
      category_id: data.category_id ? parseInt(data.category_id) : undefined,
      supplier_id: data.supplier_id ? parseInt(data.supplier_id) : undefined,
      description: data.description || undefined,
      quantity: parseInt(data.quantity),
      min_stock_level: parseInt(data.min_stock_level),
      unit_price: parseFloat(data.unit_price),
      cost_price: data.cost_price ? parseFloat(data.cost_price) : undefined,
    });
  };

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/inventory")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Product</h1>
          <p className="text-muted-foreground">
            {product?.product_id} • {product?.name}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Product Name *</Label>
                <Input {...register("name")} />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>SKU *</Label>
                <Input {...register("sku")} />
                {errors.sku && (
                  <p className="text-xs text-destructive">
                    {errors.sku.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={product?.category_id?.toString() || ""}
                  onValueChange={(val) => setValue("category_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Electronics</SelectItem>
                    <SelectItem value="2">Office Supplies</SelectItem>
                    <SelectItem value="3">Furniture</SelectItem>
                    <SelectItem value="4">Software</SelectItem>
                    <SelectItem value="5">Hardware</SelectItem>
                    <SelectItem value="6">Networking</SelectItem>
                    <SelectItem value="7">Storage</SelectItem>
                    <SelectItem value="8">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Supplier</Label>
                <Select
                  value={product?.supplier_id?.toString() || ""}
                  onValueChange={(val) => setValue("supplier_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">TechDistributor Pro</SelectItem>
                    <SelectItem value="2">Office Essentials Co</SelectItem>
                    <SelectItem value="3">Global Electronics Ltd</SelectItem>
                    <SelectItem value="4">FurniturePlus Direct</SelectItem>
                    <SelectItem value="5">NetGear Solutions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input {...register("quantity")} type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label>Min Stock Level</Label>
                <Input {...register("min_stock_level")} type="number" min="0" />
              </div>
              <div className="space-y-2">
                <Label>Unit Price *</Label>
                <Input {...register("unit_price")} type="number" step="0.01" />
                {errors.unit_price && (
                  <p className="text-xs text-destructive">
                    {errors.unit_price.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Cost Price</Label>
                <Input {...register("cost_price")} type="number" step="0.01" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Description</Label>
                <Input {...register("description")} />
              </div>
            </div>
            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
