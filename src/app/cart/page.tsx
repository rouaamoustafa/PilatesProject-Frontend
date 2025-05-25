'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { useAppDispatch } from '@/store'
import { useAuth } from '@/hooks/useAuth'
import { selectCartLines } from '@/store/selectors'
import { clearGuest } from '@/store/slices/guestCartSlice'
import {
  useGetCartQuery,
  useRemoveItemMutation,
  useCheckoutMutation,
  useAddToCartMutation,
} from '@/store/cartEndpoints'
import { Trash2 } from 'lucide-react'
import type { CartLine } from '@/types'

export default function CartPage() {
  // Hooks
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const guestLines = useSelector(selectCartLines)
  const [addToCart] = useAddToCartMutation()
  const { data: serverCartData = [], isFetching, refetch } = useGetCartQuery(undefined, { skip: !user });
  const [removeItem] = useRemoveItemMutation()
  const [checkout, { isLoading: checkingOut }] = useCheckoutMutation()

  // SSR hydration guard
  useEffect(() => { setMounted(true) }, [])
  // Merge guest cart into server cart after login or refresh
  useEffect(() => {
    if (user && guestLines.length) {
      Promise.all(
        guestLines.map(g => addToCart({ courseId: g.course.id }).unwrap())
      )
        .then(() => {
          dispatch(clearGuest());
          refetch(); // THIS is what updates the UI with merged items immediately!
        })
        .catch(e => {
          // Merge failed, don't clear guest cart
        });
    }
  }, [user, guestLines, addToCart, dispatch, refetch]);

  // Only show cart UI after mount
  if (!mounted) return <p className="p-8 text-center">Loading cart…</p>
  if (isFetching) return <p className="p-8 text-center">Loading…</p>

  // Use guest cart if not logged in, else server cart
  const lines: CartLine[] = user ? serverCartData : guestLines

  if (!lines.length) {
    return (
      <p className="p-8 text-center">
        Cart is empty.&nbsp;
        <button
          onClick={() => router.push('/book')}
          className="underline text-teal-700"
        >
          Browse classes
        </button>
      </p>
    )
  }

  // Subtotal calculation
  const subtotal = lines.reduce(
    (sum: number, l: CartLine) => sum + l.course.price * (l.qty ?? 1),
    0
  )

  // Remove item
  const handleRemove = async (courseId: string) => {
    try {
      if (user) {
        await removeItem(courseId).unwrap()
      } else {
        // For guests, remove a single item (not the whole cart)
        const newGuestLines = guestLines.filter(l => l.course.id !== courseId)
        localStorage.setItem('guest_cart', JSON.stringify(newGuestLines))
        // Redux update: replace with correct action if you have a 'removeGuest' action
        window.location.reload() // Quick hack if you don't have single remove in Redux
      }
    } catch {}
  }

  // Checkout
  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?next=/checkout')
      return
    }
    try {
      await checkout().unwrap()
      router.replace('/book')
    } catch {}
  }

  return (
    <main className="max-w-xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-semibold">Your cart</h1>
      {lines.map((l: CartLine) => (
        <div key={l.id} className="flex justify-between items-center py-2 border-b">
          <span>
            {l.course.title} × {l.qty ?? 1}
          </span>
          <div className="flex items-center gap-4">
            <span>${(l.course.price * (l.qty ?? 1)).toFixed(2)}</span>
            <button onClick={() => handleRemove(l.course.id)}>
              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between font-bold pt-4">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>
      <button
        disabled={checkingOut}
        onClick={handleCheckout}
        className="w-full py-3 bg-teal-900 text-white rounded disabled:opacity-50"
      >
        {checkingOut ? 'Processing…' : 'Checkout'}
      </button>
    </main>
  )
}
