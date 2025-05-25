'use client'

import { Fragment, useEffect, useState, useCallback } from 'react'
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table'
import { ChevronDown, ChevronRight, Search, Trash2 } from 'lucide-react'
import api from '@/store/api/axios'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ProfileCard from '@/components/ProfileCard'
import { toast } from 'react-toastify'
import { useAuth } from '@/hooks/useAuth'
import type { User } from '@/types'

interface ApiListResponse<T> {
  users?:     T[]
  gymOwners?: T[]
  totalCount: number
  page:       number
  pageSize:   number
}

interface Props<T> {
  endpoint?: string
  filterValue?: string
  onFilterChange?: (v: string) => void
  showRole?: boolean
  allowAdd?: boolean
  onEdit?: (item: T | null) => void
  onDelete?: (id: string) => void | Promise<void>
}

export default function UserTable<T extends { id: string; full_name: string; email: string; role: string }>(
  {
    endpoint = '/instructors',
    filterValue = '',
    onFilterChange = () => {},
    showRole = true,
    allowAdd = false,
    onEdit,
    onDelete,
  }: Props<T>
) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<T[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(12)
  const [totalCount, setTotalCount] = useState(0)

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [profiles, setProfiles] = useState<Record<string, { loading: boolean; error?: string; data?: any }>>({})
  const [toDeleteId, setToDeleteId] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = endpoint === '/users'
        ? { page, pageSize, filter: filterValue }
        : { page, pageSize, search: filterValue }

      const { data } = await api.get<ApiListResponse<T>>(endpoint, { params })
      const list = data.gymOwners ?? data.users ?? []
      setItems(list)
      setTotalCount(data.totalCount)
      setPageSize(data.pageSize)

      const maxPage = Math.max(0, Math.ceil(data.totalCount / data.pageSize) - 1)
      if (page > maxPage) setPage(maxPage)
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint, page, pageSize, filterValue])

  useEffect(() => {
    if (!authLoading) {
      if (['admin', 'superadmin', 'gym_owner'].includes(user?.role || '')) {
        fetchData()
      } else {
        setError('You do not have permission')
      }
    }
  }, [authLoading, user, fetchData])

  const loadProfileData = async (id: string) => {
    setProfiles(p => ({ ...p, [id]: { loading: true } }))
    try {
      const { data } = await api.get(`${endpoint}/${id}`)
      setProfiles(p => ({ ...p, [id]: { loading: false, data } }))
    } catch (err: any) {
      setProfiles(p => ({ ...p, [id]: { loading: false, error: err.message } }))
    }
  }

  const confirmDelete = async () => {
    if (!toDeleteId) return
    try {
      if (onDelete) {
        await onDelete(toDeleteId)
      } else {
        await api.delete(`${endpoint}/${toDeleteId}`)
      }
      toast.success('Deleted.')
      fetchData()
    } catch {
      toast.error('Failed to delete.')
    } finally {
      setToDeleteId(null)
    }
  }

  const columns: ColumnDef<T>[] = [
    {
      id: 'expander',
      header: '',
      cell: ({ row }) => {
        const open = expanded[row.original.id]
        return (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const next = !open
              setExpanded(e => ({ ...e, [row.original.id]: next }))
              if (next && !profiles[row.original.id]) {
                loadProfileData(row.original.id)
              }
            }}
          >
            {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </Button>
        )
      },
    },
    { accessorKey: 'full_name', header: 'Name' },
    { accessorKey: 'email', header: 'Email' },
    ...(showRole ? [{ accessorKey: 'role', header: 'Role' }] : []),
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          {onEdit && (
            <Button size="sm" onClick={() => onEdit(row.original)}>
              Edit
            </Button>
          )}
          <Button size="sm" variant="destructive" onClick={() => setToDeleteId(row.original.id)}>
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: r => r.id,
  })
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

  return (
    <>
      {allowAdd && onEdit && (
        <div className="flex justify-end mb-2">
          <Button onClick={() => onEdit(null)}>+ New</Button>
        </div>
      )}

      <div className="relative mb-4">
        <Input
          placeholder="Search…"
          value={filterValue}
          onChange={e => onFilterChange?.(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-xl border border-gray-300 bg-white shadow-sm focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition w-64"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
      </div>

      <div className="overflow-auto rounded-lg border bg-white shadow">
        <table className="min-w-full text-sm border-separate border-spacing-y-2">
          <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="px-4 py-3 text-left">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <Fragment key={row.id}>
                {/* main row */}
                <tr className="cursor-pointer hover:bg-gray-50" onClick={() => {
                  const next = !expanded[row.original.id]
                  setExpanded(e => ({ ...e, [row.original.id]: next }))
                  if (next && !profiles[row.original.id]) {
                    loadProfileData(row.original.id)
                  }
                }} onDoubleClick={() => onEdit?.(row.original)}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>

                {expanded[row.original.id] && (
                  <tr>
                    <td colSpan={columns.length} className="p-4">
                      {profiles[row.original.id]?.loading
                        ? 'Loading…'
                        : profiles[row.original.id]?.error
                        ? <span className="text-red-600">{profiles[row.original.id]!.error}</span>
                        : <ProfileCard data={profiles[row.original.id]!.data} />
                      }
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}

            {isLoading && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && error && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}
            {!isLoading && !error && items.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="p-6 text-center">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <Button disabled={page === 0} onClick={() => setPage(p => Math.max(0, p - 1))}>
          ← Prev
        </Button>
        <span className="text-sm text-gray-600">
          Page {page + 1} of {totalPages}
        </span>
        <Button disabled={page + 1 >= totalPages} onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}>
          Next →
        </Button>
      </div>

      <Dialog open={!!toDeleteId} onOpenChange={open => !open && setToDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this record? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
