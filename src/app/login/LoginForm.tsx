// app/login/LoginForm.tsx
"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import api from '@/store/api/axios'
import { useAppDispatch } from '@/store'
import { setToken, fetchCurrentUser } from '@/store/slices/authSlice'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm({ nextUrl }: { nextUrl?: string }) {
  const dispatch      = useAppDispatch()
  const router        = useRouter()
  const params        = useSearchParams()
const next = nextUrl ?? params.get('next') ?? '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [error, setError]     = useState<string|null>(null)
  const [isLoading, setLoading] = useState(false)
  const { user }             = useAuth()

  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        router.replace('/dashboard')
      }
    }
  }, [user, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Login and store token
      const { data } = await axios.post<{ token: string }>('https://pilatesproject-backend-3zu5.onrender.com/api/auth/login', {
        email:    form.email,
        password: form.password,
      })
      localStorage.setItem('auth_token', data.token)
      dispatch(setToken(data.token))

      // 2. Fetch current user
      await dispatch(fetchCurrentUser()).unwrap()

      // 3. Merge guest cart
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]')
      for (const g of guestCart) {
        await api.post('/cart', { courseId: g.course.id }).catch(()=>{})
      }
      localStorage.removeItem('guest_cart')

      // 4. Redirect
      router.replace(next)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-teal-900 inline-block border-b-2 border-teal-800 pb-2">
            Welcome back.
            <img
              src="/images/flowercolorhalf.png"
              alt="flower"
              className="inline-block w-20 h-20 object-contain ml-2"
            />
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-teal-900 mb-1">Email address</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border-b-2 border-teal-900 focus:border-teal-900 outline-none py-1"
              placeholder="Your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-teal-900 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border-b-2 border-teal-900 focus:border-teal-900 outline-none py-1"
              placeholder="Your password"
              disabled={isLoading}
            />
            <p className="text-xs text-gray-400 mt-1">
              Password must contain a minimum of 8 characters
            </p>
            <p className="text-xs text-gray-400">
              Password must contain at least one symbol e.g. @, !
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-900 text-white py-2 rounded-md hover:bg-teal-800 transition"
            disabled={isLoading}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an account?{' '}
          <a
            href={`/register?next=${encodeURIComponent(next)}`}
            className="text-teal-900 underline hover:text-teal-800"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
