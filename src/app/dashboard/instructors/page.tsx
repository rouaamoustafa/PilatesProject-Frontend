// src/app/dashboard/instructors/page.tsx
'use client'

import { useState } from 'react'
import UserTable from '@/components/UserTable'
import InstructorModal from '@/components/InstructorModal'
import type { Instructor } from '@/types'

export default function InstructorsPage() {
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingInst, setEditingInst] = useState<Instructor | null>(null)
  const [reloadFlag, setReloadFlag] = useState(0)

  const openNew = () => {
    setEditingInst(null)
    setModalOpen(true)
  }
  const openEdit = (inst: Instructor) => {
    setEditingInst(inst)
    setModalOpen(true)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-end mb-4">
        <button
          onClick={openNew}
          className="bg-teal-600 text-white px-4 py-2 rounded"
        >
          + New Instructor
        </button>
      </div>

      {/* Key on reloadFlag forces refresh when it changes */}
      <UserTable
        key={reloadFlag}
        endpoint="/instructors"
        filterValue={search}
        onFilterChange={setSearch}
        showRole={false}
        allowAdd={false}          // Add handled via the button above
        onEdit={openEdit}         // Called when “Edit” clicked
      />

      <InstructorModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        instructor={editingInst ?? undefined}
        onSuccess={() => {
          setModalOpen(false)
          setReloadFlag(f => f + 1)
        }}
      />
    </div>
  )
}
