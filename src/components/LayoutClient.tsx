'use client';

import { usePathname } from 'next/navigation';
import HomePage from '@/app/page';
import Header from './Header';
import Footer from './Footer';

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();              // 1st (and only) hook
  const isDashboard = pathname.startsWith('/dashboard');
  const isHome = pathname === '/';

  // exactly ONE return → hook order can’t change
  return (
    <>
      {!isDashboard && <Header />}

      <main>{isHome ? <HomePage /> : children}</main>

      {!isDashboard && <Footer />}
    </>
  );
}
