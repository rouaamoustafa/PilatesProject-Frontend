'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { format, addMinutes } from 'date-fns'
import { toast } from 'react-toastify'

import { motion, AnimatePresence } from 'framer-motion'

import {
  Calendar as CalendarIcon,
  User,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react'

import { useAppDispatch } from '@/store'
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

interface LoginRequiredModalProps {
  open: boolean
  onClose: () => void
  onLogin: () => void
  classInfo: {
    title: string
    date: string
    startTime: string
    durationMinutes: number
  }
}

function LoginRequiredModal({ open, onClose, onLogin, classInfo }: LoginRequiredModalProps) {
  if (!open) return null

  const start = new Date(`${classInfo.date}T${classInfo.startTime}`)
  const end = addMinutes(start, classInfo.durationMinutes)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="modal-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-[2px]"
        >
          <motion.div
            key="modal-content"
            initial={{ y: 64, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 48, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="bg-[#fafaf8] rounded-xl shadow-2xl px-4 py-6 sm:px-8 sm:py-10 w-full max-w-xs sm:max-w-md text-center border border-[#ecece7] relative"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#2e372c] mb-6">YOU ARE ABOUT TO BOOK CLASS</h2>
            <div className="bg-[#f2efeb] rounded-lg p-3 sm:p-5 mb-6">
              <div className="text-lg sm:text-xl font-extrabold text-[#2e372c] mb-1">{classInfo.title}</div>
              <div className="text-base text-[#2e372c] mb-1">{format(start, 'EEEE')}</div>
              <div className="text-base text-[#2e372c]">
                {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
              </div>
            </div>
            <div className="mb-8 text-gray-700 text-sm sm:text-base">
              You should have an account to book classes. If you don't have an account you can create one.
            </div>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={onLogin}
                className="bg-[#363e34] text-white rounded-md px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold shadow hover:bg-[#2e372c] transition"
              >
                LOG IN
              </button>
              <button
                onClick={onClose}
                className="bg-white text-[#2e372c] rounded-md px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-bold border border-[#2e372c] hover:bg-gray-50 transition"
              >
                CANCEL
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAuth()

  const [course, setCourse] = useState<CourseDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

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
    if (!user) {
      setShowModal(true)
      return
    }
    if (alreadyPurchased) {
      toast.warn('You have already purchased this course.')
      return
    }
    if (alreadyInCart) {
      toast.info('This course is already in your cart.')
      return
    }
    try {
      await addToCart({ courseId: id! }).unwrap()
      toast.success('Added to cart')
    } catch (err: any) {
      toast.error(err?.data?.message || "Could not add to cart")
    }
  }

  function DateBadge({ date }: { date: string }) {
    const d = new Date(date)
    const month = d.toLocaleString("en-US", { month: "short" }).toUpperCase()
    const day = d.getDate()
    return (
      <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-white text-[#2e372c] rounded-sm shadow-md w-14 h-14 sm:w-16 sm:h-16 flex flex-col items-center justify-center font-bold text-sm sm:text-base z-10 select-none">
        <span>{month}</span>
        <span className="text-lg sm:text-xl">{day}</span>
      </div>
    )
  }

  if (loading) return <p className="text-center mt-20">Loading…</p>
  if (error) return <p className="text-center mt-20 text-red-600">{error}</p>
  if (!course) return <p className="text-center mt-20">Course not found.</p>

  const courseImage = course?.instructor?.image || "/default-avatar.png"

  return (
    <main className="mt-20 min-h-screen bg-gray-50 py-8 sm:py-12 px-2 sm:px-4">
      {/* HERO IMAGE with badge */}
      <div className="relative max-w-3xl sm:max-w-6xl mx-auto mt-6 rounded-lg overflow-hidden shadow-lg">
        <DateBadge date={course.date} />
        <img
          src={courseImage}
          alt={course.instructor.user.full_name}
          className="w-full h-52 sm:h-[420px] object-cover object-center"
        />
      </div>

      {/* Meta and Title */}
      <div className="max-w-2xl sm:max-w-4xl mx-auto mt-8 sm:mt-10 px-2 sm:px-6">
        <div className="mb-2 text-base sm:text-lg text-[#2e372c]/90">
          By <span className="font-semibold">{course.instructor.user.full_name}</span>
          {course.level && <> / <span className="italic">{course.level}</span></>}
        </div>
        <h1 className="text-2xl sm:text-5xl font-serif font-bold text-[#2e372c] leading-tight tracking-tight mb-6 sm:mb-8">
          {course.title}
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-xl sm:max-w-3xl mx-auto px-2 sm:px-6 mt-4 sm:mt-6">
        {/* Description as quote */}
        {course.description && (
          <blockquote className="text-lg sm:text-2xl italic text-[#2e372c] mb-6 sm:mb-10">
            “{course.description}”
          </blockquote>
        )}
        <div className="space-y-4 sm:space-y-5 text-base sm:text-lg text-[#2e372c]">
          {/* Instructor Email */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="#2e372c" strokeWidth={1.5} viewBox="0 0 24 24"><path d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /><path d="M19.5 19.5L16 16" /></svg>
            <a href={`mailto:${course.instructor.user.email}`} className="underline break-all">{course.instructor.user.email}</a>
          </div>
          {/* Date & Time */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>
              {format(new Date(`${course.date}T${course.startTime}`), 'EEEE, MMM d, yyyy')} at {format(new Date(`${course.date}T${course.startTime}`), 'p')}
            </span>
          </div>
          {/* Duration */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
            <span>{course.durationMinutes} min</span>
          </div>
          {/* Price */}
          <div className="flex items-center gap-2 sm:gap-3">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="text-lg sm:text-xl font-bold">${course.price.toFixed(2)}</span>
          </div>
          {/* Location */}
          {course.location && (
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
              {course.location.mapLink ? (
                <a
                  href={course.location.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {course.location.address}
                </a>
              ) : (
                <span>{course.location.address}</span>
              )}
            </div>
          )}
          {/* Mode */}
          {course.mode && (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="inline-block bg-gray-200 text-[#335B4B] text-base sm:text-lg font-semibold px-3 sm:px-4 py-1 rounded-full capitalize">
                {course.mode}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Add to Cart at the bottom */}
      <div className="max-w-xl sm:max-w-3xl mx-auto px-2 sm:px-6 mt-10 sm:mt-12 flex justify-center sm:justify-end">
        <button
          disabled={checkingOrder || alreadyPurchased || alreadyInCart || isAdding}
          onClick={handleAdd}
          className="bg-[#363e34] text-white text-base sm:text-lg rounded-md px-5 sm:px-6 py-2 flex justify-center items-center hover:bg-[#222722] w-full sm:w-auto"
        >
          {checkingOrder
            ? "Checking…"
            : alreadyPurchased
            ? "Joined"
            : alreadyInCart
            ? "Joined"
            : isAdding
            ? "Joining..."
            : "Let's Flow"}
        </button>
      </div>
      <LoginRequiredModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onLogin={() => router.push(`/login?next=/book/classe/${course.id}`)}
        classInfo={{
          title: course.title,
          date: course.date,
          startTime: course.startTime,
          durationMinutes: course.durationMinutes
        }}
      />
    </main>
  )
}
