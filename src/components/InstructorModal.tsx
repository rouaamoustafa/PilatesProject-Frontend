// src/components/InstructorModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Camera, Instagram, FileText } from 'lucide-react'
import api from '@/store/api/axios'
import type {
  CreateInstructorDto,
  UpdateInstructorDto,
  Instructor,
  Role,
} from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  instructor?: Instructor
  onSuccess?: (inst: Instructor) => void
}

export default function InstructorModal({
  open,
  onOpenChange,
  instructor,
  onSuccess,
}: Props) {
  const isEdit = Boolean(instructor)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // text fields
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio]           = useState('')
  const [link, setLink]         = useState('')
  // role as string union
  const [role, setRole]         = useState<Role>('instructor')

  // files + preview
  const [imageFile, setImageFile]   = useState<File>()
  const [cvFile, setCvFile]         = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>()

  // on open, prefill if editing
  useEffect(() => {
    if (!open) return
    if (isEdit && instructor) {
      setFullName(instructor.full_name)
      setEmail(instructor.email)
      setBio(instructor.bio ?? '')
      setLink(instructor.link ?? '')
      setRole(instructor.role)
      setPreviewUrl(
        instructor.image
          ? `/uploads/instructors/${instructor.image}`
          : undefined
      )
    } else {
      setFullName('')
      setEmail('')
      setPassword('')
      setBio('')
      setLink('')
      setRole('instructor')
      setPreviewUrl(undefined)
    }
    setImageFile(undefined)
    setCvFile(undefined)
  }, [open, isEdit, instructor])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || (!isEdit && !password)) {
      toast.error('Name, email and (on create) password are required')
      return
    }
    setIsSubmitting(true)

    // Build DTO
    const dto: Partial<CreateInstructorDto & UpdateInstructorDto> = {
      full_name: fullName,
      email,
      role,
      bio: bio || undefined,
      link: link || undefined,
      ...(isEdit ? {} : { password }),
    }

    // Build FormData
    const formData = new FormData()
    Object.entries(dto).forEach(([k, v]) => {
      if (v != null) formData.append(k, v as any)
    })
    if (imageFile) formData.append('image', imageFile)
    if (cvFile)    formData.append('cv', cvFile)

    try {
      let resp
      if (isEdit) {
        resp = await api.patch<Instructor>(
          `/instructors/${instructor!.id}`,
          formData
        )
        toast.success('Instructor updated!')
      } else {
        resp = await api.post<Instructor>('/instructors', formData)
        toast.success('Instructor created!')
      }
      onOpenChange(false)
      onSuccess?.(resp.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {isEdit ? 'Edit Instructor' : 'Add Instructor'}
          </DialogTitle>
          <DialogDescription className="mb-6">
            {isEdit
              ? 'Update the details below and save your changes.'
              : 'Fill out the form to create a new instructor.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar picker */}
          <div className="flex justify-center">
            <div className="relative w-32 h-32 group cursor-pointer">
              <div className="w-full h-full rounded-full border-4 border-teal-500 overflow-hidden bg-gray-100">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera size={48} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-25 opacity-0 group-hover:opacity-100 transition">
                <Camera className="text-white" size={24} />
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 opacity-0"
              />
            </div>
          </div>

          {/* Full Name */}
          <div>
            <Label htmlFor="fullName" className="block mb-1">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="font-serif text-lg"
            />
          </div>

          {/* Email / Password / Role */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email" className="block mb-1">Email *</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
              />
            </div>
            {!isEdit && (
              <div>
                <Label htmlFor="password" className="block mb-1">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="role" className="block mb-1">Role *</Label>
              <select
                id="role"
                value={role}
                onChange={e => setRole(e.target.value as Role)}
                className="w-full border rounded p-2"
              >
                <option value="instructor">Instructor</option>
                <option value="gym_owner">Gym Owner</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Superadmin</option>
                <option value="subscriber">Subscriber</option>
              </select>
            </div>
          </div>

          {/* Bio & Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="bio" className="block mb-1">Bio</Label>
              <textarea
                id="bio"
                value={bio}
                onChange={e => setBio(e.target.value)}
                placeholder="Short bio"
                className="w-full border rounded-md p-2 h-24"
              />
            </div>
            <div>
              <Label htmlFor="link" className="block mb-1 flex items-center gap-2">
                Link <Instagram className="text-pink-500" />
              </Label>
              <Input
                id="link"
                type="url"
                value={link}
                onChange={e => setLink(e.target.value)}
                placeholder="https://instagram.com/username"
              />
            </div>
          </div>

          {/* CV Upload */}
          <div>
            <Label className="block mb-1">Upload CV (PDF)</Label>
            <Button
              variant="outline"
              onClick={() => document.getElementById('cvInput')?.click()}
            >
              <FileText className="inline mr-1" /> Choose CV
            </Button>
            <span className="ml-4">{cvFile?.name ?? 'No file chosen'}</span>
            <input
              id="cvInput"
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={e => setCvFile(e.target.files?.[0])}
            />
          </div>

          {/* Actions */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEdit ? 'Saving...' : 'Creating...'
                : isEdit ? 'Save Changes' : 'Create Instructor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
