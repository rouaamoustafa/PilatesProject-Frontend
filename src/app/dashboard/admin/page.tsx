'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import AdminModal from '@/components/AdminModal'
import api from '@/store/api/axios'
import { toast } from 'react-toastify'
import type { User } from '@/types'

export default function AdminsPage() {
  const [admins, setAdmins]       = useState<User[]>([])
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState<string | null>(null)
  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected]   = useState<User | null>(null)

  // 1) Load once on mount
  useEffect(() => {
    (async () => {
      setLoading(true)
      try {
        const { data } = await api.get<{ users: User[] }>('/users/role/admin', {
          params: { page: 0, pageSize: 100 },
        })
        setAdmins(data.users)
        setError(null)
      } catch (e: any) {
        setError(e.response?.data?.message || e.message)
        toast.error('Failed to load admins')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // 2) Client-side filter
  const filteredAdmins = admins.filter(a =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('Permanently delete this admin?')) return
    try {
      await api.delete(`/users/admin/${id}`)
      toast.success('Admin deleted')
      setAdmins(a => a.filter(x => x.id !== id))  // remove locally
    } catch {
      toast.error('Delete failed')
    }
  }

  const openNew = () => {
    setSelected(null)
    setModalOpen(true)
  }
  const openEdit = (admin: User) => {
    setSelected(admin)
    setModalOpen(true)
  }
  const handleSuccess = (updatedAdmin?: User) => {
    setModalOpen(false)
    // reload entire list, or update locally:
    // simplest: reload from server
    api.get<{ users: User[] }>('/users/role/admin', { params: { page:0, pageSize:100 } })
      .then(res => setAdmins(res.data.users))
    // you can optimize by merging updatedAdmin into state
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Admins</h1>
        <Button onClick={openNew}>+ New Admin</Button>
      </div>

      <div className="relative mb-4">
        <Input
          placeholder="Search…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
      </div>

      <div className="overflow-auto rounded-lg border bg-white shadow">
        <table className="w-full text-sm table-auto">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="p-6 text-center">
                  Loading…
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && filteredAdmins.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-gray-500">
                  No admins match your search.
                </td>
              </tr>
            )}
            {!loading && !error && filteredAdmins.map(admin => (
              <tr key={admin.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{admin.full_name}</td>
                <td className="p-3">{admin.email}</td>
                <td className="p-3 flex justify-center space-x-2">
                  <Button size="sm" onClick={() => openEdit(admin)}>
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(admin.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AdminModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        admin={selected ?? undefined}
        onSuccess={() => handleSuccess(selected!)}
      />
    </div>
  )
}
