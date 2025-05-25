'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/store/api/axios'
import type { GymOwner } from '@/types'
import { Button } from '@/components/ui/button'
import { MapPinIcon, PhoneIcon, ExternalLinkIcon } from 'lucide-react'
import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({ subsets: ['latin'], weight: '400' })

export default function GymOwnerDetailPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const [owner, setOwner]     = useState<GymOwner | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

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

  if (loading) return <p className="p-8 text-center">Loading…</p>
  if (error)   return <p className="p-8 text-center text-red-600">{error}</p>
  if (!owner)  return <p className="p-8 text-center">Not found</p>

  const addr = owner.address?.address
  const mapSrc = addr
    ? `https://maps.google.com/maps?q=${encodeURIComponent(addr)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    : null

  return (
    <div className="flex justify-center py-16 bg-gray-50 min-h-screen">
      <div className="max-w-5xl w-full p-8 bg-white rounded-xl shadow space-y-6">
        {/* ← Back button moved to top-left */}
        <div>
          <Button className="
        inline-flex items-center 
        text-teal-800 hover:text-teal-600 
        font-medium
        "   variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
        </div>

        {/* Title centered below back button */}
        <header className="text-left">
          <h1 className={`${pacifico.className} text-5xl text-teal-900`}>
            {owner.full_name}
          </h1>
        </header>

        {owner.bio && (
          <blockquote className=" text-teal-700 leading-relaxed text-lg">
            “{owner.bio}”
          </blockquote>
        )}

        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2 space-y-4">
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              <li>
                <span className="font-medium">Email:</span>{' '}
                <a
                  href={`mailto:${owner.email}`}
                  className="text-teal-600 hover:underline"
                >
                  {owner.email}
                </a>
              </li>
              {owner.phone && (
                <li>
                  <span className="font-medium">Phone:</span> {owner.phone}
                </li>
              )}
              {addr && (
                <li>
                  <span className="font-medium">Address:</span> {addr}
                </li>
              )}
            </ul>

            {addr && (
              <a
                href={
                  owner.address!.mapLink ||
                  `https://maps.google.com?q=${encodeURIComponent(addr)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-teal-600 hover:underline"
              >
                <MapPinIcon className="w-5 h-5 mr-1" />
                Open in Maps
                <ExternalLinkIcon className="w-4 h-4 ml-1" />
              </a>
            )}
          </div>

          <div className="md:w-1/2 h-64 border rounded-lg overflow-hidden bg-gray-100">
            {mapSrc ? (
              <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Map unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
