import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, qty = 1) => {
        const existing = get().items.find((i) => i.id === product.id);
        if (existing) {
          set({ items: get().items.map((i) => i.id === product.id ? { ...i, qty: i.qty + qty } : i) });
        } else {
          set({ items: [...get().items, { ...product, qty }] });
        }
      },

      removeItem: (id)         => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQty:  (id, qty)    => qty < 1 ? get().removeItem(id) : set({ items: get().items.map((i) => i.id === id ? { ...i, qty } : i) }),
      clearCart:  ()           => set({ items: [] }),

      get total()   { return get().items.reduce((s, i) => s + i.price * (1 - (i.discount||0)/100) * i.qty, 0); },
      get count()   { return get().items.reduce((s, i) => s + i.qty, 0); },
    }),
    { name: 'casitech-cart' }
  )
);

export default useCartStore;
