'use client'

import { useParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { v4 as uuidv4 } from 'uuid'
import {
  Calendar as CalendarIcon,
  User,
  Clock,
  MapPin,
  DollarSign,
  ShoppingCart,
} from 'lucide-react'

import { useAppDispatch, type RootState } from '@/store'
import { addGuest } from '@/store/slices/guestCartSlice'
import { selectCartLines } from '@/store/selectors'
import { useAuth } from '@/hooks/useAuth'
import { useAddToCartMutation } from '@/store/cartEndpoints'

interface CourseDetail {
  id: string
  title: string
  description?: string
  level?: string
  mode?: string
  price: number
  date: string       // YYYY-MM-DD
  startTime: string  // HH:mm:ss
  durationMinutes: number
  instructor: {
    user: { full_name: string; email: string }
    image?: string
  }
  location?: { address: string; mapLink?: string }
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const { user } = useAuth()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // --- Check cart/order state ---
  const lines = useSelector(selectCartLines)
  const alreadyInCart = lines.some(l => l.course.id === id)
  const [alreadyPurchased, setAlreadyPurchased] = useState(false)
  const [checkingOrder, setCheckingOrder] = useState(false)
  const [addToCart, { isLoading: isAdding }] = useAddToCartMutation()

  // --- Check if user already purchased course ---
  useEffect(() => {
    if (!user || !id) {
      setAlreadyPurchased(false)
      setCheckingOrder(false)
      return
    }
    setCheckingOrder(true)
    const check = async () => {
      try {
        const res = await axios.get<{ purchased: boolean }>(`/api/orders/check?courseId=${id}`)
        setAlreadyPurchased(res.data.purchased)
      } catch {
        setAlreadyPurchased(false)
      }
      setCheckingOrder(false)
    }
    check()
  }, [user, id])

  // --- Fetch course details ---
  useEffect(() => {
    if (!id) return
    setLoading(true)
    ;(async () => {
      try {
        const res = await axios.get<CourseDetail>(`/api/courses/${id}`)
        setCourse(res.data)
      } catch {
        toast.error('Failed to load course')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  // --- Add to cart handler ---
  const handleAdd = async () => {
    if (alreadyPurchased) {
      toast.warn('You have already purchased this course.')
      return
    }
    if (alreadyInCart) {
      toast.info('This course is already in your cart.')
      return
    }
    if (user) {
      try {
        await addToCart({ courseId: id! }).unwrap()
        toast.success('Added to cart')
        // Redux + selector will re-render, no manual state needed
      } catch (err: any) {
        toast.error(err?.data?.message || "Could not add to cart")
      }
    } else {
      // Add to guest cart (redux slice)
      dispatch(
        addGuest({
          id: uuidv4(),
          qty: 1,
          course: {
            id: course!.id,
            title: course!.title,
            description: course!.description,
            price: course!.price,
            date: course!.date,
            startTime: course!.startTime,
            durationMinutes: course!.durationMinutes,
            instructor: course!.instructor,
            location: course!.location,
          },
        })
      )
      toast.info('Added – you’ll log in at checkout')
    }
  }

  // --- Render logic ---
  if (loading) return <p className="text-center mt-20">Loading…</p>
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>
  if (!course) return <p className="text-center mt-20">Course not found.</p>

  const startDate = new Date(`${course.date}T${course.startTime}`)

  return (
    <main className="mt-20 min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* --- HEADER --- */}
        <div className="bg-teal-900 text-white p-6 flex items-center gap-6">
          <img
            src={course.instructor.image ?? '/default-avatar.png'}
            alt={course.instructor.user.full_name}
            className="w-24 h-24 rounded-full border-4 border-teal-500 object-cover"
          />
          <div>
            <h1 className="text-3xl font-semibold">{course.title}</h1>
            {course.description && (
              <p className="mt-2 text-teal-200">{course.description}</p>
            )}
          </div>
        </div>
        {/* --- BODY --- */}
        <div className="p-6 space-y-6">
          <div className="flex items-center text-gray-700">
            <User className="w-5 h-5 mr-2 text-teal-600" />
            <span className="font-medium">{course.instructor.user.full_name}</span>
            <span className="ml-2 text-sm text-gray-500">
              ({course.instructor.user.email})
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <Clock className="w-5 h-5 mr-2 text-teal-600" />
            <span>
              {format(startDate, 'EEEE, MMMM d, yyyy')} at {format(startDate, 'p')}
            </span>
            <span className="mx-2">|</span>
            <span>{course.durationMinutes} min</span>
          </div>
          {(course.level || course.mode) && (
            <div className="flex items-center text-gray-700">
              <CalendarIcon className="w-5 h-5 mr-2 text-teal-600" />
              {course.level && <span className="capitalize">{course.level}</span>}
              {course.level && course.mode && <span className="mx-2">|</span>}
              {course.mode && <span className="capitalize">{course.mode}</span>}
            </div>
          )}
          {course.location && (
            <div className="flex items-center text-gray-700">
              <MapPin className="w-5 h-5 mr-2 text-teal-600" />
              {course.location.mapLink ? (
                <a
                  href={course.location.mapLink}
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  {course.location.address}
                </a>
              ) : (
                <span>{course.location.address}</span>
              )}
            </div>
          )}
          <div className="flex items-center text-gray-700">
            <DollarSign className="w-5 h-5 mr-2 text-teal-600" />
            <span className="text-2xl font-bold">
              ${course.price.toFixed(2)}
            </span>
          </div>
        </div>
        {/* --- ADD TO CART BUTTON --- */}
        <div className="p-6 flex justify-end">
          <button
            disabled={checkingOrder || alreadyPurchased || alreadyInCart || isAdding}
            onClick={handleAdd}
            className="w-44 flex justify-center items-center gap-2 bg-teal-700 hover:bg-teal-600 disabled:opacity-60 text-white py-3 rounded-2xl text-lg font-medium transition"
          >
            <ShoppingCart className="w-5 h-5" />
            {checkingOrder
              ? "Checking…"
              : alreadyPurchased
                ? "Added"
                : alreadyInCart
                  ? "Added"
                  : isAdding
                    ? "Adding…"
                    : "Add to Cart"}
          </button>
        </div>
      </div>
    </main>
  )
}
