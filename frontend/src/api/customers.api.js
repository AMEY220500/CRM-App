import { apiClient } from "./client";

export const customersApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get(`/customers?${params}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/customers/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post("/customers", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/customers/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/customers/${id}`);
  },
};
