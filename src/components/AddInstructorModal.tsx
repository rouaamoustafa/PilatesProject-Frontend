// src/components/AddInstructorModal.tsx
'use client'

import { useState } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import api from '@/store/api/axios'
import type { CreateInstructorDto, Instructor } from '@/types'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (inst: Instructor) => void
}

export default function AddInstructorModal({
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [bio, setBio] = useState('')
  const [link, setLink] = useState('')
  const [imageFile, setImageFile] = useState<File | undefined>(undefined)
  const [cvFile, setCvFile] = useState<File | undefined>(undefined)

  const resetForm = () => {
    setFullName('')
    setEmail('')
    setPassword('')
    setBio('')
    setLink('')
    setImageFile(undefined)
    setCvFile(undefined)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !password) {
      toast.error('Name, email, and password are required')
      return
    }
    setIsSubmitting(true)

    const dto: CreateInstructorDto = {
      full_name: fullName,
      email,
      password,
      role: 'instructor',
      bio: bio || undefined,
      link: link || undefined,
      image: imageFile as any,
      cv: cvFile as any,
    }

    const formData = new FormData()
    Object.entries(dto).forEach(([k, v]) => {
      if (v !== undefined) formData.append(k, v as any)
    })

    try {
      const { data } = await api.post<Instructor>(
        '/instructors',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      toast.success('Instructor created successfully!')
      onOpenChange(false)
      resetForm()
      onSuccess?.(data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || 'Failed to add instructor')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Instructor</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Short bio"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageFile">Profile Image</Label>
            <Input
              id="imageFile"
              type="file"
              accept="image/*"
              onChange={e => setImageFile(e.target.files?.[0])}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cvFile">CV (PDF)</Label>
            <Input
              id="cvFile"
              type="file"
              accept="application/pdf"
              onChange={e => setCvFile(e.target.files?.[0])}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => { onOpenChange(false); resetForm() }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Instructor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
