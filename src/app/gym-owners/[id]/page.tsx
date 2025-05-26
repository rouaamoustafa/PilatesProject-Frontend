'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/store/api/axios'
import type { GymOwner, CourseGym } from '@/types'
import { MapPin, Phone, Mail, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import GymClassList from '@/components/GymClassList'

export default function GymOwnerDetailPage() {
  const { id } = useParams() as { id: string }
  const [owner, setOwner] = useState<GymOwner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [classes, setClasses] = useState<CourseGym[]>([])
  const [loadingClasses, setLoadingClasses] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    api.get<GymOwner>(`/gym-owners/public/${id}`)
      .then(res => setOwner(res.data))
      .catch(() => setError('Could not load this studio.'))
      .then(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (!id) return
    setLoadingClasses(true)
    api.get<CourseGym[]>(`/courses/gym-owner/${id}/courses-gym`)
      .then(res => setClasses(res.data))
      .catch(() => setClasses([]))
      .then(() => setLoadingClasses(false))
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
        <h1 className="text-[4rem] md:text-[6rem] font-serif leading-none">
          {owner.full_name}
        </h1>
        {owner.bio && (
          <p className="text-xl leading-relaxed italic max-w-3xl">
            “{owner.bio}”
          </p>
        )}
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <a href={`mailto:${owner.email}`} className="underline underline-offset-2 hover:text-[#3E4939]/80">{owner.email}</a>
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
          <div className="rounded-xl overflow-hidden border bg-white shadow-lg h-72">
            {mapSrc ? (
              <iframe src={mapSrc} width="100%" height="100%" loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Map unavailable
              </div>
            )}
          </div>
        </div>
      </div>
      {loadingClasses ? (
        <div className="max-w-5xl mx-auto px-10 py-16 text-center text-gray-400">
          Loading classes…
        </div>
      ) : (
        <GymClassList classes={classes} />
      )}
    </main>
  )
}
