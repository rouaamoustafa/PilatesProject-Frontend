'use client'

import Link from 'next/link'
import { MapPin, Info } from 'lucide-react'
import { GYMS, type Gym } from '@/components/data/gyms'

export default function GymsPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Subscription CTA */}
      <div className="max-w-3xl mx-auto text-center bg-white p-8 rounded-lg shadow mb-12">
        <p className="text-xl text-gray-700 mb-6">
          Apply on our website to get your Pilates subscription and unlock all studio benefits.
        </p>
        <Link
          href="/subscribe"
          className="inline-block bg-orange-400 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-500 transition"
        >
          Subscribe Now
        </Link>
      </div>

      <h1 className="text-4xl font-serif text-teal-900 text-center mb-12">
        Find a Pilates Studio
      </h1>

      <div className="container mx-auto max-w-7xl grid gap-8 sm:grid-cols-2">
        {GYMS.map((gym: Gym) => (
          <div
            key={gym.id}
            className="bg-white rounded-lg shadow p-6 flex flex-col justify-between"
          >
            <h2 className="text-2xl font-semibold text-teal-900 mb-4">
              {gym.name}
            </h2>
            <div className="flex items-center text-gray-700 mb-2">
              <MapPin size={20} className="mr-2 text-teal-600" />
              <span>{gym.location}</span>
            </div>
            <div className="flex items-start text-gray-600 mb-6">
              <Info size={20} className="mt-1 mr-2 text-teal-600" />
              <p>{gym.description}</p>
            </div>
            <Link
              href={`/gyms/${gym.id}`}
              className="mt-auto inline-block bg-orange-400 text-white text-center py-2 px-4 rounded hover:bg-orange-500 transition"
            >
              See More
            </Link>
          </div>
        ))}
      </div>
    </main>
  )
}
