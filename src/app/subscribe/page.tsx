'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/store/api/axios'
import { MapPin, Info } from 'lucide-react'
import type { GymOwner } from '@/types'
import axios from 'axios'

const INITIAL_DISPLAY = 4

export default function GymOwnersPage() {
  const [owners, setOwners] = useState<GymOwner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get<{ users: GymOwner[] }>('/gym-owners')
        setOwners(res.data.users)
      } catch (err) {
        console.error(err)
        setError('Failed to load studios')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#3E4939] border-t-transparent" />
      </div>
    )
  }

  const displayedOwners = showAll ? owners : owners.slice(0, INITIAL_DISPLAY)

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
  <section className="my-16 mx-6 relative">
  {/* Text over image */}
  <h1 className="absolute w-full top-110 center left-[60px] text-[6rem] font-serif text-[#3E4939] z-10">
    Find a Pilates Studio
  </h1>

  {/* Image container */}
  <div className="overflow-hidden rounded-xl shadow-lg">
    <img
      src="/images/gym_page.jpg"
      alt="Retreat Hero"
      className="w-full h-[500px] object-cover rounded-xl"
    />
  </div>
</section>
      {/* <h1 className=" top-[-80] text-[6rem] font-serif text-[#3E4939] text-center mb-12">
        Find a Pilates Studio
      </h1> */}

      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="container mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 mt-40">
        {displayedOwners.map(owner => (
          <div
            key={owner.id}
            className="bg-white rounded-xl shadow-lg p-6 flex flex-col text-[#3E4939]"
          >
            <h2 className="text-2xl font-bold mb-3">{owner.full_name}</h2>

            <div className="flex items-center mb-4">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {owner.address?.address || '—'}
              </span>
            </div>

            <div className="flex items-start mb-6">
              <Info className="w-5 h-5 mt-1 mr-2" />
              <p className="flex-1 leading-relaxed">
                {owner.bio
                  ? owner.bio.split(' ').slice(0, 30).join(' ') +
                    (owner.bio.split(' ').length > 30 ? '...' : '')
                  : 'No description provided.'}
              </p>
            </div>

            <Link
              href={`/gym-owners/${owner.id}`}
              className="mt-auto flex items-center justify-center hover:opacity-80 transition"
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
              <span className="ml-2 font-semibold text-lg">Join Now</span>
            </Link>
          </div>
        ))}
      </div>

      {owners.length > INITIAL_DISPLAY && (
        <div className="text-center mt-10">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-8 py-3 text-[#3E4939] border border-[#3E4939] rounded-2xl font-medium
                     transition-all duration-500 ease-in-out 
                     hover:bg-[#3E4939]/10 hover:scale-[1.02] active:scale-100"
          >
            {showAll ? 'Show Fewer Studios' : 'Show More Studios'}
          </button>
        </div>
      )}

 <section className="max-w-[1200px] mx-auto py-16 px-6">
  <div className="flex justify-between items-center gap-4.5">
    {[
      '/images/3-women-1.jpg',
      '/images/3-women-2.jpg',
      '/images/3-women-3.jpg',
      '/images/center-pilates.jpg',
    ].map((src, idx) => (
      <img
        key={idx}
        src={src}
        alt={`Image ${idx + 1}`}
        className="w-70 h-60 object-cover rounded-xl"
      />
    ))}
  </div>
</section>
    </main>
  )
}
