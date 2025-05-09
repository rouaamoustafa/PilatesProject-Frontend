// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import LogoutButton from './LogoutButton' 

export default function Navbar() {
  const { user, loading } = useAuth()

  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">Pilates Club</Link>
        <nav className="space-x-4">
          <Link href="/">Home</Link>

          {!loading && user && (
            <>
              {['superadmin', 'admin'].includes(user.role) && (
                <Link href="/dashboard">Dashboard</Link>
              )}
              {user.role === 'superadmin' && (
                <Link href="/admin-panel">Admin Panel</Link>
              )}
              <LogoutButton /> 
              <span className="ml-2 text-gray-600">Hi, {user.full_name}</span>
            </>
          )}

          {!user && !loading && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
