export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "employee";
}

export interface Employee {
  id: number;
  employee_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department_id: number | null;
  department_name?: string;
  designation: string | null;
  salary: number | null;
  joining_date: string;
  status: "active" | "inactive" | "terminated";
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  customer_id: string;
  first_name: string;
  last_name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  status: "active" | "inactive" | "lead";
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  product_id: string;
  name: string;
  sku: string;
  category_id: number | null;
  category_name?: string;
  supplier_id: number | null;
  supplier_name?: string;
  description: string | null;
  quantity: number;
  min_stock_level: number;
  unit_price: number;
  cost_price: number | null;
  status: "in_stock" | "low_stock" | "out_of_stock";
  last_restocked: string | null;
  created_at: string;
  updated_at: string;
}

export interface StockMovement {
  id: number;
  product_id: number;
  product_name?: string;
  sku?: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference: string | null;
  notes: string | null;
  performed_by: number | null;
  performed_by_name?: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface DashboardStats {
  totalEmployees: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
}

export interface Department {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
}
