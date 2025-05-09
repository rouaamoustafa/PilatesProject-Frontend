// src/components/InstructorManager.tsx
'use client'

import { useEffect, useState } from 'react'
import api from '@/store/api/axios'
import type { CreateInstructorDto, UpdateInstructorDto, Instructor } from '@/types'

// Helper to build FormData from DTO + files
function buildFormData(dto: any, image?: File, cv?: File) {
  const fd = new FormData()
  Object.entries(dto).forEach(([k, v]) => {
    if (v != null) fd.append(k, v as any)
  })
  if (image) fd.append('image', image)
  if (cv)    fd.append('cv', cv)
  return fd
}

export default function InstructorManager() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [editing, setEditing] = useState<Instructor | null>(null)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [link, setLink] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>()
  const [cvFile, setCvFile]     = useState<File | undefined>()

  // Fetch list
  const fetchAll = async () => {
    setLoading(true)
    try {
      const resp = await api.get<{ users: Instructor[] }>('/instructors')
      setInstructors(resp.data.users)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // Prepare new
  const startNew = () => {
    setEditing(null)
    setFullName('')
    setEmail('')
    setPassword('')
    setBio('')
    setLink('')
    setImageFile(undefined)
    setCvFile(undefined)
  }

  // Prepare edit
  const startEdit = (inst: Instructor) => {
    setEditing(inst)
    setFullName(inst.full_name)
    setEmail(inst.email)
    setPassword('')            // leave blank if unchanged
    setBio(inst.bio || '')
    setLink(inst.link || '')
    setImageFile(undefined)
    setCvFile(undefined)
  }

  // Submit (create or patch)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!fullName || !email || (!editing && !password)) {
      setError('Name, email, and password are required')
      return
    }

    setLoading(true)
    const dto: Partial<CreateInstructorDto & UpdateInstructorDto> = {
      full_name: fullName,
      email,
      bio: bio || undefined,
      link: link || undefined,
      ...(editing ? {} : { password })
    }
    const formData = buildFormData(dto, imageFile, cvFile)

    try {
      if (editing) {
        await api.patch<Instructor>(`/instructors/${editing.id}`, formData)
      } else {
        await api.post<Instructor>('/instructors', formData)
      }
      await fetchAll()
      startNew()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message)
    } finally {
      setLoading(false)
    }
  }

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm('Delete this instructor?')) return
    setLoading(true)
    try {
      await api.delete(`/instructors/${id}`)
      await fetchAll()
      startNew()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-xl font-semibold">
        {editing ? 'Edit Instructor' : 'New Instructor'}
      </h2>
      {error && <div className="text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={e => setFullName(e.target.value)}
          required
          className="border p-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required={!editing}
          className="border p-2"
        />
        {!editing && (
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border p-2"
          />
        )}
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={e => setBio(e.target.value)}
          className="border p-2 col-span-full"
        />
        <input
          type="url"
          placeholder="Link"
          value={link}
          onChange={e => setLink(e.target.value)}
          className="border p-2 col-span-full"
        />
        <div>
          <label className="block">Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setImageFile(e.target.files?.[0])}
          />
        </div>
        <div>
          <label className="block">CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={e => setCvFile(e.target.files?.[0])}
          />
        </div>
        <div className="col-span-full flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            {editing ? 'Save Changes' : 'Create Instructor'}
          </button>
          <button
            type="button"
            onClick={startNew}
            className="border px-4 py-2 rounded"
          >
            New Form
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => handleDelete(editing.id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          )}
        </div>
      </form>

      <hr />

      <h2 className="text-xl font-semibold">Existing Instructors</h2>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {instructors.map(i => (
              <tr key={i.id} className="border-t">
                <td className="p-2">{i.full_name}</td>
                <td className="p-2">{i.email}</td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => startEdit(i)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(i.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
