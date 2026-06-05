import { apiClient } from "./client";
import type { Customer } from "@/types";

interface PaginatedResponse {
  success: boolean;
  data: Customer[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface SingleResponse {
  success: boolean;
  data: Customer;
}

export interface CustomerFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  status?: string;
}

export const customersApi = {
  getAll: async (filters: CustomerFilters = {}): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get<PaginatedResponse>(`/customers?${params}`);
    return res.data;
  },

  getById: async (id: number): Promise<Customer> => {
    const res = await apiClient.get<SingleResponse>(`/customers/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Customer>): Promise<Customer> => {
    const res = await apiClient.post<SingleResponse>("/customers", data);
    return res.data.data;
  },

  update: async (id: number, data: Partial<Customer>): Promise<Customer> => {
    const res = await apiClient.put<SingleResponse>(`/customers/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/customers/${id}`);
  },
};
