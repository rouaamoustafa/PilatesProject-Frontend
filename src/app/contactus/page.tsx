// src/app/contactus/page.tsx
import dynamic from 'next/dynamic'

// If you need to force dynamic rendering, RENAME the export to avoid conflict!
export const dynamicType = 'force-dynamic' // Rename from 'dynamic' to 'dynamicType'

const ContactClient = dynamic(() => import('@/components/ContactClient'), {
  ssr: false,
})

export default function ContactServerPage() {
  return (
    <div className="mt-30 min-h-screen bg-[#fafaf8] py-16 px-4">
      <ContactClient />
    </div>
  )
}