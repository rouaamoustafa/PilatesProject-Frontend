'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from 'axios'
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  isSameMonth,
  isToday,
} from 'date-fns'
import {
  Calendar as CalendarIcon,
  User,
  Clock,
  MapPin,
  DollarSign,
} from 'lucide-react'

interface Course {
  id: string
  title: string
  price: number
  date: string      // YYYY-MM-DD
  startTime: string // HH:mm:ss
  durationMinutes: number
  instructor: {
    user: {
      full_name: string
    }
  }
  location?: { address: string }
}

export default function BookPage() {
  const [tab, setTab] = useState<'classe' | 'programs'>('classe')
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      setLoading(true)
      try {
        const res = await axios.get<{ courses: Course[] }>('/api/courses?page=0&pageSize=100&search=')
        setCourses(res.data.courses)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // build calendar days
  const today = new Date()
  const monthStart = startOfMonth(today)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 0 })
  const calendarDays: Date[] = []
  let curr = startDate
  while (curr <= monthEnd || calendarDays.length % 7 !== 0) {
    calendarDays.push(curr)
    curr = addDays(curr, 1)
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Page title */}
      <div className="flex items-center justify-center mb-8">
        <CalendarIcon className="h-8 w-8 text-teal-900 mr-2" />
        <h1 className="text-4xl font-serif text-teal-900">Schedule a Class</h1>
      </div>

      {/* Calendar */}
      <div className="mx-auto max-w-md bg-white rounded-lg shadow p-4 mb-12">
        <div className="text-center font-semibold text-lg mb-2">
          {format(monthStart, 'MMMM yyyy')}
        </div>
        <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
          {['S','M','T','W','T','F','S'].map((d,i) => (
            <div key={i} className="text-center">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-sm">
          {calendarDays.map((day, idx) => {
            const inMonth = isSameMonth(day, monthStart)
            const todayClass = isToday(day)
              ? 'bg-teal-900 text-white'
              : 'text-gray-800'
            return (
              <div
                key={idx}
                className={`h-8 flex items-center justify-center rounded ${
                  inMonth ? todayClass : 'text-gray-300'
                }`}
              >
                {format(day, 'd')}
              </div>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-8 mb-8">
        <button
          onClick={() => setTab('classe')}
          className={`pb-2 border-b-2 ${
            tab === 'classe'
              ? 'border-teal-900 text-teal-900'
              : 'border-transparent text-gray-600'
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => setTab('programs')}
          className={`pb-2 border-b-2 ${
            tab === 'programs'
              ? 'border-teal-900 text-teal-900'
              : 'border-transparent text-gray-600'
          }`}
        >
          Programs
        </button>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl space-y-6">
        {tab === 'classe' && (
          loading
            ? <p className="text-center text-gray-500">Loading classes…</p>
            : courses.map(c => (
              <div
          key={c.id}
          className="bg-white rounded-lg shadow p-6 flex flex-col gap-4"
        >
         {/* Top: Info & price */}
        <div className="grid grid-cols-3 gap-4">
            {/* Info */}
            <div className="col-span-2 space-y-2">
             <h2 className="text-2xl font-semibold">{c.title}</h2>
              <p className="text-gray-600 flex items-center">
                <User className="h-4 w-4 mr-1" />
               {c.instructor.user.full_name}
             </p>
              <p className="text-gray-500 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {format(new Date(`${c.date}T${c.startTime}`), 'p')} — {c.durationMinutes} min
              </p>
             {c.location && (
                <p className="text-gray-500 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {c.location.address}
                </p>
              )}
            </div>

           {/* Price */}
            <div className="flex items-center justify-end">
             <p className="text-2xl font-bold flex items-center">
               <DollarSign className="h-4 w-4 mr-1" />
                {c.price}
              </p>
           </div>
          </div>

          {/* Bottom: full-width Book Now */}
          <Link
            href={`/book/classe/${c.id}`}
            className="mt-4 w-full bg-teal-900 text-white py-3 rounded-lg text-center font-medium flex items-center justify-center gap-2 hover:bg-teal-800 transition"
          >
           <CalendarIcon className="h-5 w-5" />
            Book now
          </Link>
        </div>

            ))
        )}

        {tab === 'programs' && (
          <p className="text-center text-gray-500">Programs view coming soon.</p>
        )}
      </div>
    </main>
  )
}
