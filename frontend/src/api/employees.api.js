import { apiClient } from "./client";

export const employeesApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get(`/employees?${params}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/employees/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post("/employees", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/employees/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/employees/${id}`);
  },
};
