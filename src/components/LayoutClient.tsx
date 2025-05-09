'use client'

import { usePathname } from "next/navigation";
import Header from "@/components/Header"; 
import Footer from "@/components/Footer"; 
import Providers from "@/store/Providers";
import { useEffect } from "react";
import { store } from '@/store'    
import { fetchCurrentUser } from '@/store/slices/authSlice'



export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const  pathname  =    usePathname();   
  const  isDachboard  =    pathname?.startsWith('/dashboard');     
  const  isHeader  =    pathname?.startsWith('/dashboard');     
  
  useEffect(() => {
    console.log("LayoutClient mounted:", pathname);
  }, [pathname]);
  useEffect(() => {
    store.dispatch(fetchCurrentUser())
  }, [])
  return (
        < > 
           {!isHeader && <Header />}
           <main className="flex-1">{children}</main>
           {!isDachboard && <Footer /> }
         </>
  );
}
