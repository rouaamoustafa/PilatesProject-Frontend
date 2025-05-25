'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import UserTable from '@/components/UserTable'
import InstructorModal from '@/components/InstructorModal'
import type { Instructor, Role } from '@/types'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function InstructorsPage() {
  const { user, loading, error } = useAuth()
  const router                  = useRouter()

  const [search, setSearch]       = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing]     = useState<Instructor | undefined>(undefined)
  const [tableKey, setTableKey]   = useState(0)

  useEffect(() => {
    if (!loading && error) {
      router.replace('/login')
    }
  }, [loading, error, router])

  if (loading) return <div className="p-8">Loading…</div>
  if (error || !user) return null

  const allowedRoles: Role[] = ['gym_owner', 'admin', 'superadmin']
  if (!allowedRoles.includes(user.role)) {
    return <div className="p-8 text-red-600">You don’t have access to this page.</div>
  }

  const openNew = () => {
    setEditing(undefined)
    setModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Instructors</h1>
          <Button onClick={openNew}>+ New Instructor</Button>
        </div>

        <UserTable<Instructor>
          key={tableKey}
          endpoint="/instructors"
          filterValue={search}
          onFilterChange={setSearch}
          showRole={false}
          allowAdd={false}
          onEdit={inst => {
            setEditing(inst ?? undefined)
            setModalOpen(true)
          }}
        />

        <InstructorModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          instructor={editing}
          onSuccess={() => {
            setModalOpen(false)
            setTableKey(k => k + 1)
          }}
        />
      </div>
    </div>
  )
}