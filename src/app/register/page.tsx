// app/register/page.tsx
import React, { Suspense } from 'react'
import RegisterForm from './RegisterForm'

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        Loading registration…
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
