import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { customersApi } from "@/api/customers.api";
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

const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  company: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip_code: z.string().optional(),
  status: z.string().default("active"),
  notes: z.string().optional(),
});

export default function CustomerEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customers", id],
    queryFn: () => customersApi.getById(parseInt(id)),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
  });

  useEffect(() => {
    if (customer) {
      reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
        company: customer.company || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        state: customer.state || "",
        zip_code: customer.zip_code || "",
        status: customer.status,
        notes: customer.notes || "",
      });
    }
  }, [customer, reset]);

  const mutation = useMutation({
    mutationFn: (data) => customersApi.update(parseInt(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer updated successfully" });
      navigate("/customers");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/customers")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Customer</h1>
          <p className="text-muted-foreground">
            {customer?.customer_id} • {customer?.first_name}{" "}
            {customer?.last_name}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form
            onSubmit={handleSubmit((data) => mutation.mutate(data))}
            className="space-y-6"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input {...register("first_name")} />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input {...register("last_name")} />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input {...register("company")} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input {...register("email")} type="email" />
                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("phone")} />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={customer?.status}
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="lead">Lead</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input {...register("address")} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register("city")} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register("state")} />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input {...register("zip_code")} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Input {...register("notes")} />
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
                onClick={() => navigate("/customers")}
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
