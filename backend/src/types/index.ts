export interface User {
  id: number;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: "admin" | "manager" | "employee";
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Employee {
  id: number;
  employee_id: string;
  user_id: number | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  department_id: number | null;
  designation: string | null;
  salary: number | null;
  joining_date: Date;
  status: "active" | "inactive" | "terminated";
  address: string | null;
  created_at: Date;
  updated_at: Date;
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
  created_at: Date;
  updated_at: Date;
}

export interface Product {
  id: number;
  product_id: string;
  name: string;
  sku: string;
  category_id: number | null;
  supplier_id: number | null;
  description: string | null;
  quantity: number;
  min_stock_level: number;
  unit_price: number;
  cost_price: number | null;
  status: "in_stock" | "low_stock" | "out_of_stock";
  last_restocked: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface StockMovement {
  id: number;
  product_id: number;
  type: "in" | "out" | "adjustment";
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference: string | null;
  notes: string | null;
  performed_by: number | null;
  created_at: Date;
}

export interface Department {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
}

export interface Supplier {
  id: number;
  name: string;
  contact_person: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: number;
  user_id: number | null;
  entity_type: "employee" | "customer" | "product" | "stock" | "user";
  entity_id: number | null;
  action: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export interface JwtPayload {
  userId: number;
  email: string;
  role: "admin" | "manager" | "employee";
}

export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
