import { apiClient } from "./client";

export const authApi = {
  login: async (email, password) => {
    const res = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return res.data.data;
  },

  register: async (data) => {
    const res = await apiClient.post("/auth/register", data);
    return res.data.data;
  },

  getProfile: async () => {
    const res = await apiClient.get("/auth/profile");
    return res.data.data;
  },
};
