import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import DashboardPage from "@/pages/dashboard/DashboardPage";
import EmployeeListPage from "@/pages/employees/EmployeeListPage";
import EmployeeCreatePage from "@/pages/employees/EmployeeCreatePage";
import EmployeeEditPage from "@/pages/employees/EmployeeEditPage";
import EmployeeDetailPage from "@/pages/employees/EmployeeDetailPage";
import CustomerListPage from "@/pages/customers/CustomerListPage";
import CustomerCreatePage from "@/pages/customers/CustomerCreatePage";
import CustomerEditPage from "@/pages/customers/CustomerEditPage";
import CustomerDetailPage from "@/pages/customers/CustomerDetailPage";
import InventoryListPage from "@/pages/inventory/InventoryListPage";
import InventoryCreatePage from "@/pages/inventory/InventoryCreatePage";
import InventoryEditPage from "@/pages/inventory/InventoryEditPage";
import StockPage from "@/pages/stock/StockPage";
import SettingsPage from "@/pages/settings/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Employees */}
        <Route path="/employees" element={<EmployeeListPage />} />
        <Route path="/employees/new" element={<EmployeeCreatePage />} />
        <Route path="/employees/:id" element={<EmployeeDetailPage />} />
        <Route path="/employees/:id/edit" element={<EmployeeEditPage />} />

        {/* Customers */}
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/customers/new" element={<CustomerCreatePage />} />
        <Route path="/customers/:id" element={<CustomerDetailPage />} />
        <Route path="/customers/:id/edit" element={<CustomerEditPage />} />

        {/* Inventory */}
        <Route path="/inventory" element={<InventoryListPage />} />
        <Route path="/inventory/new" element={<InventoryCreatePage />} />
        <Route path="/inventory/:id/edit" element={<InventoryEditPage />} />

        {/* Stock */}
        <Route path="/stock" element={<StockPage />} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
