'use client'

import { useState } from 'react'
import Cropper from 'react-easy-crop'
import { toast } from 'react-toastify'
import {
  Camera,
  Instagram,
  FileText,
} from 'lucide-react'

import { appendDefined } from '@/lib/form'
import getCroppedImg from '@/components/cropImage'
import api from '@/store/api/axios'
import { imageUrl } from '@/lib/storage'

import {
  Role,
  Instructor,
  GymOwner,
  UpdateGymOwnerDto,
  UpdateInstructorDto,
} from '@/types'

import {Button} from '@/components/ui/button'
import {Input } from '@/components/ui/input'
import {Label } from '@/components/ui/label'

interface Props { 
  /** current user role */
  role: Role
  /** profile data (Instructor | GymOwner) */
  data: Instructor | GymOwner
  /** callback after save */
  onSaved?: (u: Instructor | GymOwner) => void
}

type AnyDto = UpdateInstructorDto & UpdateGymOwnerDto

export default function ProfileEditCard({ role, data, onSaved }: Props) {
  // ---------------- state ----------------
  const [fullName, setFullName] = useState(data.full_name)
  const [email,    setEmail]    = useState(data.email)
  const [password, setPassword] = useState('')

  const [bio,      setBio]      = useState('bio' in data ? data.bio ?? '' : '')
  const [link,     setLink]     = useState('link' in data ? data.link ?? '' : '')
  const [phone,    setPhone]    = useState('phone' in data ? data.phone ?? '' : '')
  const [address,  setAddress]  = useState(
    'address' in data ? data.address?.address ?? '' : '',
  )
  const [mapLink,  setMapLink]  = useState(
    'address' in data ? data.address?.mapLink ?? '' : '',
  )

  // files + preview
  const [imageFile, setImageFile] = useState<File>()
  const [cvFile,    setCvFile]    = useState<File>()
  const [previewUrl, setPreview]  = useState(
    data.image ? imageUrl(data.image) : undefined,
  )

  // cropper
  const [cropSrc, setCropSrc]             = useState<string>()
  const [crop, setCrop]                   = useState({ x: 0, y: 0 })
  const [zoom, setZoom]                   = useState(1)
  const [croppedAreaPixels, setPixels]    = useState<any>(null)
  const [cropOpen, setCropOpen]           = useState(false)

  // ---------------- handlers -------------
  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setCropSrc(ev.target?.result as string)
      setCropOpen(true)
    }
    reader.readAsDataURL(file)
  }

  const onCropComplete = (_: any, p: any) => setPixels(p)

  const confirmCrop = async () => {
    if (!cropSrc || !croppedAreaPixels) return
    const blob = await getCroppedImg(cropSrc, croppedAreaPixels)
    const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
    setImageFile(file)
    setPreview(URL.createObjectURL(blob))
    setCropOpen(false)
  }

  // ---------------- submit ---------------
  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      toast.error('Name and email are required'); return
    }

    /* ───── password client-side rule ───── */
  if (password && password.length < 6) {
    toast.error('Password must be at least 6 characters')
    return
  }
    const dto: AnyDto = {
      // full_name: fullName,
      // email,
      ...(password && { password }),
      ...(role === 'gym_owner' && {
        phone: phone || undefined,
        address: address || undefined,
        mapLink: mapLink || undefined,
        bio: bio || undefined,
      }),
      ...(role === 'instructor' && {
        bio:  bio || undefined,
        link: link || undefined,
      }),
    }

    // const fd = new FormData()
    // appendDefined(fd, dto)
    // if (imageFile) fd.append('image', imageFile)
    // if (cvFile)    fd.append('cv', cvFile)

    try {
       const url = role === 'gym_owner' ? '/gym-owners/me' : '/instructors/me'

 // decide request format
 if (imageFile || cvFile) {
   const fd = new FormData()
   appendDefined(fd, dto)
   if (imageFile) fd.append('image', imageFile)
   if (cvFile)    fd.append('cv',    cvFile)
   await api.patch(url, fd, {
     headers: { 'Content-Type': 'multipart/form-data' },
   })
 } else {
   await api.patch(url, dto)              // plain JSON
 }
      // await api.patch(url, fd, {
      //   headers: { 'Content-Type': 'multipart/form-data' },
      // })

      toast.success('Profile updated')
      onSaved?.({ ...data, ...dto } as any)
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Error')
    }
  }

  // --------------- UI --------------------
  return (
    <div className="max-w-3xl mx-auto mt-6 bg-white rounded-xl shadow p-8">
      {/* avatar + upload */}
      {/* <div className="flex justify-center">
        <div className="relative w-28 h-28 rounded-full border-2 border-teal-500 overflow-hidden">
          {previewUrl ? (
            <img src={previewUrl} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-teal-400">
              <Camera size={32} />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onFileSelect}
          />
        </div>
      </div> */}

      {/* main form */}
      <form onSubmit={save} className="mt-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Full Name *</Label>
            <Input value={fullName} readOnly={Boolean(data)} />
          </div>
          <div>
            <Label>Email *</Label>
            <Input
              type="email"
              value={email}
              readOnly={Boolean(data)}
            />
          </div>
        </div>

        {/* password */}
        <div>
          <Label>New Password</Label>
          <Input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Leave blank to keep current"
          />
        </div>

        {/* bio / phone / etc. */}
        {role === 'gym_owner' && (
          <>
            <div>
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full rounded-md border px-3 py-2 h-24"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <Label>Address</Label>
                <Input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label>Google Maps Link</Label>
              <Input
                value={mapLink}
                onChange={e => setMapLink(e.target.value)}
              />
            </div>
          </>
        )}

        {role === 'instructor' && (
          <>
            <div>
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full rounded-md border px-3 py-2 h-24"
              />
            </div>
            <div>
              <Label>Instagram Link</Label>
              <Input value={link} onChange={e => setLink(e.target.value)} />
            </div>
            <div>
              <Label>Upload CV (PDF)</Label>
              <input
                type="file"
                accept="application/pdf"
                onChange={e => setCvFile(e.target.files?.[0])}
              />
            </div>
          </>
        )}

        <Button type="submit" className="mt-4 w-full">
          Save Changes
        </Button>
      </form>

      {/* crop overlay */}
      {cropOpen && cropSrc && (
        <div className="fixed inset-0 bg-black/60 grid place-items-center z-50">
          <div className="bg-white rounded-xl p-6 w-[340px]">
            <div className="relative w-full h-64 bg-gray-800">
              <Cropper
                image={cropSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
              className="w-full mt-4"
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setCropOpen(false)}>
                Cancel
              </Button>
              <Button onClick={confirmCrop}>Use Photo</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
