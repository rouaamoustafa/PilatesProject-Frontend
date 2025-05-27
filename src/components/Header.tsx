'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Menu, X } from 'lucide-react';
import { useSelector } from 'react-redux';

import { useAuth } from '@/hooks/useAuth';
import { useGetCartQuery } from '@/store/cartEndpoints';
import type { RootState } from '@/store';
import LogoutButton from './LogoutButton';
import { CartTrigger } from './CartTrigger';
import { CartDrawer } from './CartDrawer';

export default function Header() {
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const { data: serverCart = [] } = useGetCartQuery(undefined, {
    skip: !user || !hydrated,
  });

  const guestCartCount = useSelector((state: RootState) => state.guestCart.items.length);
  const itemsInCart = user && hydrated ? serverCart.length : guestCartCount;

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
    <header className="fixed top-0 left-0 w-full bg-white shadow-md py-4 px-4 sm:px-6 z-20">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <img src="/images/finalLogoPilates.png" alt="Logo" className="h-10" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-8 text-[#2e372c] text-base font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`relative group pb-1 ${pathname === href ? 'border-b border-[#2e372c]' : ''}`}
            >
              <span className="transition-colors duration-300">{label}</span>
              <span
                className={`absolute left-0 -bottom-0.5 h-[1px] bg-[#2e372c] transition-all duration-300 ${
                  pathname === href ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              />
            </Link>
          ))}
        </nav>

        {/* Hamburger (Mobile Menu Button) */}
        <button
          className="md:hidden ml-2 text-[#2e372c] hover:text-[#4b5941] p-2"
          onClick={() => setMobileMenuOpen((v) => !v)}
          aria-label="Open menu"
        >
          {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <CartTrigger onOpen={() => setCartOpen(true)} />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

          <Link href="/login" className="relative cursor-pointer text-[#2e372c] hover:text-[#4b5941]">
            <User className="w-6 h-6" />
          </Link>

          {!user ? (
            <Link
              href="/book"
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

      {/* Mobile Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-full z-30 bg-black bg-opacity-40 transition-opacity duration-200 ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col py-8 px-6 space-y-4`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
            <img src="/images/finalLogoPilates.png" alt="Logo" className="h-10" />
          </Link>
          <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X className="w-7 h-7 text-[#2e372c]" />
          </button>
        </div>
        {/* Drawer Nav */}
        <nav className="flex flex-col gap-6 text-[#2e372c] text-base font-semibold">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`pb-1 ${pathname === href ? 'border-b border-[#2e372c]' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 flex flex-col gap-4">
          <CartTrigger onOpen={() => { setCartOpen(true); setMobileMenuOpen(false); }} />
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

          <Link
            href="/login"
            className="relative cursor-pointer text-[#2e372c] hover:text-[#4b5941] flex items-center gap-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            <User className="w-6 h-6" /> Login
          </Link>

          {!user ? (
            <Link
              href="/book"
              className="px-4 py-2 bg-[#2e372c] text-white rounded hover:bg-[#4b5941] text-sm text-center"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register for a Class
            </Link>
          ) : (
            <>
              {(user.role === 'superadmin' || user.role === 'admin') && (
                <Link
                  href="/dashboard"
                  className="text-[#2e372c] hover:text-[#4b5941]"
                  onClick={() => setMobileMenuOpen(false)}
                >
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
