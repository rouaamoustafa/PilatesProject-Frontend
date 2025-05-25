'use client'
import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { useAppSelector } from '@/store'
import api from '@/store/api/axios'
import ProfileEditCard from '@/components/ProfileEditsection'
import { GymOwner, Instructor } from '@/types'

type Profile = GymOwner | Instructor

export default function ProfilePage() {
  const { user, status } = useAppSelector(s => s.auth)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'idle' || status === 'loading') return
    if (status === 'succeeded' && !user) {
      redirect('/')
      return
    }
    if (status === 'succeeded' && user) {
      (async () => {
        try {
          const url = user.role === 'gym_owner'
            ? '/gym-owners/me'
            : '/instructors/me'
          const { data: raw } = await api.get<Partial<Profile> & { user?: any }>(url)

          // Hoist any nested `user.*` up to top level
          const flat = {
            ...raw,
            full_name: raw.full_name ?? raw.user?.full_name,
            email:     raw.email     ?? raw.user?.email,
            role:      raw.role      ?? raw.user?.role,
          } as Profile

          setProfile(flat)
        } catch (err) {
          console.error('Failed to fetch profile', err)
          setProfile(null)
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [status, user])

  if (loading) {
    return <div className="text-center py-8">Loading…</div>
  }
  if (!profile) {
    return <div className="text-center py-8">Profile not found</div>
  }
  return (
    <ProfileEditCard
      role={profile.role as any}
      data={profile}
      onSaved={updated => setProfile(updated)}
    />
  )
}
