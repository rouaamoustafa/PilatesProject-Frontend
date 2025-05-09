// src/components/Header.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import LogoutButton from './LogoutButton';
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const show = pathname !== '/login' && pathname !== '/register';

  if (!show) return null;

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 z-20">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/finalLogoPilates.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-2xl font-bold text-teal-900">Pilates Club</span>
        </Link>

        <nav className="flex items-center space-x-6">
          <Link href="/" className="text-gray-700 hover:text-teal-900">
            Home
          </Link>

          {user ? (
            <>
              {user.role === 'superadmin' && (
                <>
                  <Link href="/superadmin" className="text-gray-700 hover:text-teal-900">
                    Super&nbsp;Admin
                  </Link>
                  <Link href="/dashboard" className="text-gray-700 hover:text-teal-900">
                    Dashboard
                  </Link>
                </>
              )}

              {['admin', 'superadmin'].includes(user.role) && (
                <Link href="/admin" className="text-gray-700 hover:text-teal-900">
                  Admin
                </Link>
              )}

              {['gym_owner', 'admin', 'superadmin'].includes(user.role) && (
                <Link href="/gym" className="text-gray-700 hover:text-teal-900">
                  My&nbsp;Gym
                </Link>
              )}

              <LogoutButton />
              <span className="ml-2 text-gray-600">Hi, {user.full_name}</span>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-700 hover:text-teal-900">
                Login
              </Link>
              {/* Styled Register button */}
              <Link
                href="/register"
                className="ml-4 px-4 py-2 bg-teal-900 text-white rounded hover:bg-teal-800 transition"
              >
                Register for a Class
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
