// // src/app/dashboard/modals/EditUserModal.tsx
// 'use client';

// import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import { useAppDispatch, useAppSelector } from '@/store';
// import { updateUser, fetchUsers } from '@/store/slices/usersSlice';
// import { toast, ToastContainer } from 'react-toastify';

// type Role = 'superadmin' | 'admin' | 'gym_owner' | 'instructor' | 'subscriber';

// interface Props {
//   userId: string;
//   open: boolean;
//   onClose: () => void;
// }

// export default function EditUserModal({ userId, open, onClose }: Props) {
//   const dispatch        = useAppDispatch();
//   //const user            = useAppSelector((s) => s.users.list.find(u => u.id === userId));
//   //const { page, pageSize } = useAppSelector(s => s.users);

//   const [form, setForm] = useState<{ full_name: string; email: string; role: Role }>({
//     full_name: '',
//     email: '',
//     role: 'subscriber',
//   });
//   const [saving, setSaving] = useState(false);

//   useEffect(() => {
//     if (user) {
//       setForm({
//         full_name: user.full_name,
//         email:     user.email,
//         role:      user.role,
//       });
//     }
//   }, [user]);

//   const handle = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setForm(f => ({ ...f, [name]: value } as typeof f));
//   };

//   const submit = async (e: FormEvent) => {
//     e.preventDefault();
//     setSaving(true);
//     try {
//       await dispatch(updateUser({ id: userId, data: form })).unwrap();
//       toast.success('User updated');
//       dispatch(fetchUsers({ page, pageSize, filter: '' }));
//       onClose();
//     } catch {
//       toast.error('Update failed');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!user) return null;

//   return (
//     <>
//       <Dialog open={open} onOpenChange={v => !v && onClose()}>
//         <DialogContent className="max-w-md space-y-4">
//           <DialogHeader>
//             <DialogTitle>Edit User</DialogTitle>
//             <DialogDescription>Change fields and click Save.</DialogDescription>
//           </DialogHeader>

//           <form onSubmit={submit} className="space-y-4">
//             <input
//               name="full_name"
//               value={form.full_name}
//               onChange={handle}
//               className="w-full border px-3 py-2 rounded"
//             />
//             <input
//               name="email"
//               type="email"
//               value={form.email}
//               onChange={handle}
//               className="w-full border px-3 py-2 rounded"
//             />
//             <select
//               name="role"
//               value={form.role}
//               onChange={handle}
//               className="w-full border px-3 py-2 rounded"
//             >
//               <option value="subscriber">subscriber</option>
//               <option value="instructor">instructor</option>
//               <option value="gym_owner">gym_owner</option>
//               <option value="admin">admin</option>
//               <option value="superadmin">superadmin</option>
//             </select>
//             <Button type="submit" disabled={saving} className="w-full">
//               {saving ? 'Saving…' : 'Save'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//       <ToastContainer position="top-right" autoClose={3000} />
//     </>
//   );
// }
