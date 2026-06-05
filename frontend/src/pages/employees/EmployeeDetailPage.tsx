import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { employeesApi } from "@/api/employees.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Pencil,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employees", id],
    queryFn: () => employeesApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Employee not found
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="success">Active</Badge>;
      case "inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "terminated":
        return <Badge variant="destructive">Terminated</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/employees")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {employee.first_name} {employee.last_name}
            </h1>
            <p className="text-muted-foreground">{employee.employee_id}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/employees/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={employee.email} />
            <InfoRow
              icon={Phone}
              label="Phone"
              value={employee.phone || "Not provided"}
            />
            <InfoRow
              icon={MapPin}
              label="Address"
              value={employee.address || "Not provided"}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Work Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={Building}
              label="Department"
              value={employee.department_name || "Unassigned"}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Designation</span>
              <span className="text-sm font-medium">
                {employee.designation || "—"}
              </span>
            </div>
            <InfoRow
              icon={DollarSign}
              label="Salary"
              value={
                employee.salary ? `$${employee.salary.toLocaleString()}` : "—"
              }
            />
            <InfoRow
              icon={Calendar}
              label="Joined"
              value={new Date(employee.joining_date).toLocaleDateString()}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {statusBadge(employee.status)}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
