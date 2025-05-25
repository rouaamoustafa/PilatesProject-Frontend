'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/store/api/axios'
import type { GymOwner } from '@/types'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import { Pacifico } from 'next/font/google'
import Link from 'next/link'

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' })

export default function GymOwnerDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [owner, setOwner] = useState<GymOwner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    ;(async () => {
      setLoading(true)
      try {
        const res = await api.get<GymOwner>(`/gym-owners/public/${id}`)
        setOwner(res.data)
      } catch (err) {
        console.error(err)
        setError('Could not load this studio.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <p className="p-20 text-center">Loading…</p>
  if (error) return <p className="p-20 text-center text-red-600">{error}</p>
  if (!owner) return <p className="p-20 text-center">Not found.</p>

  const addr = owner.address?.address
  const mapSrc = addr
    ? `https://maps.google.com/maps?q=${encodeURIComponent(addr)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null

  return (
    <main className="bg-[#fafaf8] py-16 px-6 min-h-screen text-[#3E4939] font-serif mt-20">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Back Button */}
        {/* <button
          onClick={() => router.back()}
          className="text-[#3E4939] border border-[#3E4939] px-4 py-2 rounded-lg hover:bg-[#3E4939]/10 transition"
        >
          ← Back
        </button> */}

        {/* Title */}
        <h1 className={` text-[4rem] md:text-[6rem] font-serif leading-none`}>
          {owner.full_name}
        </h1>

        {/* Bio */}
        {owner.bio && (
          <p className="text-xl leading-relaxed italic max-w-3xl">
            “{owner.bio}”
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-12">
          {/* Details */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <a
                href={`mailto:${owner.email}`}
                className="underline underline-offset-2 hover:text-[#3E4939]/80"
              >
                {owner.email}
              </a>
            </div>

            {owner.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>{owner.phone}</span>
              </div>
            )}

            {addr && (
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                <span>{addr}</span>
              </div>
            )}

            {addr && (
              <a
                href={owner.address?.mapLink || `https://maps.google.com?q=${encodeURIComponent(addr)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 underline underline-offset-2 hover:text-[#3E4939]/80"
              >
                Open in Maps <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Map */}
          <div className="rounded-xl overflow-hidden border bg-white shadow-lg h-72">
            {mapSrc ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Map unavailable
              </div>
            )}
          </div>
        </div>
      </div>



<section className="max-w-5xl mx-auto px-10 py-16 space-y-4 text-[#3E4939] font-serif mt-60 mb-20">
  {[
    { title: 'VINYASA YOGA', days: 'Mondays & Wednesdays', time: '09.00am - 10.00am' },
    { title: 'PILATES FLOW', days: 'Tuesdays & Thursdays', time: '10.30am - 11.30am' },
    { title: 'POWER YOGA', days: 'Fridays', time: '08.00am - 09.00am' },
  ].map((item, idx) => (
    <div
      key={idx}
      className="border-b border-[#3E4939] pb-4 flex justify-between items-center"
    >
      <span className="font-semibold text-lg">{item.title}</span>
      <span className="text-sm">{item.days}</span>
      <span className="text-sm">{item.time}</span>

      <Link
        href="/book"
        className="transition-transform duration-200 hover:translate-x-1"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 6l6 6-6 6"
            stroke="#3E4939"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </div>
  ))}
</section>

    </main>
  )
}
