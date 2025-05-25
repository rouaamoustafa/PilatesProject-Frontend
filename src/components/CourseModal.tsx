'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import { Label }  from '@/components/ui/label';
import {
  Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem,
} from '@/components/ui/select';
import { toast } from 'react-toastify';
import api from '@/store/api/axios';
import {
  Course, CreateCourseDto, UpdateCourseDto,
  Level, Mode, InstructorOption, LocationOption,
} from '@/types';
import { useAuth } from '@/hooks/useAuth';

interface PublicInstructorsResponse {
  users: InstructorOption[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course;
  onSuccess?: () => void;
}

export default function CourseModal({
  open, onOpenChange, course, onSuccess,
}: Props) {
  const isEdit = !!course;
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);

  // form state
  const [title, setTitle] = useState('');
  const [instructorId, setInstructorId] = useState('');
  const [level, setLevel] = useState<Level>(Level.BEGINNER);
  const [mode, setMode] = useState<Mode>(Mode.ONLINE);
  const [locationId, setLocationId] = useState('');
  const [price, setPrice] = useState(0);
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);

  const [instructors, setInstructors] = useState<InstructorOption[]>([]);
  const [locations, setLocations]     = useState<LocationOption[]>([]);

  // Robustly fetch instructors for gym owners (and flatten if needed)
  useEffect(() => {
    if (!open) return;

    const fetchInstructors = async () => {
      try {
        if (user?.role === 'gym_owner') {
          const { data } = await api.get('/gym-owners/me/instructors');
          // Accepts both flat [{id, full_name...}] and nested [{user:{id,full_name...}}]
          const flat: InstructorOption[] = Array.isArray(data)
            ? data.map((i: any) =>
                i.id && i.full_name
                  ? i
                  : {
                      id: i.user?.id,
                      full_name: i.user?.full_name,
                      email: i.user?.email,
                      role: i.user?.role,
                    }
              )
            : [];
          setInstructors(flat);
        } else {
          const { data } = await api.get<PublicInstructorsResponse>('/instructors/public', {
            params: { page: 0, pageSize: 100, search: '' },
          });
          setInstructors(data.users);
        }
      } catch {
        toast.error('Failed loading instructors');
      }
    };

    const fetchLocations = async () => {
      try {
        const { data } = await api.get<LocationOption[]>('/locations');
        setLocations(data);
      } catch {
        toast.error('Failed loading locations');
      }
    };

    fetchInstructors();
    fetchLocations();

    if (isEdit && course) {
      setTitle(course.title);

      // Robust: Accept id in instructor or instructor.user
      const instructorId =
        (course.instructor as any)?.id ||
        (course.instructor as any)?.user?.id ||
        '';
      setInstructorId(instructorId);

      setLevel(course.level);
      setMode(course.mode);
      setLocationId(course.location?.id || '');
      setPrice(course.price);
      setDate(course.date);
      setStartTime(course.startTime);
      setDurationMinutes(course.durationMinutes);
    } else {
      setTitle('');
      setInstructorId('');
      setLevel(Level.BEGINNER);
      setMode(Mode.ONLINE);
      setLocationId('');
      setPrice(0);
      setDate('');
      setStartTime('');
      setDurationMinutes(60);
    }
  // eslint-disable-next-line
  }, [open, isEdit, course, user?.role]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title || !instructorId || !date || !startTime) {
      toast.error('Title, instructor, date & time are required');
      return;
    }

    const dto: CreateCourseDto & UpdateCourseDto = {
      title,
      instructorId,
      level,
      mode,
      locationId: locationId || undefined,
      price,
      date,
      startTime,
      durationMinutes,
    };

    setBusy(true);
    try {
      if (isEdit && course) {
        await api.patch(`/courses/${course.id}`, dto);
        toast.success('Course updated');
      } else {
        // Use special endpoint for gym owner; admin uses public
        if (user?.role === 'gym_owner') {
          await api.post('/courses/me', dto);
        } else {
          await api.post('/courses', dto);
        }
        toast.success('Course created');
      }
      onSuccess?.();
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error saving course');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-full rounded-2xl overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-2xl font-semibold">
            {isEdit ? 'Edit Course' : 'Add Course'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update and save course details.'
              : 'Fill out the form to create a new course.'}
          </DialogDescription>
        </DialogHeader>

        <form id="courseForm" onSubmit={submit} className="px-8 space-y-4">
          {/* Title */}
          <div>
            <Label>Title *</Label>
            <Input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Instructor */}
          <div>
            <Label>Instructor *</Label>
            <Select
              onValueChange={(v: string) => setInstructorId(v)}
              value={instructorId}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="Select an instructor" />
              </SelectTrigger>
              <SelectContent>
                {instructors.map(i => (
                  <SelectItem key={i.id} value={i.id}>
                    {i.full_name} – {i.email} {i.role ? `(${i.role})` : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Level & Mode */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Level *</Label>
              <Select onValueChange={v => setLevel(v as Level)} value={level}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Level.BEGINNER}>Beginner</SelectItem>
                  <SelectItem value={Level.INTERMEDIATE}>Intermediate</SelectItem>
                  <SelectItem value={Level.ADVANCED}>Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Mode *</Label>
              <Select onValueChange={v => setMode(v as Mode)} value={mode}>
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Mode.ONLINE}>Online</SelectItem>
                  <SelectItem value={Mode.ONSITE}>Onsite</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location */}
          <div>
            <Label>Location</Label>
            <Select
              onValueChange={v => setLocationId(v)}
              value={locationId}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue placeholder="(optional)" />
              </SelectTrigger>
              <SelectContent>
                {locations.map(l => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.address}
                    {l.mapLink && (
                      <> – <a href={l.mapLink} target="_blank" className="underline">map</a></>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Price (USD)</Label>
              <Input
                type="number"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Duration (minutes)</Label>
              <Input
                type="number"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="mt-2"
              />
            </div>
          </div>

          {/* Date & Start Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label>Start Time *</Label>
              <Input
                type="time"
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        </form>

        <DialogFooter className="px-8 pb-8 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={busy}>
            Cancel
          </Button>
          <Button form="courseForm" type="submit" disabled={busy}>
            {busy
              ? isEdit
                ? 'Saving…'
                : 'Creating…'
              : isEdit
              ? 'Save'
              : 'Create'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
