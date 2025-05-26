'use client';

import React, { Fragment, useEffect, useState, useCallback } from 'react';
import {
  ColumnDef, getCoreRowModel, useReactTable, flexRender,
} from '@tanstack/react-table';
import {
  ChevronDown, ChevronRight, Trash2, Edit2, Search,
} from 'lucide-react';
import api from '@/store/api/axios';
import { Button } from '@/components/ui/button';
import { Input }  from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'react-toastify';
import type { Course } from '@/types';

interface ApiResponse<T> {
  courses?: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

interface Props<T> {
  endpoint: string;
  filterValue: string;
  onFilterChange: (v: string) => void;
  onEdit: (item: T) => void;
  onDelete?: (id: string) => void | Promise<void>;
  onRefresh?: () => void; // optional, parent can force full remount
}

export default function CourseTable<T extends { id: string }>({
  endpoint, filterValue, onFilterChange, onEdit, onDelete, onRefresh,
}: Props<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<ApiResponse<T>>(endpoint, {
        params: { page, pageSize, search: filterValue },
      });
      setItems(data.courses ?? []);
      setTotalCount(data.totalCount);
      setPageSize(data.pageSize);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch');
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize, filterValue]);

  useEffect(() => { fetchData() }, [fetchData]);

  // Delete logic
  const confirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      if (onDelete) {
        await onDelete(toDeleteId);
      } else {
        await api.delete(`${endpoint}/${toDeleteId}`);
      }
      toast.success('Course deleted');
      // Reset page to first page if it was last item on current page
      if (items.length === 1 && page > 0) {
        setPage(page - 1);
      }
      if (onRefresh) {
        onRefresh();
      } else {
        fetchData();
      }
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || 'Failed to delete. Try again.'
      );
    } finally {
      setToDeleteId(null);
    }
  };

  const columns: ColumnDef<T>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const open = !!expanded[row.id];
        return (
          <Button
            size="icon"
            variant="outline"
            onClick={() => setExpanded(x => ({ ...x, [row.id]: !open }))}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        );
      },
    },
    { accessorKey: 'title', header: 'Title' },
    {
      accessorFn: (r: any) =>
        r.instructor?.full_name ||
        r.instructor?.user?.full_name ||
        '—',
      id: 'instructor',
      header: 'Instructor',
    },
    { accessorKey: 'level', header: 'Level' },
    { accessorKey: 'mode', header: 'Mode' },
    { accessorKey: 'date', header: 'Date' },
    { accessorKey: 'startTime', header: 'Start Time' },
    { accessorKey: 'durationMinutes', header: 'Duration (min)' },
    { accessorKey: 'price', header: 'Price' },
    {
      accessorFn: (r: any) => r.location?.address || '—',
      id: 'location',
      header: 'Location',
    },
    // {
    //   id: 'actions',
    //   header: 'Actions',
    //   cell: ({ row }) => (
    //     <div className="flex gap-2">
    //       <Button size="icon" onClick={() => onEdit(row.original)}>
    //         <Edit2 size={16} />
    //       </Button>
    //       <Button
    //         size="icon"
    //         variant="destructive"
    //         onClick={() => setToDeleteId(row.id)}
    //       >
    //         <Trash2 size={16} />
    //       </Button>
    //     </div>
    //   ),
    // },
  ];

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: r => (r as any).id,
  });

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <>
      {/* search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <Input
          placeholder="Search courses…"
          value={filterValue}
          onChange={e => onFilterChange(e.target.value)}
          className="w-64 pl-10"
        />
      </div>

      {/* table */}
      <div className="overflow-auto rounded-lg border bg-white shadow">
        <table className="min-w-full text-sm border-separate border-spacing-y-2">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="px-4 py-2 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                <tr
                  className="hover:bg-gray-50 cursor-pointer"
                  onDoubleClick={() => onEdit(row.original)}
                >
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {expanded[row.id] && (
                  <tr>
                    <td colSpan={columns.length} className="p-4 bg-gray-50">
                      <pre className="text-xs">{JSON.stringify(row.original, null, 2)}</pre>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {loading && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">Loading…</td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-red-600">{error}</td>
              </tr>
            )}
            {!loading && !error && items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">No courses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* pagination */}
      <div className="flex items-center justify-between mt-4">
        <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
          ← Prev
        </Button>
        <span>Page {page + 1} of {totalPages}</span>
        <Button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
        >
          Next →
        </Button>
      </div>

      {/* confirm delete */}
      <Dialog
        open={!!toDeleteId}
        onOpenChange={open => !open && setToDeleteId(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDeleteId(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
