import { apiClient } from "./client";

export const inventoryApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get(`/inventory?${params}`);
    return res.data;
  },

  getById: async (id) => {
    const res = await apiClient.get(`/inventory/${id}`);
    return res.data.data;
  },

  create: async (data) => {
    const res = await apiClient.post("/inventory", data);
    return res.data.data;
  },

  update: async (id, data) => {
    const res = await apiClient.put(`/inventory/${id}`, data);
    return res.data.data;
  },

  delete: async (id) => {
    await apiClient.delete(`/inventory/${id}`);
  },

  getLowStock: async () => {
    const res = await apiClient.get("/inventory/low-stock");
    return res.data.data;
  },

  getOutOfStock: async () => {
    const res = await apiClient.get("/inventory/out-of-stock");
    return res.data.data;
  },
};

export const stockApi = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "")
        params.append(key, String(value));
    });
    const res = await apiClient.get(`/stock?${params}`);
    return res.data;
  },

  createMovement: async (data) => {
    const res = await apiClient.post("/stock", data);
    return res.data.data;
  },

  getProductMovements: async (productId) => {
    const res = await apiClient.get(`/stock/product/${productId}`);
    return res.data.data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    const res = await apiClient.get("/dashboard/stats");
    return res.data.data;
  },

  getEmployeesByDepartment: async () => {
    const res = await apiClient.get("/dashboard/employees-by-department");
    return res.data.data;
  },

  getInventoryByCategory: async () => {
    const res = await apiClient.get("/dashboard/inventory-by-category");
    return res.data.data;
  },

  getRecentActivities: async () => {
    const res = await apiClient.get("/dashboard/recent-activities");
    return res.data.data;
  },

  getLatestEmployees: async () => {
    const res = await apiClient.get("/dashboard/latest-employees");
    return res.data.data;
  },

  getLowStockAlerts: async () => {
    const res = await apiClient.get("/dashboard/low-stock-alerts");
    return res.data.data;
  },

  getCustomerGrowth: async () => {
    const res = await apiClient.get("/dashboard/customer-growth");
    return res.data.data;
  },
};
