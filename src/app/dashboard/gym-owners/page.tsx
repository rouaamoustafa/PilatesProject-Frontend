'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import UserTable from '@/components/UserTable'
import GymOwnerModal from '@/components/GymOwnerModal'
import type { GymOwner } from '@/types'

export default function GymOwnersPage() {
  const [filter, setFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [selected, setSelected] = useState<GymOwner | null>(null)
  const [tableKey, setTableKey] = useState(0)

  const openNew = () => {
    setSelected(null)
    setModalOpen(true)
  }

  // Always trigger modal for editing, pass object or null for new
  const openEdit = (owner: GymOwner | null) => {
    setSelected(owner)
    setModalOpen(true)
  }

  // Every time an edit/create succeeds, close modal and bump key
  const handleSuccess = () => {
    setModalOpen(false)
    setTableKey(k => k + 1)
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Gym Owners</h1>
        <Button onClick={openNew}>+ New Gym Owner</Button>
      </div>

      <UserTable<GymOwner>
        key={tableKey} // triggers remount and fresh data
        endpoint="/gym-owners"
        filterValue={filter}
        onFilterChange={setFilter}
        showRole={false}
        onEdit={openEdit}
      />

      <GymOwnerModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        gymOwner={selected ?? undefined}
        onSuccess={handleSuccess}
      />
    </div>
  )
}
