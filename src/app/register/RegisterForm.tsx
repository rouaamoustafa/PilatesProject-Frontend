// app/register/RegisterForm.tsx
"use client"

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import api from '@/store/api/axios'
import { useAppDispatch } from '@/store'
import { setToken, fetchCurrentUser } from '@/store/slices/authSlice'
import { useAddToCartMutation } from '@/store/cartEndpoints'

export default function RegisterForm() {
  const router       = useRouter()
  const params       = useSearchParams()
  const nextPath     = params.get('next') ?? '/'
  const addCourse    = params.get('add')

  const dispatch     = useAppDispatch()
  const [addToCart]  = useAddToCartMutation()

  const [form, setForm]       = useState({ full_name: '', email: '', password: '' })
  const [error, setError]     = useState<string>('')
  const [isLoading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Register → get token
      const { data } = await api.post<{ token: string }>('/auth/register', form)
      dispatch(setToken(data.token))

      // 2. Fetch profile
      const user = await dispatch(fetchCurrentUser()).unwrap()

      // 3. If coming from course add, merge it
      if (addCourse) {
        await addToCart({ courseId: addCourse }).unwrap().catch(() => {})
      }

      // 4. Redirect to login (or dashboard, depending—here `/login`)
      router.replace(`/login?next=${encodeURIComponent(nextPath)}`)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow"
      >
        <div className="text-center mb-8 relative">
          <h1 className="text-3xl font-serif text-teal-900 inline-block border-b-2 border-teal-800 pb-2">
            Let’s get you started
          </h1>
          <CheckCircle className="absolute right-1/2 transform translate-x-1/2 -translate-y-1 text-teal-900" />
        </div>

        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {[
          { name: 'full_name', type: 'text',     placeholder: 'Full name' },
          { name: 'email',     type: 'email',    placeholder: 'Email address' },
          { name: 'password',  type: 'password', placeholder: 'Create password' },
        ].map(fld => (
          <div key={fld.name} className="mb-6">
            <input
              name={fld.name}
              type={fld.type}
              placeholder={fld.placeholder}
              value={(form as any)[fld.name]}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="w-full bg-transparent focus:outline-none border-b-2 border-teal-800 pb-2 text-gray-800 placeholder-gray-500"
            />
          </div>
        ))}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-teal-900 text-white py-3 rounded-md hover:bg-teal-800 transition mb-4"
        >
          {isLoading ? 'Signing Up…' : 'Sign Up'}
        </button>

        <p className="text-center text-gray-600">
          Already a user?{' '}
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} className="text-teal-900 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}
