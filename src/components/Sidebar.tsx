'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store'
import { useLogout } from '@/hooks/useLogout'
import {
  Users,
  Dumbbell,
  Building2,
  LayoutDashboard,
  BookOpen,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Loader2,
  LogOut,
} from 'lucide-react'

type Role =
  | 'superadmin'
  | 'admin'
  | 'gym_owner'
  | 'instructor'
  | 'subscriber'

interface NavItem {
  label: string
  href: string
  roles: Role[]
  icon: React.ElementType
}

const NAV: NavItem[] = [
  { label: 'Users',       href: '/dashboard',             roles: ['superadmin','admin'],                                       icon: Users },
  { label: 'Instructors', href: '/dashboard/instructors', roles: ['superadmin','admin','gym_owner'],                          icon: Dumbbell },
  { label: 'Admins',      href: '/dashboard/admin',       roles: ['superadmin'],                                               icon: Dumbbell },
  { label: 'Gym Owners',  href: '/dashboard/gym-owners',  roles: ['superadmin','admin'],                                       icon: Building2 },
  { label: 'Classes',     href: '/dashboard/classes',     roles: ['superadmin','admin','instructor','gym_owner'],             icon: LayoutDashboard },
  { label: 'Programs',    href: '/dashboard/programs',    roles: ['superadmin','admin','instructor'],                         icon: BookOpen },
  { label: 'Analytics',   href: '/dashboard/analytics',   roles: ['superadmin','admin'],                                       icon: BarChart },
  { label: 'Profile',     href: '/dashboard/profile',     roles: ['instructor','gym_owner'],                                  icon: BarChart },
]

export default function SidebarClient() {
  // ─────────────── 1) Hooks at top ───────────────
  const pathname = usePathname()
  const logout   = useLogout()
  const { user, status } = useAppSelector(s => s.auth)
  const [collapsed, setCollapsed] = useState(false)

  // ─────────────── 2) Loading state ───────────────
  if (status === 'idle' || status === 'loading') {
    return (
      <aside className={`bg-teal-900 ${collapsed ? 'w-16' : 'w-48'} flex items-center justify-center`}>
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </aside>
    )
  }

  // ─────────────── 3) No sidebar for unauth or subscriber ───────────────
  if (!user || user.role === 'subscriber') {
    return null
  }

  // ─────────────── 4) Build nav for allowed roles ───────────────
  const role = user.role as Role
  const links = NAV.filter(item => item.roles.includes(role))
  const isActive = (href: string) =>
    href === '/dashboard'
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/')

  return (
    <aside className={`bg-teal-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-48'}`}>
      {/* Header */}
      <div className={`px-4 py-6 border-b border-teal-800 flex items-center ${collapsed ? 'justify-center' : ''}`}>
        {!collapsed && <span className="font-semibold">Hi, {user.full_name}</span>}
      </div>

      {/* Nav Links */}
      <ul className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'bg-teal-800 text-white'
                  : 'text-gray-400 hover:bg-teal-700 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-5 h-5" />
              {!collapsed && label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full py-2 border-t border-teal-800 hover:bg-teal-700 flex items-center justify-center"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Sign‐Out */}
      <button
        onClick={logout}
        className="flex items-center gap-2 w-full px-4 py-3 text-sm border-t border-teal-800 hover:bg-teal-700 justify-center"
      >
        <LogOut className="w-4 h-4" />
        {!collapsed && 'Sign out'}
      </button>
    </aside>
  )
}
