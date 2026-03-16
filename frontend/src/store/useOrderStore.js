import { create } from "zustand";
import { ordersApi } from "../utils/api";

export const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async (dateFilter = "all") => {
    set({ loading: true, error: null });
    try {
      const orders = await ordersApi.getAll(dateFilter);
      set({ orders, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  createOrder: async (data) => {
    const order = await ordersApi.create(data);
    set((s) => ({ orders: [order, ...s.orders] }));
    return order;
  },

  updateOrder: async (id, data) => {
    const updated = await ordersApi.update(id, data);
    set((s) => ({
      orders: s.orders.map((o) => (o._id === id ? updated : o)),
    }));
    return updated;
  },

  deleteOrder: async (id) => {
    await ordersApi.delete(id);
    set((s) => ({ orders: s.orders.filter((o) => o._id !== id) }));
  },
}));
