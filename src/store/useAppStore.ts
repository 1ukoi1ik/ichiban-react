import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { BrandKey, Cart, Profile } from '../data/types'

interface AppStore {
  screen: 'picker' | 'menu' | 'checkout' | 'success'
  brandKey: BrandKey
  currentCat: string
  cart: Cart
  profile: Profile | null
  orderNum: string | null
  userId: number | null

  setScreen: (s: AppStore['screen']) => void
  setBrandKey: (k: BrandKey) => void
  setCurrentCat: (c: string) => void
  addToCart: (id: number, name: string, price: number, img: string) => void
  removeFromCart: (id: number) => void
  setQty: (id: number, qty: number) => void
  clearCart: () => void
  setProfile: (p: Profile | null) => void
  setOrderNum: (n: string | null) => void
  setUserId: (id: number | null) => void
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      screen: 'picker',
      brandKey: 'sushi',
      currentCat: 'top',
      cart: {},
      profile: null,
      orderNum: null,
      userId: null,

      setScreen: (screen) => set({ screen }),
      setBrandKey: (brandKey) => set({ brandKey, currentCat: 'top', cart: {} }),
      setCurrentCat: (currentCat) => set({ currentCat }),

      addToCart: (id, name, price, img) =>
        set((s) => ({
          cart: {
            ...s.cart,
            [id]: s.cart[id]
              ? { ...s.cart[id], qty: s.cart[id].qty + 1 }
              : { name, price, qty: 1, img },
          },
        })),

      removeFromCart: (id) =>
        set((s) => {
          const next = { ...s.cart }
          if (next[id]) {
            if (next[id].qty > 1) next[id] = { ...next[id], qty: next[id].qty - 1 }
            else delete next[id]
          }
          return { cart: next }
        }),

      setQty: (id, qty) =>
        set((s) => {
          if (qty <= 0) {
            const next = { ...s.cart }
            delete next[id]
            return { cart: next }
          }
          return { cart: { ...s.cart, [id]: { ...s.cart[id], qty } } }
        }),

      clearCart: () => set({ cart: {} }),
      setProfile: (profile) => set({ profile }),
      setOrderNum: (orderNum) => set({ orderNum }),
      setUserId: (userId) => set({ userId }),
    }),
    { name: 'ichi_store', partialize: (s) => ({ cart: s.cart, brandKey: s.brandKey, orderNum: s.orderNum, userId: s.userId }) }
  )
)

export function cartTotal(cart: Cart): number {
  return Object.values(cart).reduce((sum, item) => sum + item.price * item.qty, 0)
}

export function cartCount(cart: Cart): number {
  return Object.values(cart).reduce((sum, item) => sum + item.qty, 0)
}
