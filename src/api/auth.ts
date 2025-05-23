import api from "./config";
import type { User } from "@/types";

interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authApi = {
  // Register new user
  register: (data: RegisterDto) =>
    api.post<AuthResponse>("/api/auth/signup", data),

  // Login
  login: (credentials: LoginDto) =>
    api.post<AuthResponse>("/api/auth/login", credentials),

  // Get current user
  getCurrentUser: () => api.get<User>("/api/auth/me"),
};
