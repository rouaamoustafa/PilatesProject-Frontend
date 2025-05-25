'use client'

import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/components/cropImage'
import { imageUrl } from '@/lib/storage'

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
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [link, setLink] = useState('')
  const [role] = useState<Role>('instructor')

  // file + preview state
  const [imageFile, setImageFile] = useState<File>()
  const [cvFile, setCvFile] = useState<File>()
  const [previewUrl, setPreviewUrl] = useState<string>()

  // cropping state
  const [cropModal, setCropModal] = useState(false)
  const [cropSrc, setCropSrc] = useState<string>()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedArea, setCroppedArea] = useState<any>(null)

  // initialize form fields when opening
  useEffect(() => {
    if (!open) return
    if (isEdit && instructor) {
      setFullName(instructor.full_name)
      setEmail(instructor.email)
      setBio(instructor.bio || '')
      setLink(instructor.link || '')
      setPreviewUrl(instructor.image ? imageUrl(instructor.image) : undefined)
    } else {
      setFullName('')
      setEmail('')
      setBio('')
      setLink('')
      setPreviewUrl(undefined)
    }
    setImageFile(undefined)
    setCvFile(undefined)
    setCropSrc(undefined)
    setCropModal(false)
    setZoom(1)
    setCrop({ x: 0, y: 0 })
    setCroppedArea(null)
  }, [open, isEdit, instructor])

  // handle file selection for cropping
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setCropSrc(ev.target?.result as string)
      setCropModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = (_: any, pixels: any) => setCroppedArea(pixels)
  const handleCropConfirm = async () => {
    if (!cropSrc || !croppedArea) return
    const blob = await getCroppedImg(cropSrc, croppedArea)
    setImageFile(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }))
    setPreviewUrl(URL.createObjectURL(blob))
    setCropModal(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !email.trim()) {
      toast.error('Name and email are required')
      return
    }
    setIsSubmitting(true)
  
    // Only include password on create (not edit)
    const dto: Partial<CreateInstructorDto & UpdateInstructorDto> = {
      full_name: fullName,
      email,
      role,
      bio: bio || undefined,
      link: link || undefined,
      ...(isEdit ? {} : { password: email }),
    }
  
    try {
      const url = isEdit ? `/instructors/${instructor!.id}` : '/instructors'
      const formData = new FormData()
      Object.entries(dto).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          formData.append(k, v as any)
        }
      })
      if (imageFile) formData.append('image', imageFile)
      if (cvFile) formData.append('cv', cvFile)
      const response = isEdit
        ? await api.patch<Instructor>(url, formData)
        : await api.post<Instructor>(url, formData)
  
      toast.success(isEdit ? 'Instructor updated!' : 'Instructor created!')
      onOpenChange(false)
      onSuccess?.(response.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || err.message || 'Network error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Crop Dialog */}
      {cropModal && cropSrc && (
        <Dialog open={cropModal} onOpenChange={setCropModal}>
          <DialogContent style={{ width: 400 }}>
            <DialogHeader>
              <DialogTitle>Crop & Zoom Image</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center">
              <div style={{ position: 'relative', width: 300, height: 300, background: '#333' }}>
                <Cropper
                  image={cropSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={e => setZoom(Number(e.target.value))}
                className="w-full my-2"
              />
              <div className="flex gap-2 mt-2">
                <Button variant="outline" onClick={() => setCropModal(false)}>Cancel</Button>
                <Button onClick={handleCropConfirm}>Use Photo</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Main Modal */}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent style={{ width: '90vw', maxWidth: 800 }}>
          <DialogHeader>
            <DialogTitle>{isEdit ? 'Edit Instructor' : 'Add Instructor'}</DialogTitle>
            <DialogDescription>
              {isEdit
                ? 'Update the details below and save your changes.'
                : 'Fill out the form to create a new instructor.'}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-32 group cursor-pointer">
              <div className="w-full h-full rounded-full border-4 border-teal-500 overflow-hidden bg-gray-100">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <Camera size={48} />
                  </div>
                )}
              </div>
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                <Camera size={24} className="text-white w-6 h-6" />
                <span className="ml-2 text-white font-medium">Change</span>
              </div>
              <input type="file" accept="image/*" onChange={handleImageSelect} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="grid grid-cols-1">
                <Label>Full Name *</Label>
                <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
              </div>
              <div>
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full rounded-md border px-3 py-2 h-24"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Upload CV (PDF)</Label>
                <div
                  className={`relative flex flex-col items-center justify-center border-2 border-dashed border-teal-400 bg-white rounded-xl cursor-pointer transition-all hover:bg-teal-50 min-h-[140px] px-4 py-6 ${cvFile ? 'border-teal-600 bg-teal-50' : ''}`}
                  onClick={() => document.getElementById('cvInput')?.click()}
                  onDrop={e => {
                    e.preventDefault()
                    if (e.dataTransfer.files.length) setCvFile(e.dataTransfer.files[0])
                  }}
                  onDragOver={e => e.preventDefault()}
                >
                  {!cvFile ? (
                    <>
                      <FileText size={36} className="text-teal-500 mb-2" />
                      <span className="text-gray-700 font-medium">
                        Drag & drop your CV here, or <span className="text-teal-600 underline">browse</span>
                      </span>
                      <span className="text-xs text-gray-400 mt-1">PDF only, max 5MB</span>
                    </>
                  ) : (
                    <>
                      <FileText size={36} className="text-teal-600 mb-2" />
                      <span className="text-gray-800 font-semibold">{cvFile.name}</span>
                      <button
                        type="button"
                        className="absolute top-2 right-2 text-sm text-red-500 hover:underline"
                        onClick={e => { e.stopPropagation(); setCvFile(undefined) }}
                      >
                        Remove
                      </button>
                    </>
                  )}
                  <input
                    id="cvInput"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={e => setCvFile(e.target.files?.[0])}
                  />
                </div>
              </div>

              <div>
                <Label>Instagram Profile</Label>
                <div className={`flex items-center gap-3 bg-white border-2 ${link ? 'border-teal-500' : 'border-gray-200'} rounded-xl shadow-md px-4 py-4 transition-all focus-within:border-teal-500`}>
                  <Instagram size={28} className="text-teal-500" />
                  <Input
                    type="url"
                    value={link}
                    onChange={e => setLink(e.target.value)}
                    placeholder="https://instagram.com/username"
                    className="border-0 outline-none bg-transparent flex-1 text-lg placeholder-gray-400"
                  />
                  {link && (
                    <a href={link} target="_blank" rel="noopener noreferrer" className="text-teal-500 hover:underline text-sm font-medium">
                      Preview
                    </a>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">Paste your Instagram profile link</span>
              </div>
            </div>

            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>{isEdit ? 'Save Changes' : 'Create Instructor'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
