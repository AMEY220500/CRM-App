import { apiClient } from "./client";
import type { User } from "@/types";

interface AuthResponse {
  token: string;
  user: User;
}

interface ApiWrapper<T> {
  success: boolean;
  data: T;
  message?: string;
}

export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiWrapper<AuthResponse>>("/auth/login", {
      email,
      password,
    });
    return res.data.data;
  },

  register: async (data: {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    role?: string;
  }): Promise<AuthResponse> => {
    const res = await apiClient.post<ApiWrapper<AuthResponse>>(
      "/auth/register",
      data,
    );
    return res.data.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await apiClient.get<ApiWrapper<User>>("/auth/profile");
    return res.data.data;
  },
};
