'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateUserPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'instructor',
  })
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      const res = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Failed to create user')

      setMessage('✅ User created successfully')
      router.push('/') // or /dashboard or /login
    } catch (err: any) {
      setMessage(`❌ ${err.message}`)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-center mb-4">Admin Create User</h2>
        {message && <p className="text-sm text-center mb-2">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="full_name" placeholder="Full Name" value={form.full_name} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded" />
          <select name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2 border rounded">
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="gym_owner">Gym Owner</option>
            <option value="instructor">Instructor</option>
          </select>
          {/* <select
  name="role"
  value={form.role}
  onChange={handleChange}
  className="w-full px-4 py-2 border rounded"
>
  {userRole === 'superadmin' && <option value="superadmin">Super Admin</option>}
  {['admin', 'superadmin'].includes(userRole) && <option value="admin">Admin</option>}
  {['admin', 'superadmin'].includes(userRole) && <option value="gym_owner">Gym Owner</option>}
  {['admin', 'superadmin'].includes(userRole) && <option value="instructor">Instructor</option>}
  <option value="subscriber">Subscriber</option>
</select> */}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
            Create User
          </button>
        </form>
      </div>
    </div>
  )
}
