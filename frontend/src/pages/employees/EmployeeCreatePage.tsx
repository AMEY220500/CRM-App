import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
import { useToast } from "@/hooks/useToast";
import { ArrowLeft, Loader2 } from "lucide-react";

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

export default function EmployeeCreatePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<EmployeeForm>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      status: "active",
      joining_date: new Date().toISOString().split("T")[0],
    },
  });

  const mutation = useMutation({
    mutationFn: (data: any) => employeesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      toast({ title: "Employee created successfully" });
      navigate("/employees");
    },
    onError: (err: any) => {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to create employee",
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
          <h1 className="text-2xl font-bold">Add Employee</h1>
          <p className="text-muted-foreground">Create a new employee record</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name *</Label>
                <Input {...register("first_name")} placeholder="John" />
                {errors.first_name && (
                  <p className="text-xs text-destructive">
                    {errors.first_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Last Name *</Label>
                <Input {...register("last_name")} placeholder="Doe" />
                {errors.last_name && (
                  <p className="text-xs text-destructive">
                    {errors.last_name.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="john@example.com"
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
                <Label>Department</Label>
                <Select onValueChange={(val) => setValue("department_id", val)}>
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
                <Input
                  {...register("designation")}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label>Salary</Label>
                <Input
                  {...register("salary")}
                  type="number"
                  placeholder="75000"
                />
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
                  defaultValue="active"
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
                <Input
                  {...register("address")}
                  placeholder="123 Main St, City, State"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Employee
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
