import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from '.' // Adjust if different
import type { CartLine } from '@/types'
import { cartApi } from './cartEndpoints'

// guest-side
const selectGuest = (s: RootState) => s.guestCart.items as CartLine[]

// server-side
const selectServer = createSelector(
  cartApi.endpoints.getCart.select(),
  r => (r.data ?? []) as CartLine[],
)

export const selectCartLines = createSelector(
  (s: RootState) => s.auth.user,  // truthy when logged in
  selectGuest,
  selectServer,
  (user, guest, server) => (user ? server : guest),
)
