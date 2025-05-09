// src/lib/logout.ts
import { store } from '@/store'
import { clearUser } from '@/store/slices/authSlice'

export const logout = async () => {
  await fetch('http://localhost:3000/auth/logout', {
    method: 'POST',
    credentials: 'include',
  })

  store.dispatch(clearUser())          // <-- reset Redux
  window.location.replace('/') 
}
