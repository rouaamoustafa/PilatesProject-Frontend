import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartLine } from '@/types' 

const safeParse = (): CartLine[] => {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('guest_cart') || '[]')
  } catch {
    return []
  }
}

const initialState = { items: safeParse() }

const persist = (items: CartLine[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('guest_cart', JSON.stringify(items))
  }
}

export const guestCartSlice = createSlice({
  name: 'guestCart',
  initialState,
  reducers: {
    addGuest(state, action: PayloadAction<CartLine>) {
      if (!state.items.some(l => l.course.id === action.payload.course.id)) {
        state.items.push(action.payload)
        persist(state.items)
      }
    },
    clearGuest(state) {
      state.items = []
      persist(state.items)
    },
  },
})

export const { addGuest, clearGuest } = guestCartSlice.actions
export default guestCartSlice.reducer
