'use client';

import { useState } from 'react';
import { Button }   from '@/components/ui/button';
import CourseTable  from '@/components/CourseTable';
import CourseModal  from '@/components/CourseModal';
import type { Course } from '@/types';

export default function ClassesPage() {
  const [filter, setFilter]    = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected]   = useState<Course | null>(null);
  const [tableKey, setTableKey]   = useState(0);

  const openNew = () => {
    setSelected(null);
    setModalOpen(true);
  };

  const openEdit = (c: Course) => {
    setSelected(c);
    setModalOpen(true);
  };

  const onSuccess = () => {
    setModalOpen(false);
    setTableKey(k => k + 1);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Courses</h1>
        <Button onClick={openNew}>+ New Course</Button>
      </div>

      <CourseTable<Course>
        key={tableKey}
        endpoint="/courses"
        filterValue={filter}
        onFilterChange={setFilter}
        onEdit={openEdit}
        onDelete={() => setTableKey(k => k + 1)}
      />

      <CourseModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        course={selected ?? undefined}
        onSuccess={onSuccess}
      />
    </div>
  );
}
