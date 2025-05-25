'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

import { useAuth } from '@/hooks/useAuth';
import { useGetCartQuery } from '@/store/cartEndpoints';
import type { RootState } from '@/store';
import LogoutButton from './LogoutButton';

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();

  const { user, loading: authLoading } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  const { data: serverCart = [] } = useGetCartQuery(undefined, {
    skip: !user || !hydrated,
  });

  const guestCartCount = useSelector((state: RootState) => state.guestCart.items.length);
  const itemsInCart = user && hydrated ? serverCart.length : guestCartCount;

  const onCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/cart');
  };

  const hideOn = ['/login', '/register'];
  if (hideOn.includes(pathname)) return null;

  if (!hydrated || authLoading) {
    return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 z-20">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>Loading...</div>
        </div>
      </header>
    );
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/aboutus', label: 'About Us' },
    { href: '/contactus', label: 'Contact' },
    { href: '/subscribe', label: 'Studios' },
    { href: '/book', label: 'Classes' },
    { href: '/joinInstructor', label: 'Instructors' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-6 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/finalLogoPilates.png" alt="Logo" className="h-10" />
        </Link>

        <nav className="flex-1 flex justify-center items-center gap-10 text-[#2e372c] text-base font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative group pb-1 ${pathname === href ? 'border-b border-[#2e372c]' : ''}`}
            >
              <span className="transition-colors duration-300">{label}</span>
              <span className={`absolute left-0 -bottom-0.5 h-[1px] bg-[#2e372c] transition-all duration-300 ${pathname === href ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={onCartClick}
            className="relative cursor-pointer text-[#2e372c] hover:text-[#4b5941]"
            aria-label="View cart"
          >
            <CalendarIcon className="w-6 h-6" />
            {itemsInCart > 0 && (
              <span className="absolute -top-2 -right-3 bg-[#2e372c] text-white text-xs rounded-full px-1.5">
                {itemsInCart}
              </span>
            )}
          </button>

          {!user ? (
            <Link
              href="/register"
              className="px-4 py-2 bg-[#2e372c] text-white rounded hover:bg-[#4b5941] text-sm"
            >
              Register for a Class
            </Link>
          ) : (
            <>
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <Link href="/dashboard" className="text-[#2e372c] hover:text-[#4b5941]">
                  Dashboard
                </Link>
              )}
              <span className="text-gray-600">Hi, {user.full_name}</span>
              <LogoutButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
