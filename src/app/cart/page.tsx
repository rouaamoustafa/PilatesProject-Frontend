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
  <main className="max-w-2xl mx-auto mt-36 py-12 px-6 bg-white rounded-2xl shadow-lg space-y-8 border border-[#ecece7]">
  <h1 className="text-4xl font-extrabold text-[#2e372c] mb-8">Your Classes</h1>

  {lines.length === 0 ? (
    <div className="text-center text-lg text-gray-400 py-12">Your cart is empty.</div>
  ) : (
    <div className="space-y-6">
      {lines.map((l: CartLine) => (
        <div key={l.id} className="flex justify-between items-center px-4 py-4 rounded-lg bg-[#F7F6F3] hover:bg-[#ecece7] transition border border-[#f1f1ee]">
          <div>
            <span className="block text-xl font-semibold text-[#2e372c]">{l.course.title}</span>
            {/* <span className="block text-sm text-gray-500">× {l.qty ?? 1}</span> */}
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-[#335B4B]">${(l.course.price * (l.qty ?? 1)).toFixed(2)}</span>
            <button
              onClick={() => handleRemove(l.course.id)}
              className="rounded-full bg-white border border-gray-300 hover:bg-red-50 transition p-2"
              title="Remove"
            >
              <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-600 transition" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )}

  <div className="flex justify-between items-center text-2xl font-bold border-t border-[#ecece7] pt-8 px-4">
    <span className="text-[#2e372c]">Total</span>
    <span className="text-[#335B4B]">${subtotal.toFixed(2)}</span>
  </div>

  <button
    disabled={checkingOut || lines.length === 0}
    onClick={handleCheckout}
    className={`w-full py-4 mt-2 text-xl rounded-lg transition font-semibold ${
      lines.length === 0 || checkingOut
        ? 'bg-[#203529] text-gray-400 cursor-not-allowed'
        : 'bg-[#203529] text-white hover:bg-[#335B4B] shadow-lg'
    }`}
  >
    {checkingOut ? 'Processing…' : 'Checkout'}
  </button>
</main> 
  )
}
