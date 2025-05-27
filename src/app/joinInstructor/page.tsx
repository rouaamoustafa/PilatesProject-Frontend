'use client'

import { useState, useEffect } from 'react'
import api from '@/store/api/axios'
import { imageUrl } from '@/lib/storage'
import { motion } from 'framer-motion'
import axios from 'axios'

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
        const res = await axios.get<{ users: Instructor[] }>('api/instructors/public', {
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
    <main className="min-h-screen bg-[#fafaf8] py-8 sm:py-12 px-2 sm:px-10 md:px-14">
      {/* Headings: responsive font and padding */}
     <div className="px-2 sm:px-10 py-8 sm:py-16 bg-[#fafaf8]">
  <motion.h1
    initial={{ x: -120, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
    className="text-4xl sm:text-[6vw] lg:text-[9vw] font-serif text-[#3E4939] leading-none text-left sm:ml-4 px-0 sm:px-32"
  >
    PILATES
  </motion.h1>
  <motion.h1
    initial={{ x: -120, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ duration: 1.2, delay: 0.12, ease: [0.32, 0.72, 0, 1] }}
    className="text-4xl sm:text-[6vw] lg:text-[9vw] font-serif text-[#3E4939] leading-none text-left sm:ml-20 mt-4 sm:mt-5"
  >
    INSTRUCTORS
  </motion.h1>
</div>

      {/* Carousel: responsive stacking on mobile, row on desktop */}
      <div className="max-w-10xl mx-auto flex flex-col items-center justify-between mt-10 sm:mt-40 mb-16 sm:mb-40">
        {/* Navigation arrows on top for mobile */}
        {n > 1 && (
          <div className="flex sm:hidden w-full justify-between mb-6">
            <button
              onClick={prev}
              className="py-2 px-2 text-[#2e372c] hover:text-[#4b5941] transition"
              aria-label="Previous"
            >
              <span className="inline-block transition-transform duration-500 hover:scale-110 hover:-translate-x-2">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <path d="M30 12H3M10 6L3 12L10 18" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <button
              onClick={next}
              className="py-2 px-2 text-[#2e372c] hover:text-[#4b5941] transition"
              aria-label="Next"
            >
              <span className="inline-block transition-transform duration-500 hover:scale-110 hover:translate-x-2">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <path d="M2 12h27M22 6l7 6-7 6" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 items-center w-full justify-center">
          {/* Desktop arrows left/right */}
          {n > 1 && (
            <button
              onClick={prev}
              className="hidden sm:inline-flex py-3 px-1.5 text-[#2e372c] hover:text-[#4b5941] transition"
              aria-label="Previous"
            >
              <span className="inline-block transition-transform duration-500 hover:scale-115 hover:-translate-x-2">
                <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                  <path d="M30 12H3M10 6L3 12L10 18" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          )}

          {/* Instructors */}
          <div className="flex flex-col sm:flex-row gap-6 w-full justify-center">
            {windowInstructors.map((inst) => {
              return (
                <div
                  key={inst.id}
                  className="grid grid-rows-[auto_1fr] items-center bg-white rounded-lg shadow overflow-hidden mb-6 sm:mb-0 w-full sm:w-[380px]"
                >
                  {/* Instructor Image */}
                  <div className="overflow-hidden w-full sm:w-[380px] h-[300px] sm:h-[400px]">
                    <img
                      src={inst.image ? imageUrl(inst.image) : '/placeholder.png'}
                      alt={inst.full_name}
                      className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  {/* Right: Name/Bio stacked + Arrow aligned right */}
                  <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3">
                    <div className="flex flex-col">
                      <h2 className="text-base sm:text-lg font-semibold text-[#2e372c]">
                        {inst.full_name}
                      </h2>
                      <p className="text-xs sm:text-sm text-[#4b5941]">
                        {(inst.bio && inst.bio.split(' ').length > 5)
                          ? inst.bio.split(' ').slice(0, 5).join(' ') + '...'
                          : inst.bio || 'No bio available.'}
                      </p>
                    </div>

                    <a
                      href={`/joinInstructor/${inst.id}`}
                      className="ml-3 sm:ml-4 transition-transform duration-300 hover:scale-110 hover:translate-x-1 text-[#2e372c]"
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
              className="hidden sm:inline-flex py-3 px-1.5 text-[#2e372c] hover:text-[#4b5941] transition"
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
      </div>
    </main>
  )
}
