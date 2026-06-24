import { create } from 'zustand';
import api from '../api/axiosInstance';

const useCartStore = create((set) => ({
  cart: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });
    try {
      const res = await api.get('/CarItems/MyCart');
      set({ cart: res.data });
    } catch (err) {
      set({ cart: null });
    } finally {
      set({ loading: false });
    }
  },

  clearCart: () => set({ cart: null }),
}));

export default useCartStore;