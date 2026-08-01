import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/api/inventory.api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  UserCircle,
  Package,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
];

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats"],
    queryFn: dashboardApi.getStats,
  });

  const { data: empByDept } = useQuery({
    queryKey: ["dashboard", "employees-by-department"],
    queryFn: dashboardApi.getEmployeesByDepartment,
  });

  const { data: invByCategory } = useQuery({
    queryKey: ["dashboard", "inventory-by-category"],
    queryFn: dashboardApi.getInventoryByCategory,
  });

  const { data: customerGrowth } = useQuery({
    queryKey: ["dashboard", "customer-growth"],
    queryFn: dashboardApi.getCustomerGrowth,
  });

  const { data: recentActivities } = useQuery({
    queryKey: ["dashboard", "recent-activities"],
    queryFn: dashboardApi.getRecentActivities,
  });

  const { data: lowStockAlerts } = useQuery({
    queryKey: ["dashboard", "low-stock-alerts"],
    queryFn: dashboardApi.getLowStockAlerts,
  });

  const { data: latestEmployees } = useQuery({
    queryKey: ["dashboard", "latest-employees"],
    queryFn: dashboardApi.getLatestEmployees,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Business overview and analytics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Employees"
          value={stats?.totalEmployees}
          icon={Users}
          loading={statsLoading}
        />

        <StatsCard
          title="Total Customers"
          value={stats?.totalCustomers}
          icon={UserCircle}
          loading={statsLoading}
        />

        <StatsCard
          title="Total Products"
          value={stats?.totalProducts}
          icon={Package}
          loading={statsLoading}
        />

        <StatsCard
          title="Low Stock Items"
          value={
            (stats?.lowStockProducts || 0) + (stats?.outOfStockProducts || 0)
          }
          icon={AlertTriangle}
          loading={statsLoading}
          variant="warning"
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Employees by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Employees by Department</CardTitle>
          </CardHeader>
          <CardContent>
            {empByDept && empByDept.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={empByDept}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />

                  <XAxis
                    dataKey="department"
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />

                  <YAxis
                    tick={{
                      fontSize: 12,
                      fill: "hsl(var(--muted-foreground))",
                    }}
                  />

                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />

                  <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Inventory by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Inventory by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {invByCategory && invByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={invByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    dataKey="total_quantity"
                    nameKey="category"
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {invByCategory.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[250px] flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Customer Growth Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Customer Growth
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerGrowth && customerGrowth.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={customerGrowth}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />

                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />

                <YAxis
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />

                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />

                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>

      {/* Bottom Widgets */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Activities */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities?.slice(0, 6).map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div className="mt-0.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.first_name} {activity.last_name} •{" "}
                      {new Date(activity.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">
                  No recent activities
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Latest Employees */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Latest Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {latestEmployees?.map((emp) => (
                <div key={emp.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {emp.first_name[0]}
                      {emp.last_name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {emp.department_name}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-[10px]">
                    {emp.designation}
                  </Badge>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">No employees</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockAlerts?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sku}
                    </p>
                  </div>
                  <Badge
                    variant={product.quantity === 0 ? "destructive" : "warning"}
                  >
                    {product.quantity === 0
                      ? "Out"
                      : product.quantity + " left"}
                  </Badge>
                </div>
              )) || (
                <p className="text-sm text-muted-foreground">
                  All items in stock
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, loading, variant }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-2xl font-bold">{value ?? 0}</p>
            )}
          </div>
          <div
            className={`h-10 w-10 rounded-lg flex items-center justify-center ${variant === "warning" ? "bg-yellow-500/10" : "bg-primary/10"}`}
          >
            <Icon
              className={`h-5 w-5 ${variant === "warning" ? "text-yellow-500" : "text-primary"}`}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
