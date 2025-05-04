import { defineStore } from "pinia";
import axios from "axios";

interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  role: "USER" | "ADMIN";
}

interface AuthState {
  user: User | null;
  token: string;
  loading: boolean;
  error: string | null;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface SignupPayload {
  email: string;
  password: string;
  name: string;
  phoneNumber?: string;
}

const API_URL = "http://localhost:3001/api";

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
    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post(`${API_URL}/auth/login`, payload);
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        localStorage.setItem("token", token);

        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Login failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async signup(payload: SignupPayload) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Signup payload:", payload);
        const response = await axios.post(`${API_URL}/auth/signup`, payload);
        const { user, token } = response.data;

        this.user = user;
        this.token = token;
        localStorage.setItem("token", token);

        // Set axios default header
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (error: any) {
        this.error = error.response?.data?.error || "Signup failed";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    },

    async fetchCurrentUser() {
      if (!this.token) return;

      this.loading = true;
      try {
        const response = await axios.get(`${API_URL}/auth/me`);
        this.user = response.data;
      } catch (error) {
        this.logout();
      } finally {
        this.loading = false;
      }
    },
  },
});
