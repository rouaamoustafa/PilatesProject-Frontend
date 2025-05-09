// src/app/dashboard/modals/AddUserModal.tsx
'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import api from '@/store/api/axios';
import { useAppDispatch, useAppSelector } from '@/store';
// import { fetchUsers } from '@/store/slices/usersSlice';
import { toast, ToastContainer } from 'react-toastify';

function validate(v: {
  full_name: string;
  email: string;
  password: string;
  role: string;
  phone?: string;
}) {
  const err: Record<string, string> = {};
  if (!v.full_name.trim()) err.full_name = 'Name is required';
  if (!/^[\w-]+@[\w.-]+\.\w{2,}$/.test(v.email))
    err.email = 'Enter a valid e-mail';
  if (v.password.length < 6) err.password = 'Min 6 characters';
  if (v.role === 'gym_owner' && v.phone && !/^[0-9+ ]+$/.test(v.phone))
    err.phone = 'Digits only';
  return err;
}

function isAxiosError(error: unknown): error is { response?: any; isAxiosError: true } {
  return (error as any)?.isAxiosError === true;
}

interface UserResp {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export default function AddUserModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const dispatch = useAppDispatch();
  // const { page, pageSize } = useAppSelector(s => s.users);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'subscriber',
    bio: '',
    link: '',
    phone: '',
    address: '',
    mapLink: '',
    image: undefined as File | undefined,
    cv: undefined as File | undefined,
  });

  const handle = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const tgt = e.target as HTMLInputElement;
    const { name, value, files } = tgt;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const reset = () => {
    setForm({
      full_name: '',
      email: '',
      password: '',
      role: 'subscriber',
      bio: '',
      link: '',
      phone: '',
      address: '',
      mapLink: '',
      image: undefined,
      cv: undefined,
    });
    setErrs({});
  };

  const submit = async () => {
    setSaving(true);
    try {
      const { data: user } = await api.post<UserResp>('/users', {
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      if (form.role === 'instructor') {
        const fd = new FormData();
        fd.append('userId', user.id);
        fd.append('bio', form.bio);
        fd.append('link', form.link);
        if (form.image) fd.append('image', form.image);
        await api.post('/instructors', fd);
      }

      if (form.role === 'gym_owner') {
        const fd = new FormData();
        fd.append('userId', user.id);
        fd.append('bio', form.bio);
        fd.append('phone', form.phone);
        fd.append('address', form.address);
        fd.append('mapLink', form.mapLink);
        if (form.image) fd.append('image', form.image);
        if (form.cv)    fd.append('cv', form.cv);
        await api.post('/gym-owners', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      toast.success('User created');
      // dispatch(fetchUsers({ page, pageSize, filter: '' }));
      onOpenChange(false);
      reset();
    } catch (err: unknown) {
      if (isAxiosError(err)) {
        const { status, data } = err.response ?? {};
        if (status === 409) toast.error('Email is already registered');
        else if (status === 400 && typeof data?.message === 'string')
          toast.error(data.message);
        else toast.error('Server error');
      } else {
        toast.error('Unexpected error');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="space-y-4 max-w-lg">
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription>
              Fill fields and click <strong>Create</strong>.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e: FormEvent) => {
              e.preventDefault();
              const vErrs = validate({
                full_name: form.full_name,
                email: form.email,
                password: form.password,
                role: form.role,
                phone: form.phone,
              });
              setErrs(vErrs);
              if (Object.keys(vErrs).length === 0) submit();
            }}
            className="space-y-4"
          >
            {/* … your inputs here, unchanged … */}
            <Button type="submit" disabled={saving} className="w-full">
              {saving ? 'Saving…' : 'Create'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
