'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppSelector } from '@/store'
import {
  LogOut,
  Users,
  Dumbbell,
  Building2,
  LayoutDashboard,
  BookOpen,
  BarChart,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { logout } from '@/lib/logout'

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
  { label: 'Users',       href: '/dashboard',             roles: ['superadmin', 'admin'],                 icon: Users },
  { label: 'Instructors', href: '/dashboard/instructors', roles: ['superadmin', 'admin', 'gym_owner'],    icon: Dumbbell },
  { label: 'Gym Owners',  href: '/dashboard/gym-owners',  roles: ['superadmin', 'admin'],                 icon: Building2 },
  { label: 'Classes',     href: '/dashboard/classes',     roles: ['superadmin', 'admin', 'instructor', 'gym_owner'], icon: LayoutDashboard },
  { label: 'Programs',    href: '/dashboard/programs',    roles: ['superadmin', 'admin', 'instructor'],   icon: BookOpen },
  { label: 'Analytics',   href: '/dashboard/analytics',   roles: ['superadmin', 'admin'],                 icon: BarChart },
]

export default function SidebarClient() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const user     = useAppSelector((s) => s.auth.user)

  /* always render shell—even if user is null */
  const roleLower = (user?.role ?? '').toLowerCase() as Role
  const links     = NAV.filter((i) => i.roles.includes(roleLower))

  if (process.env.NODE_ENV === 'development') {
    console.log('Sidebar role:', roleLower)         // dev aid
  }

  return (
    <aside
      className={`bg-teal-900 text-teal-800 transition-all duration-300 flex flex-col
        ${collapsed ? 'w-16 min-w-16' : 'w-48'}`}
    >
      {/* header */}
      <div
        className={`px-4 py-6 border-b border-teal-700 flex items-center gap-2 ${
          collapsed ? 'justify-center' : ''
        }`}
      >
        {!collapsed && (
          <h2 className="text-xl font-semibold text-white">
            Hi,&nbsp;{user ? user.full_name : '…'}
          </h2>
        )}
        {!user && <Loader2 className="animate-spin w-4 h-4 text-white" />}
      </div>

      {/* nav */}
      <ul className="flex-1 px-2 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? 'bg-teal-800 text-white'
                    : 'text-gray-400 hover:bg-teal-700 hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon className="w-5 h-5" />
                {!collapsed && <span>{label}</span>}
              </Link>
            </li>
          )
        })}
      </ul>

      {/* collapse */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full py-2 border-t border-teal-700 hover:bg-teal-700 flex items-center justify-center"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* sign‑out */}
      <button
        onClick={logout}
        disabled={!user}
        className={`flex items-center gap-2 w-full px-4 py-3 text-sm border-t border-teal-700 ${
          user
            ? 'hover:bg-teal-700 hover:text-white text-gray-400'
            : 'text-teal-600 cursor-not-allowed'
        } ${collapsed ? 'justify-center' : ''}`}
      >
        <LogOut className="w-4 h-4" />
        {!collapsed && 'Sign out'}
      </button>
    </aside>
  )
}
