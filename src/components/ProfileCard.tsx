'use client'

import type { FC } from 'react'
import type { Instructor, GymOwner } from '@/types'
import {
  ExternalLinkIcon,
  MapPinIcon,
  PhoneIcon,
} from 'lucide-react'
import { imageUrl } from '@/lib/storage'

interface ProfileCardProps {
  data: Instructor | GymOwner
}

const pick = <T, K extends keyof T>(obj: T, key: K): T[K] | undefined =>
  obj[key] ?? (obj as any).user?.[key]

const ProfileCard: FC<ProfileCardProps> = ({ data }) => {
  const full_name = pick(data, 'full_name') ?? 'Unknown'
  const email     = pick(data, 'email')     ?? ''
  const bio       = (data as any).bio

  const isGymOwner = 'phone' in data
  const phone      = isGymOwner ? (data as GymOwner).phone   : undefined
  const address    = isGymOwner ? (data as GymOwner).address : undefined
  const mapLink    = isGymOwner ? address?.mapLink           : undefined

  const cv   = !isGymOwner ? (data as Instructor).cv   : undefined
  const link = !isGymOwner ? (data as Instructor).link : undefined

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* avatar only for instructors */}
        {!isGymOwner && (() => {
          const img = (data as any).image
          const avatarUrl = img ? imageUrl(img) : null
          return (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-teal-200 flex-shrink-0">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={full_name}
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-teal-100 text-teal-500 text-xl font-bold">
                  {full_name.charAt(0)}
                </div>
              )}
            </div>
          )
        })()}

        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-teal-600">
            {full_name}
          </h2>
          <p className="mt-1 text-gray-600">{email}</p>

          {bio && (
            <p className="mt-4 text-gray-700">
              {bio}
            </p>
          )}

          {isGymOwner ? (
            <div className="mt-6 space-y-3">
              {phone && (
                <div className="flex items-center text-gray-700">
                  <PhoneIcon className="w-5 h-5 text-teal-500 mr-2" />
                  {phone}
                </div>
              )}
              {address?.address && (
                <div className="flex items-center text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-teal-500 mr-2" />
                  {address.address}
                </div>
              )}
              {mapLink && (
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-600 hover:bg-teal-100 transition"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  View on Map
                </a>
              )}
            </div>
          ) : (
            <div className="mt-6 flex flex-wrap gap-4">
              {cv && (
                <a
                  href={imageUrl(cv)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 border border-teal-200 rounded-full text-teal-600 hover:bg-teal-100 transition"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  View CV
                </a>
              )}
              {link && (
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-teal-600 hover:underline"
                >
                  <ExternalLinkIcon className="w-4 h-4" />
                  Profile Link
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
