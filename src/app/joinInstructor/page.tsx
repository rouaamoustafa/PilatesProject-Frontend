'use client'

import { useState, useEffect } from 'react'
import api from '@/store/api/axios'
import { imageUrl } from '@/lib/storage'

export interface Instructor {
  id: string
  full_name: string
  bio?: string
  image?: string
}

export default function JoinInstructorPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [start, setStart] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.get<{ users: Instructor[] }>('/instructors/public', {
          params: { page: 0, pageSize: 50, search: '' },
        })
        setInstructors(res.data.users)
      } catch (e) {
        console.error('Could not load instructors', e)
        setError('Failed to load instructors')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-900"></div>
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-500 mt-12">{error}</p>
  }

  const n = instructors.length
  if (n === 0) {
    return <p className="text-center text-gray-500 mt-12">No instructors found.</p>
  }

  const prev = () => setStart(s => (s + n - 1) % n)
  const next = () => setStart(s => (s + 1) % n)

  const windowInstructors = Array.from({ length: Math.min(3, n) }, (_, i) =>
    instructors[(start + i) % n]
  )

  return (
    <main className="min-h-screen bg-[#fafaf8] py-12 px-14 md-40">
      <div className="px-10 py-34 bg-[#fafaf8]">
  <h1 className="text-[9vw] font-serif text-[#3E4939] leading-none ml-4 px-160">
    PILATES
  </h1>
  <h1 className="text-[9vw] font-serif text-[#3E4939] leading-none ml-20 mt-5">
    INSTRUCTORS
  </h1>
</div>

      <div className="max-w-10xl mx-auto flex items-center justify-between mt-40 mb-40">
        {n > 1 && (
  <button
    onClick={prev}
    className="py-3 px-1.5 text-[#2e372c] hover:text-[#4b5941] transition"
    aria-label="Previous"
  >
    <span className="inline-block transition-transform duration-500 hover:scale-115 hover:-translate-x-2">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
        <path d="M30 12H3M10 6L3 12L10 18" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </button>
)}

        <div className="flex gap-6">
          {windowInstructors.map((inst) => {
            const src = inst.image ? imageUrl(inst.image) : '/placeholder.png'
            return (
             <div
  key={inst.id}
  className="grid grid-raws-[auto_1fr] items-center bg-white rounded-lg shadow overflow-hidden"
>
  {/* Instructor Image */}
 <div className="overflow-hidden w-[380px] h-[400px]">
  <img
    src={inst.image ? imageUrl(inst.image) : '/placeholder.png'}
    alt={inst.full_name}
    className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
  />
</div>

  {/* Right: Name/Bio stacked + Arrow aligned right */}
  <div className="flex justify-between items-center w-full px-6">
    <div className="flex flex-col">
      <h2 className="text-lg font-semibold text-[#2e372c]">
        {inst.full_name}
      </h2>
      <p className="text-sm text-[#4b5941]">
  {(inst.bio && inst.bio.split(' ').length > 5)
    ? inst.bio.split(' ').slice(0, 5).join(' ') + '...'
    : inst.bio || 'No bio available.'}
</p>
    </div>

    <a
  href={`/joinInstructor/${inst.id}`}
  className="ml-4 transition-transform duration-300 hover:scale-110 hover:translate-x-1 text-[#2e372c]"
  aria-label="Show more"
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
</a>

  </div>
</div>

            )
          })}
        </div>

        {n > 1 && (
  <button
    onClick={next}
    className="py-3 px-1.5 text-[#2e372c] hover:text-[#4b5941] transition"
    aria-label="Next"
  >
    <span className="inline-block transition-transform duration-500 hover:scale-115 hover:translate-x-2">
      <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
        <path d="M2 12h27M22 6l7 6-7 6" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  </button>
)}
      </div>
    </main>
  )
}
