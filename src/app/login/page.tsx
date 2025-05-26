// app/login/page.tsx
import React, { Suspense } from 'react'
import LoginForm from './LoginForm'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading login…</div>}>
      <LoginForm nextUrl={undefined} />
    </Suspense>
  )
}