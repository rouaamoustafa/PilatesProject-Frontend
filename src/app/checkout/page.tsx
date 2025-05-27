'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import {
  useGetCartQuery,
  useRemoveItemMutation,
  useCheckoutMutation,
} from '@/store/cartEndpoints'
import { Trash2 } from 'lucide-react'
import { toast } from 'react-toastify'
import type { CartLine } from '@/types'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login?next=/checkout')
    }
  }, [user, authLoading, router])

  // Fetch server cart for logged-in user
  const { data: lines = [], isFetching } = useGetCartQuery(undefined, {
    skip: !user,
  })

  // Show loading while auth or cart data loading
  if (authLoading || isFetching) {
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
      await removeItem(courseId).unwrap()
      toast.success('Item removed from cart')
    } catch {
      toast.error('Failed to remove item')
    }
  }

  // Handler for checkout button click
  const handleCheckout = () => {
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
    <main className="mt-40 max-w-xl mx-auto py-12 space-y-6">
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
        className="w-full bg-white text-[#2e372c] border border-[#2e372c] py-3 rounded-md text-lg font-semibold transition hover:bg-[#f5f5f2] disabled:opacity-60"
      >
        {placing ? 'Processing…' : 'Place order'}
      </button>
    </main>
  )
}
