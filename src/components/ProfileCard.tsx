// src/components/ProfileCard.tsx
'use client'

import type { FC } from 'react'
import type { Instructor } from '@/types'
import { Button } from '@/components/ui/button'
import { ExternalLinkIcon } from 'lucide-react'

interface ProfileCardProps {
  data: Instructor
}

const ProfileCard: FC<ProfileCardProps> = ({ data }) => {
  const { full_name, email, bio, image, cv, link } = data
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  return (
    <div className="flex gap-6 p-4 bg-white rounded shadow">
      {/* Profile image */}
      <div className="w-32 h-32 bg-gray-100 rounded overflow-hidden">
        {image ? (
          <img
            src={`${base}/uploads/instructors/${image}`}
            alt={full_name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="flex items-center justify-center text-gray-400 h-full">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="text-xl font-semibold">{full_name}</h3>
        <p className="text-gray-600">{email}</p>
        {bio && (
          <p className="mt-2">
            <strong>Bio:</strong> {bio}
          </p>
        )}

        <div className="mt-4 flex gap-3">
          {cv && (
            <a
              href={`${base}/uploads/instructors/${cv}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                View CV <ExternalLinkIcon className="inline-block ml-1" size={14}/>
              </Button>
            </a>
          )}

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-teal-600 hover:underline"
            >
              Link <ExternalLinkIcon className="inline-block ml-1" size={14}/>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
