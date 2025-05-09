/* SERVER component – no 'use client' */
import type { ReactNode } from 'react'
import SidebarClient from '@/components/Sidebar'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* sidebar takes fixed space (48 = w‑48 or 16 when collapsed) */}
      <SidebarClient />

      {/* main content: center and cap at 6xl so it never spans the whole screen */}
      <main className="flex-1 overflow-auto py-6">
        <div className="max-w-6xl mx-auto px-6">{children}</div>
      </main>
    </div>
  )
}
