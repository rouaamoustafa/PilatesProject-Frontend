// app/contact/page.tsx
import React, { Suspense } from 'react'
import ContactForm from './ContactForm'

export default function ContactPage() {
  return (
    <div className="mt-30 min-h-screen bg-[#fafaf8] py-16 px-4">
      <Suspense
        fallback={
          <div className="min-h-[400px] flex items-center justify-center">
            Loading contact form…
          </div>
        }
      >
        <ContactForm />
      </Suspense>
    </div>
  )
}
