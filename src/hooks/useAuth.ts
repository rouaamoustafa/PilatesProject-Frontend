'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store'
import { fetchCurrentUser } from '@/store/slices/authSlice'

export function useAuth() {
  const dispatch = useAppDispatch()
  const { user, status, error } = useAppSelector((s) => s.auth)

  useEffect(() => {
    if (status === 'idle') {
      console.log('[useAuth] fetching current user…')
      dispatch(fetchCurrentUser())
    }
  }, [status, dispatch])

  const loading = status === 'idle' || status === 'loading'

  // debug logs
  useEffect(() => {
    console.log('[useAuth] status →', status, ' user →', user)
  }, [status, user, error])

  return { user, loading, error: status === 'failed' }
}
