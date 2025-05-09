'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ full_name: '', email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Registration failed')
      router.replace('/login')
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        {/* Heading */}
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-serif text-teal-900 inline-block border-b-2 border-teal-800 pb-2">
            Let’s get you started
          </h1>
          <CheckCircle className="absolute right-1/2 transform translate-x-1/2 -translate-y-1 text-teal-900" />
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Inputs: full_name, email, password */}
        {[
          { name: 'full_name', type: 'text',     placeholder: 'Full name' },
          { name: 'email',     type: 'email',    placeholder: 'Email address' },
          { name: 'password',  type: 'password', placeholder: 'Create password' },
        ].map((fld) => (
          <div key={fld.name} className="mb-6">
            <input
              name={fld.name}
              type={fld.type}
              placeholder={fld.placeholder}
              value={(form as any)[fld.name]}
              onChange={handleChange}
              required
              className="w-full bg-transparent focus:outline-none border-b-2 border-teal-800 pb-2 text-gray-800 placeholder-gray-500"
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-teal-900 text-white py-3 rounded-md hover:bg-teal-800 transition mb-4"
        >
          Sign Up
        </button>

        <p className="text-center text-gray-600">
          Already a user?{' '}
          <Link href="/login" className="text-teal-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
