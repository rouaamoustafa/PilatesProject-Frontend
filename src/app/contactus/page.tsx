// src/app/contactus/page.tsx
import { Suspense } from 'react'
import ContactClient from '@/components/ContactClient'

export const dynamic = 'force-dynamic'

export default function ContactServerPage() {
  return (
    <div className="mt-30 min-h-screen bg-[#fafaf8] py-16 px-4">
      <Suspense
        fallback={
          <div className="text-center py-20 text-gray-500">
            Loading contact form…
          </div>
        }
      >
        <ContactClient />
      </Suspense>
    </div>
  )
}