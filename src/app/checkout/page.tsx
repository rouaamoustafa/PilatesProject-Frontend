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
import { toast } from 'react-toastify'
import type { CartLine } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { user, loading: authLoading } = useAuth()

  // Don't redirect guests immediately, allow viewing guest cart
  // Redirect only when clicking "Place order" button

  // Get cart lines (guest or server) via selector
  const guestLines = useSelector(selectCartLines)

  // Mutation to add course to server cart (used for merging guest cart after login)
  const [addToCart] = useAddToCartMutation()

  // State to track if guest cart has been merged after login
  const [merged, setMerged] = useState(false)

  // Merge guest cart into server cart once after login
  useEffect(() => {
    if (user && guestLines.length && !merged) {
      Promise.all(
        guestLines.map(g => addToCart({ courseId: g.course.id }).unwrap())
      )
        .then(() => {
          dispatch(clearGuest()) // Clear guest cart after merge
          setMerged(true)
        })
        .catch(() => {
          setMerged(true) // Even if merge fails, proceed to avoid blocking UI
        })
    } else if (user && !guestLines.length) {
      setMerged(true) // No guest items, mark as merged
    }
  }, [user, guestLines, merged, addToCart, dispatch])

  // Fetch server cart only if logged in and after merge
  const { data: serverLines = [], isFetching } = useGetCartQuery(undefined, {
    skip: !user || !merged,
  })

  // Decide which cart lines to show: server cart if logged in, else guest cart
  const lines: CartLine[] = user ? serverLines : guestLines

  // Show loading while auth or cart data loading or merging guest cart
  if (authLoading || isFetching || (user && guestLines.length && !merged)) {
    return <p className="p-8 text-center">Loading cart…</p>
  }

  // Show empty cart message if no items
  if (!lines.length) {
    return (
      <p className="p-8 text-center">
        Your cart is empty.&nbsp;
        <button
          onClick={() => router.push('/book')}
          className="underline text-teal-700"
        >
          Browse classes
        </button>
      </p>
    )
  }

  // Calculate subtotal
  const subtotal = lines.reduce(
    (sum: number, l: CartLine) => sum + l.course.price * (l.qty ?? 1),
    0
  )

  // Mutations for removing items and checkout
  const [removeItem, { isLoading: removing }] = useRemoveItemMutation()
  const [checkout, { isLoading: placing }] = useCheckoutMutation()

  // Handler to remove item from cart
  const handleRemove = async (courseId: string) => {
    try {
      if (user) {
        await removeItem(courseId).unwrap()
        toast.success('Item removed from cart')
      } else {
        // For guests, clear entire guest cart (or implement single item removal)
        dispatch(clearGuest())
        toast.success('Item removed from cart')
      }
    } catch {
      toast.error('Failed to remove item')
    }
  }

  // Handler for checkout button click
  const handleCheckout = () => {
    if (!user) {
      router.push('/login?next=/checkout')
      return
    }
    checkout()
      .unwrap()
      .then(() => {
        toast.success('Your order is confirmed!')
        router.replace('/book')
      })
      .catch(() => {
        toast.error('Checkout failed — please try again')
      })
  }

  return (
    <main className="max-w-xl mx-auto py-12 space-y-6">
      <h1 className="text-3xl font-semibold">Review & pay</h1>

      {lines.map(l => (
        <div
          key={l.id}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <p className="font-medium">{l.course.title}</p>
            <p className="text-sm text-gray-500">
              {l.course.date} at {l.course.startTime}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span>${(l.course.price * (l.qty ?? 1)).toFixed(2)}</span>
            <button
              onClick={() => handleRemove(l.course.id)}
              disabled={removing}
              aria-label={`Remove ${l.course.title} from cart`}
            >
              <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
            </button>
          </div>
        </div>
      ))}

      <div className="flex justify-between text-lg font-bold pt-4">
        <span>Total</span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={placing}
        className="w-full bg-teal-900 text-white py-3 rounded disabled:opacity-60"
      >
        {placing ? 'Processing…' : user ? 'Place order' : 'Login to checkout'}
      </button>
    </main>
  )
}
