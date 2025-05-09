// src/components/LogoutButton.tsx
'use client'
import { logout } from '@/lib/logout'

export default function LogoutButton() {
  return (
    <button onClick={logout} className="text-red-600">
      Logout
    </button>
  )
}
