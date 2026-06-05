import { apiClient } from "./client";
import type { Product, StockMovement, DashboardStats } from "@/types";

interface PaginatedResponse {
  success: boolean;
  data: Product[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface SingleResponse {
  success: boolean;
  data: Product;
}

export interface InventoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  category_id?: number;
  supplier_id?: number;
  status?: string;
}

export const inventoryApi = {
  getAll: async (
    filters: InventoryFilters = {},
  ): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get<PaginatedResponse>(`/inventory?${params}`);
    return res.data;
  },

  getById: async (id: number): Promise<Product> => {
    const res = await apiClient.get<SingleResponse>(`/inventory/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await apiClient.post<SingleResponse>("/inventory", data);
    return res.data.data;
  },

  update: async (id: number, data: Partial<Product>): Promise<Product> => {
    const res = await apiClient.put<SingleResponse>(`/inventory/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
  },

  getLowStock: async (): Promise<Product[]> => {
    const res = await apiClient.get<{ success: boolean; data: Product[] }>(
      "/inventory/low-stock",
    );
    return res.data.data;
  },

  getOutOfStock: async (): Promise<Product[]> => {
    const res = await apiClient.get<{ success: boolean; data: Product[] }>(
      "/inventory/out-of-stock",
    );
    return res.data.data;
  },
};

export const stockApi = {
  getAll: async (
    filters: {
      page?: number;
      limit?: number;
      product_id?: number;
      type?: string;
    } = {},
  ) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get<{
      success: boolean;
      data: StockMovement[];
      meta: any;
    }>(`/stock?${params}`);
    return res.data;
  },

  createMovement: async (data: {
    product_id: number;
    type: "in" | "out" | "adjustment";
    quantity: number;
    reference?: string;
    notes?: string;
  }) => {
    const res = await apiClient.post<{ success: boolean; data: any }>(
      "/stock",
      data,
    );
    return res.data.data;
  },

  getProductMovements: async (productId: number): Promise<StockMovement[]> => {
    const res = await apiClient.get<{
      success: boolean;
      data: StockMovement[];
    }>(`/stock/product/${productId}`);
    return res.data.data;
  },
};

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const res = await apiClient.get<{ success: boolean; data: DashboardStats }>(
      "/dashboard/stats",
    );
    return res.data.data;
  },

  getEmployeesByDepartment: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: { department: string; count: number }[];
    }>("/dashboard/employees-by-department");
    return res.data.data;
  },

  getInventoryByCategory: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: { category: string; count: number; total_quantity: number }[];
    }>("/dashboard/inventory-by-category");
    return res.data.data;
  },

  getRecentActivities: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>(
      "/dashboard/recent-activities",
    );
    return res.data.data;
  },

  getLatestEmployees: async () => {
    const res = await apiClient.get<{ success: boolean; data: any[] }>(
      "/dashboard/latest-employees",
    );
    return res.data.data;
  },

  getLowStockAlerts: async () => {
    const res = await apiClient.get<{ success: boolean; data: Product[] }>(
      "/dashboard/low-stock-alerts",
    );
    return res.data.data;
  },

  getCustomerGrowth: async () => {
    const res = await apiClient.get<{
      success: boolean;
      data: { month: string; count: number }[];
    }>("/dashboard/customer-growth");
    return res.data.data;
  },
};
