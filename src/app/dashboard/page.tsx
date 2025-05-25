'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import UserTable from '@/components/UserTable'
import InstructorModal from '@/components/InstructorModal'
import type { Instructor } from '@/types'
import { useAuth } from '@/hooks/useAuth'

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // local state for instructors panel
  const [instSearch, setInstSearch] = useState('')
  const [instModal, setInstModal] = useState(false)
  const [editingInst, setEditingInst] = useState<Instructor | null>(null)
  const [instKey, setInstKey] = useState(0)
  const [userSearch, setUserSearch] = useState('')

  // redirect to login if not authed
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return <div className="p-8 text-center">Loading…</div>
  }
 
  // GYM_OWNER sees their instructors
  // if (user.role === 'gym_owner') {
  //   return (
  //     <div className="min-h-screen bg-gray-50 py-8 px-6">
  //       <div className="container mx-auto max-w-6xl">
  //         <div className="flex justify-between items-center mb-6">
  //           <h1 className="text-3xl font-bold">Your Instructors</h1>
  //           <Button
  //             onClick={() => {
  //               setEditingInst(null)
  //               setInstModal(true)
  //             }}
  //           >
  //             + New Instructor
  //           </Button>
  //         </div>

  //         <UserTable<Instructor>
  //           key={instKey}
  //           endpoint="/instructors"
  //           filterValue={instSearch}
  //           onFilterChange={setInstSearch}
  //           showRole={false}
  //           allowAdd={false}    // we render our own "+ New" above
  //           onEdit={inst => {
  //             setEditingInst(inst)
  //             setInstModal(true)
  //           }}
  //         />

  //         <InstructorModal
  //           open={instModal}
  //           onOpenChange={setInstModal}
  //           instructor={editingInst ?? undefined}
  //           onSuccess={() => {
  //             setInstModal(false)
  //             setInstKey(k => k + 1)
  //           }}
  //         />
  //       </div>
  //     </div>
  //   )
  // }

  // ADMIN / SUPERADMIN see the users list (your existing code)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-6">
      <div className="container mx-auto max-w-6xl">
        {/* *** Replace the below with your existing UsersPage code *** */}
        <UserTable
          endpoint="/users"
          filterValue={userSearch}
          onFilterChange={setUserSearch}
          showRole={true}
        />
      </div>
    </div>
  )
}
