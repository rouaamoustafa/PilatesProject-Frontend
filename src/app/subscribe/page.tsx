'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/store/api/axios'
import { MapPin, Info } from 'lucide-react'
import type { GymOwner } from '@/types'

const INITIAL_DISPLAY = 6

export default function GymOwnersPage() {
  const [owners, setOwners]       = useState<GymOwner[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState<string | null>(null)
  const [showAll, setShowAll]     = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<{ users: GymOwner[] }>('/gym-owners')
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

  // spinner overlay
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-900"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* CTA */}
      {/* <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow mb-12">
        <p className="text-xl text-gray-700 mb-6">
          Apply on our website to get your Pilates subscription and unlock all studio benefits.
        </p>
        <Link
          href="/subscribe"
          className="inline-block bg-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition"
        >
          Subscribe Now
        </Link>
      </div> */}

      <h1 className="mt-20 text-4xl font-serif text-teal-900 text-center mb-12">
        Find a Pilates Studio
      </h1>

      {error && <p className="text-center text-red-500">{error}</p>}

      {!error && (
        <>
          <div className="container mx-auto max-w-7xl grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(showAll ? owners : owners.slice(0, INITIAL_DISPLAY)).map(owner => (
              <div
                key={owner.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col"
              >
                <h2 className="text-2xl font-bold text-teal-900 mb-3">
                  {owner.full_name}
                </h2>

                <div className="flex items-center text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-teal-600 mr-2" />
                  <span className="font-medium">
                    {owner.address?.address || '—'}
                  </span>
                </div>

                <div className="flex items-start text-gray-600 mb-6">
                  <Info className="w-5 h-5 text-teal-600 mt-1 mr-2" />
                  <p className="flex-1 leading-relaxed">
                    {owner.bio ?? 'No description provided.'}
                  </p>
                </div>

                <Link
                  href={`/gym-owners/${owner.id}`}
                  className="mt-auto inline-block border-2 border-teal-600 bg-teal-600 text-white text-center py-2 px-4 rounded-lg hover:bg-teal-500 transition font-medium"
                >
                  See More
                </Link>
              </div>
            ))}
          </div>

          {owners.length > INITIAL_DISPLAY && (
            <div className="text-center mt-8">
              <button
                onClick={() => setShowAll(!showAll)}
                className="inline-block bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition"
              >
                {showAll ? 'Show Fewer Studios' : 'Show More Studios'}
              </button>
            </div>
          )}
        </>
      )}
    </main>
  )
}
