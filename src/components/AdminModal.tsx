'use client'

import { useForm } from 'react-hook-form'
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
import { createAdmin, updateAdmin } from '@/services/adminService'
import type { User } from '@/types'

interface AdminForm {
  full_name: string
  email: string
}

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  admin?: User
  onSuccess: () => void
}

export default function AdminModal({
  open,
  onOpenChange,
  admin,
  onSuccess,
}: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminForm>({
    defaultValues: admin
      ? { full_name: admin.full_name, email: admin.email }
      : { full_name: '', email: '' },
  })

  const onSubmit = async (data: AdminForm) => {
    if (admin) {
      await updateAdmin(admin.id, {
        full_name: data.full_name,
        email: data.email,
      })
    } else {
      await createAdmin({
        full_name: data.full_name,
        email: data.email,
        password: data.email, // default password = email
      })
    }
    reset()
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{admin ? 'Edit Admin' : 'New Admin'}</DialogTitle>
          <DialogDescription>
            {admin
              ? 'Update name or email.'
              : 'New admin’s initial password is their email.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input
              placeholder="Full Name"
              {...register('full_name', { required: true })}
            />
            {errors.full_name && (
              <p className="text-red-600 text-sm">Required</p>
            )}
          </div>

          <div>
            <Input
              placeholder="Email"
              type="email"
              {...register('email', { required: true })}
            />
            {errors.email && (
              <p className="text-red-600 text-sm">Valid email required</p>
            )}
          </div>

          <DialogFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                reset()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {admin ? 'Save Changes' : 'Create Admin'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
