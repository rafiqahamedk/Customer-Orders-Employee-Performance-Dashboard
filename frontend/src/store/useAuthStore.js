import { create } from "zustand";
import { authApi } from "../utils/api";

const stored = JSON.parse(localStorage.getItem("hx_user") || "null");

export const useAuthStore = create((set) => ({
  user: stored,
  loading: false,
  error: null,

  signUp: async (userData) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authApi.register({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        role: userData.role?.toLowerCase() || "employee",
      });
      localStorage.setItem("hx_token", token);
      localStorage.setItem("hx_user", JSON.stringify(user));
      set({ user, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed";
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { token, user } = await authApi.login({ email, password });
      localStorage.setItem("hx_token", token);
      localStorage.setItem("hx_user", JSON.stringify(user));
      set({ user, loading: false });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid credentials";
      set({ error: msg, loading: false });
      return { success: false, error: msg };
    }
  },

  signOut: () => {
    localStorage.removeItem("hx_token");
    localStorage.removeItem("hx_user");
    set({ user: null });
  },

  updateUser: (patch) => {
    set((s) => {
      const updated = { ...s.user, ...patch };
      localStorage.setItem("hx_user", JSON.stringify(updated));
      return { user: updated };
    });
  },
}));
