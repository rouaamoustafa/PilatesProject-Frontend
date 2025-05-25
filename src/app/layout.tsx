'use client'


import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import  Providers  from '@/store/Providers'
import LayoutClient from '@/components/LayoutClient'
import { ToastContainer } from 'react-toastify'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
//   display: 'swap',
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <LayoutClient>{children}</LayoutClient>
        </Providers>

        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
        />
      </body>
    </html>
  )
}
