'use client'

import { useEffect, useRef } from 'react'
import { fetchCurrentUser } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store'

export function useAuth() {   // ← named export
  const dispatch = useAppDispatch()
  const user   = useAppSelector(s => s.auth.user)
  const status = useAppSelector(s => s.auth.status)
  const fetchedRef = useRef(false)

  useEffect(() => {
    if (!fetchedRef.current && status === 'idle') {
      fetchedRef.current = true
      dispatch(fetchCurrentUser())
    }
  }, [status, dispatch])

  return { user, loading: status === 'loading' }
}
