'use client'

import { useState, useEffect, FormEvent } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input }  from '@/components/ui/input'
import { Label }  from '@/components/ui/label'
import { MapPin } from 'lucide-react'
import api        from '@/store/api/axios'
import type {
  GymOwner,
  CreateGymOwnerDto,
  UpdateGymOwnerDto,
  Role,
} from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  gymOwner?: GymOwner
  onSuccess?: (g: GymOwner) => void
}

export default function GymOwnerModal({
  open,
  onOpenChange,
  gymOwner,
  onSuccess,
}: Props) {
  const isEdit = !!gymOwner
  const [busy, setBusy] = useState(false)

  // form fields
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [bio,      setBio]      = useState('')
  const [address,  setAddress]  = useState('')
  const [mapLink,  setMapLink]  = useState('')
  const role: Role = 'gym_owner'

  // prefill on open
  useEffect(() => {
    if (!open) return
    if (isEdit && gymOwner) {
      setFullName(gymOwner.full_name)
      setEmail(gymOwner.email)
      setPhone(gymOwner.phone ?? '')
      setBio(gymOwner.bio ?? '')
      setAddress(gymOwner.address?.address ?? '')
      setMapLink(gymOwner.address?.mapLink ?? '')
    } else {
      setFullName(''); setEmail(''); setPhone('')
      setBio(''); setAddress(''); setMapLink('')
    }
  }, [open, isEdit, gymOwner])

  // geolocation helper
  const fillCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setMapLink(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`)
        toast.success('Location added')
      },
      () => toast.error('Unable to get location'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  // submit handler
  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!fullName || !email) {
      toast.error('Name & email required')
      return
    }
    if (!address || address.trim() === '') {
      toast.error('Address is required')
      return
    }
  
    // No need to check mapLink, it's optional
    const dto: Partial<CreateGymOwnerDto & UpdateGymOwnerDto> = {
      full_name: fullName,
      email,
      role,
      phone: phone || undefined,
      bio: bio || undefined,
      address: address || undefined,
      mapLink: mapLink || undefined,
    }
  
    setBusy(true)
    try {
      const url = isEdit ? `/gym-owners/${gymOwner!.id}` : '/gym-owners'
      const req = isEdit ? api.patch : api.post
      const { data } = await req<GymOwner>(url, dto)
      toast.success(isEdit ? 'Changes saved' : 'Gym owner created')
      onSuccess?.(data)
      onOpenChange(false)
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error')
    } finally {
      setBusy(false)
    }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-2xl overflow-hidden">
        {/* header */}
        <DialogHeader className="px-8 pt-8 pb-4 bg-white">
          <DialogTitle className="text-2xl font-semibold">
            {isEdit ? 'Edit Gym Owner' : 'Add Gym Owner'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update and save the owner’s details.'
              : 'Fill out the form to create a new owner.'}
          </DialogDescription>
        </DialogHeader>

        {/* scrollable form */}
        <div className="max-h-[70vh] overflow-y-auto px-8">
          <form id="ownerForm" onSubmit={submit} className="space-y-6 py-6">
            {/* Full name */}
            <div>
              <Label>Full name *</Label>
              <Input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Email */}
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Phone */}
            <div>
              <Label>Phone</Label>
              <Input
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Bio */}
            <div>
              <Label>Bio</Label>
              <textarea
                className="w-full rounded-md border px-3 py-2 h-24 mt-2"
                value={bio}
                onChange={e => setBio(e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <Label>Address</Label>
              <Input
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="mt-2"
              />
            </div>

            {/* Map link */}
            <div>
              <Label className="flex items-center justify-between">
                <span>Google Maps link</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={fillCurrentLocation}
                >
                  Use current
                </Button>
              </Label>
              <div
                className={`flex items-center gap-3 rounded-full px-4 py-2 mt-2 transition
                  border ${mapLink ? 'border-teal-500 ring-1 ring-teal-200' : 'border-gray-300'}
                `}
              >
                <MapPin
                  size={20}
                  className={mapLink ? 'text-teal-500' : 'text-gray-400'}
                />
                <input
                  type="url"
                  value={mapLink}
                  onChange={e => setMapLink(e.target.value)}
                  placeholder="https://maps.google.com/…"
                  className="flex-1 bg-transparent outline-none placeholder-gray-400"
                />
              </div>
            </div>

            {/* bottom spacer so last field isn't hidden */}
            <div className="h-4" />
          </form>
        </div>

        {/* footer with form binding */}
        <DialogFooter className="px-8 pb-8 pt-4 bg-white">
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="ownerForm"
            disabled={busy}
          >
            {busy
              ? (isEdit ? 'Saving…' : 'Creating…')
              : (isEdit ? 'Save'    : 'Create')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
