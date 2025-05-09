'use client'

import { useState, useEffect } from 'react'
import api from '@/store/api/axios'

export interface Instructor {
  id: string
  full_name: string
  bio?: string
  image?: string   // filename on the server
}

export default function JoinInstructorPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [start, setStart] = useState(0)

  // load once
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get<{
          users: Instructor[]
        }>('/instructors', {
          params: { page: 0, pageSize: 50, search: '' },
        })
        setInstructors(data.users)
      } catch (e) {
        console.error('Could not load instructors', e)
      }
    })()
  }, [])

  const n = instructors.length
  const prev = () => setStart(s => (s + n - 1) % n)
  const next = () => setStart(s => (s + 1) % n)

  // take 3 in a row
  const windowInstructors = n > 0
    ? [0, 1, 2].map(i => instructors[(start + i) % n])
    : []

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow mb-12">
        <p className="text-xl text-gray-700 mb-6">
          Join us on our mission to bring humanistic Pilates teaching to the world.
        </p>
        <a
          href="/join-instructor/apply"
          className="inline-block bg-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition"
        >
          Apply Now
        </a>
      </div>

      <h1 className="text-4xl font-serif text-teal-900 text-center mb-8">
        Meet Our Instructors
      </h1>

      {n === 0 ? (
        <p className="text-center text-gray-500">Loading instructors…</p>
      ) : (
        <div className="container mx-auto max-w-6xl flex items-center justify-between">
          {/* Prev */}
          <button
            onClick={prev}
            className="px-4 py-2 bg-teal-900 text-white rounded hover:bg-teal-800"
          >
            ← Prev
          </button>

          {/* Cards */}
          <div className="flex gap-8">
            {windowInstructors.map(inst => {
              const imgSrc = inst.image
                ? `/uploads/instructors/${inst.image}`
                : '/placeholder.png'
              return (
                <div
                  key={inst.id}
                  className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center w-72"
                >
                  <img
                    src={imgSrc}
                    alt={inst.full_name}
                    className="h-28 w-28 rounded-full object-cover mb-4"
                  />
                  <h2 className="text-2xl font-serif text-teal-900 mb-2">
                    {inst.full_name}
                  </h2>
                  <p className="text-gray-600">{inst.bio}</p>
                </div>
              )
            })}
          </div>

          {/* Next */}
          <button
            onClick={next}
            className="px-4 py-2 bg-teal-900 text-white rounded hover:bg-teal-800"
          >
            Next →
          </button>
        </div>
      )}
    </main>
  )
}
