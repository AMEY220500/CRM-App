import { apiClient } from "./client";
import type { Employee } from "@/types";

interface PaginatedResponse {
  success: boolean;
  data: Employee[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

interface SingleResponse {
  success: boolean;
  data: Employee;
}

export interface EmployeeFilters {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  department_id?: number;
  status?: string;
}

export const employeesApi = {
  getAll: async (filters: EmployeeFilters = {}): Promise<PaginatedResponse> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get<PaginatedResponse>(`/employees?${params}`);
    return res.data;
  },

  getById: async (id: number): Promise<Employee> => {
    const res = await apiClient.get<SingleResponse>(`/employees/${id}`);
    return res.data.data;
  },

  create: async (data: Partial<Employee>): Promise<Employee> => {
    const res = await apiClient.post<SingleResponse>("/employees", data);
    return res.data.data;
  },

  update: async (id: number, data: Partial<Employee>): Promise<Employee> => {
    const res = await apiClient.put<SingleResponse>(`/employees/${id}`, data);
    return res.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/employees/${id}`);
  },
};
