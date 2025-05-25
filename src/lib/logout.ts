import { store, useAppDispatch } from '@/store'
import api from '@/store/api/axios'
import { clearUser } from '@/store/slices/authSlice'
import { useRouter } from 'next/navigation';

export const logout = async () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return () => {
    localStorage.removeItem('auth_token')
    dispatch(clearUser())
    router.push('/')
  }
  };

  

