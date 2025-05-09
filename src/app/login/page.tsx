// src/app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/store/api/axios'
import { useAppDispatch } from '@/store'
import { fetchCurrentUser } from '@/store/slices/authSlice'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      await api.post('/auth/login', form)
      await dispatch(fetchCurrentUser()).unwrap()
      router.replace('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {error && (
          <p className="text-red-600 mb-4 text-center">
            {error}
          </p>
        )}

<div className="text-center mb-8">
  <h1 className=" text-3xl font-serif text-teal-900 inline-block border-b-2 border-teal-800 pb-2">
    Welcome back.
    <img
      src="/images/flowercolorhalf.png"
      alt="flower"
      className=" inline-block w-20 h-20 object-contain ml-2 "
    />
  </h1>
</div>


        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-teal-900 mb-1">
              Email address
            </label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full border-b-2 border-teal-900 focus:border-teal-900 outline-none py-1 placeholder-transparent"
              placeholder="Your email"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-teal-900 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full border-b-2 border-teal-900 focus:border-teal-800 outline-none py-1 placeholder-transparent"
              placeholder="Your password"
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
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don’t have an Account?{' '}
          <a
            href="/register"
            className="text-teal-900 underline hover:text-teal-800"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  )
}
