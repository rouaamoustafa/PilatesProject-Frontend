'use client'

import { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/store'
import SidebarClient from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // ─────────────── Hooks at top ───────────────
  const router = useRouter()
  const { user, status } = useAppSelector(s => s.auth)

  // ─────────────── Redirect subscribers & unauth ― in effect ───────────────
  useEffect(() => {
    if (status === 'succeeded') {
      if (!user || user.role === 'subscriber') {
        router.replace('/')
      }
    }
  }, [status, user, router])

  // ─────────────── Loading ───────────────
  if (status === 'idle' || status === 'loading') {
    return <div className="h-screen flex items-center justify-center">Loading…</div>
  }

  // ─────────────── Once we have a real user, render the dashboard shell ───────────────
  return (
    <div className="flex h-screen bg-gray-100">
      <SidebarClient />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  )
}
