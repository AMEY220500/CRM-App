import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { employeesApi } from "@/api/employees.api";
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
import { useEffect } from "react";

const employeeSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  department_id: z.string().optional(),
  designation: z.string().optional(),
  salary: z.string().optional(),
  joining_date: z.string().min(1, "Joining date is required"),
  status: z.string().default("active"),
  address: z.string().optional(),
});

type EmployeeForm = z.infer<typeof employeeSchema>;

export default function EmployeeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
  });

  useEffect(() => {
    if (employee) {
      reset({
        first_name: employee.first_name,
        last_name: employee.last_name,
        email: employee.email,
        phone: employee.phone || "",
        department_id: employee.department_id?.toString() || "",
        designation: employee.designation || "",
        salary: employee.salary?.toString() || "",
        joining_date: employee.joining_date?.split("T")[0] || "",
        status: employee.status,
        address: employee.address || "",
      });
    }
  }, [employee, reset]);

  const mutation = useMutation({
    mutationFn: (data: any) => employeesApi.update(parseInt(id!), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Employee updated successfully" });
      navigate("/employees");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to update employee",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmployeeForm) => {
    mutation.mutate({
      ...data,
      department_id: data.department_id
        ? parseInt(data.department_id)
        : undefined,
      salary: data.salary ? parseFloat(data.salary) : undefined,
    });
  };

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
          onClick={() => navigate("/employees")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Edit Employee</h1>
          <p className="text-muted-foreground">
            {employee?.employee_id} • {employee?.first_name}{" "}
            {employee?.last_name}
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                <Label>Email *</Label>
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
                <Label>Department</Label>
                <Select
                  value={employee?.department_id?.toString() || ""}
                  onValueChange={(val) => setValue("department_id", val)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Engineering</SelectItem>
                    <SelectItem value="2">Sales</SelectItem>
                    <SelectItem value="3">Marketing</SelectItem>
                    <SelectItem value="4">Human Resources</SelectItem>
                    <SelectItem value="5">Finance</SelectItem>
                    <SelectItem value="6">Operations</SelectItem>
                    <SelectItem value="7">Customer Support</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input {...register("designation")} />
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input {...register("salary")} type="number" />
              </div>
              <div className="space-y-2">
                <Label>Joining Date *</Label>
                <Input {...register("joining_date")} type="date" />
                {errors.joining_date && (
                  <p className="text-xs text-destructive">
                    {errors.joining_date.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={employee?.status}
                  onValueChange={(val) => setValue("status", val)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Address</Label>
                <Input {...register("address")} />
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
                onClick={() => navigate("/employees")}
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
