'use client'
import { Provider } from 'react-redux'
import { store, useAppDispatch } from './index'
import { useAuth } from '@/hooks/useAuth'
import { clearGuest } from './slices/guestCartSlice'
import React, { useEffect } from 'react'

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <GuestCartReset>{children}</GuestCartReset>
    </Provider>
  )
}

function GuestCartReset({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const dispatch = useAppDispatch()

  // once we know there is NO logged-in user, clear guest cart
  useEffect(() => {
    if (!loading && !user) {
      dispatch(clearGuest())
    }
  }, [user, loading, dispatch])

  return <>{children}</>
}