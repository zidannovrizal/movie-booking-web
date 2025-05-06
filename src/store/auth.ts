import { defineStore } from "pinia";
import type { User } from "@/types";
import api from "@/api/config";

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface UpdateProfilePayload {
  name: string;
  email: string;
  phoneNumber?: string;
  profilePicture?: File | null;
}

interface UpdateProfileResponse {
  message: string;
  user: User;
}

interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

interface AuthState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: localStorage.getItem("token") || "",
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token && !!state.user,
    isAdmin: (state) => state.user?.role === "ADMIN",
  },

  actions: {
    setAuthHeader() {
      if (this.token) {
        api.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
      } else {
        delete api.defaults.headers.common["Authorization"];
      }
    },

    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<AuthResponse>(
          "/api/auth/login",
          payload
        );

        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
        this.setAuthHeader();

        return data.user;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async register(payload: RegisterPayload) {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await api.post<AuthResponse>(
          "/api/auth/signup",
          payload
        );

        this.user = data.user;
        this.token = data.token;
        localStorage.setItem("token", data.token);
        this.setAuthHeader();

        return data.user;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Registration failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateProfile(payload: UpdateProfilePayload) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Updating profile with payload:", payload);

        // Send data as JSON instead of FormData since we're not handling file upload yet
        const { data } = await api.put<UpdateProfileResponse>(
          "/api/auth/profile",
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Profile update response:", data);

        // Update the local user state with the new data
        this.user = {
          ...this.user,
          ...data.user,
        };

        return data.user;
      } catch (error: any) {
        console.error("Profile update error:", error?.response?.data || error);
        this.error = error.response?.data?.error || "Failed to update profile";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async changePassword(payload: ChangePasswordPayload) {
      this.loading = true;
      this.error = null;
      try {
        await api.put("/api/auth/password", payload);
      } catch (error: any) {
        this.error = error.response?.data?.error || "Failed to change password";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      this.setAuthHeader();
    },

    async fetchCurrentUser() {
      if (!this.token) return null;

      this.loading = true;
      try {
        const { data } = await api.get<User>("/api/auth/me");
        this.user = data;
        return data;
      } catch (error) {
        console.error("Error fetching user:", error);
        this.logout();
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async initialize() {
      this.setAuthHeader();
      if (this.token && !this.user) {
        try {
          await this.fetchCurrentUser();
        } catch (error) {
          this.logout();
        }
      }
    },
  },
});
