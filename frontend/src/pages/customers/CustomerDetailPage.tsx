import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { customersApi } from "@/api/customers.api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Pencil, Mail, Phone, MapPin, Building } from "lucide-react";

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: customer, isLoading } = useQuery({
    queryKey: ["customers", id],
    queryFn: () => customersApi.getById(parseInt(id!)),
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  if (!customer)
    return (
      <div className="text-center py-8 text-muted-foreground">
        Customer not found
      </div>
    );

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/customers")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              {customer.first_name} {customer.last_name}
            </h1>
            <p className="text-muted-foreground">{customer.customer_id}</p>
          </div>
        </div>
        <Button onClick={() => navigate(`/customers/${id}/edit`)}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={Building}
              label="Company"
              value={customer.company || "—"}
            />
            <InfoRow icon={Mail} label="Email" value={customer.email || "—"} />
            <InfoRow icon={Phone} label="Phone" value={customer.phone || "—"} />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Status</span>
              {statusBadge(customer.status)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoRow
              icon={MapPin}
              label="Street"
              value={customer.address || "—"}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">City</span>
              <span className="text-sm font-medium">
                {customer.city || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">State</span>
              <span className="text-sm font-medium">
                {customer.state || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Zip</span>
              <span className="text-sm font-medium">
                {customer.zip_code || "—"}
              </span>
            </div>
          </CardContent>
        </Card>

        {customer.notes && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{customer.notes}</p>
            </CardContent>
          </Card>
        )}
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
