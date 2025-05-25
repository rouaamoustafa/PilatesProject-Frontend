import api from '@/store/api/axios'
import type { User } from '@/types'

export async function fetchAdmins(): Promise<User[]> {
  const res = await api.get<{
    users: User[]
    totalCount: number
  }>('/users/role/admin', {
    params: { page: 0, pageSize: 100 },
  })
  return res.data.users
}

export async function createAdmin(payload: {
  full_name: string
  email: string
  password: string
}): Promise<void> {
  await api.post('/users/admin', payload)
}

export async function updateAdmin(
  id: string,
  payload: Partial<{ full_name: string; email: string }>
): Promise<void> {
  await api.patch(`/users/${id}`, payload)
}

export async function deleteAdmin(id: string): Promise<void> {
  await api.delete(`/users/admin/${id}`)
}
