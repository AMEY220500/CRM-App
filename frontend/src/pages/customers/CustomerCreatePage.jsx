import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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

export default function CustomerCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: { status: "active" },
  });

  const mutation = useMutation({
    mutationFn: (data) => customersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      toast({ title: "Customer created successfully" });
      navigate("/customers");
    },
    onError: (err) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create customer",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

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
          <h1 className="text-2xl font-bold">Add Customer</h1>
          <p className="text-muted-foreground">Create a new customer record</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input {...register("first_name")} placeholder="Alex" />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input {...register("last_name")} placeholder="Thompson" />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Company</Label>
                <Input {...register("company")} placeholder="TechCorp Inc." />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="alex@company.com"
                />

                {errors.email && (
                  <p className="text-xs text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input {...register("phone")} placeholder="+1-555-0000" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  defaultValue="active"
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
                <Input {...register("address")} placeholder="123 Main St" />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input {...register("city")} placeholder="San Francisco" />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input {...register("state")} placeholder="CA" />
              </div>
              <div className="space-y-2">
                <Label>Zip Code</Label>
                <Input {...register("zip_code")} placeholder="94105" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Notes</Label>
                <Input
                  {...register("notes")}
                  placeholder="Any additional notes about this customer..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Customer
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
