import { Suspense } from 'react'
import dynamicImport from 'next/dynamic'

export const dynamic = 'force-dynamic'

const ContactClient = dynamicImport(
  () => import('@/components/ContactClient'),
  { ssr: false } // Remove suspense here!
)

export default function ContactServerPage() {
  return (
    <div className="mt-30 min-h-screen bg-[#fafaf8] py-16 px-4">
      <Suspense fallback={
        <div className="text-center py-20 text-gray-500">
          Loading contact form…
        </div>
      }>
        <ContactClient />
      </Suspense>
    </div>
  )
}
