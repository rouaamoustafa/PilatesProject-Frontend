'use client'
import { useState } from 'react'
import UserTable from '@/components/UserTable'


export default function UsersPage() {
  const [filter, setFilter] = useState('')
  
  return (
    <div className="container mx-auto p-6">
     
      
      <UserTable 
        endpoint="/users"
        filterValue={filter}
        onFilterChange={setFilter}
        showRole={true}
      />
    </div>
  )
}
