'use client'
import { useRouter } from 'next/navigation'
import { useAppDispatch } from '@/store'
import { clearUser } from '@/store/slices/authSlice'


export function useLogout() {
  const dispatch = useAppDispatch()
  const router = useRouter()

  const logout = () => {
    dispatch(clearUser())
    localStorage.removeItem('auth_token')
    router.replace('/')
  }

  return logout
}
