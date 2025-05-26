'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import api from '@/store/api/axios'
import { imageUrl } from '@/lib/storage'
import type { Instructor, Course } from '@/types'

export default function InstructorDetailPage() {
  const { id } = useParams()
  const [instructor, setInstructor] = useState<Instructor & { userId: string } | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    ;(async () => {
      try {
        const res = await api.get(`/instructors/public/${id}`)
        const instData = res.data as Instructor & { userId: string }
        setInstructor(instData)

        const coursesRes = await api.get<{ courses: Course[] }>('/courses', {
          params: { page: 0, pageSize: 100 },
        })

        const filtered = coursesRes.data.courses.filter(
          (c) => c.instructor.user.id === instData.userId
        )

        setCourses(filtered)
      } catch (err) {
        console.error(err)
        setError('Failed to load instructor or courses.')
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <div className="p-20 text-center">Loading...</div>
  if (error) return <div className="p-20 text-red-600 text-center">{error}</div>
  if (!instructor) return null

  return (
    <div className="mt-20 min-h-screen bg-[#fafaf8] p-10 max-w-5xl mx-auto text-[#3E4939] font-serif">
      <h1 className="text-[9rem] mb-20 text-left">Hi! I am</h1>

      <div className="relative flex justify-center mb-20">
        <h1 className="absolute z-10 top-[-7rem] left-[85%] transform -translate-x-1/2 font-bold text-[10rem] font-serif text-[#3E4939]">
          {instructor.full_name.split(' ')[0]}
        </h1>

        <img
          src={instructor.image ? imageUrl(instructor.image) : '/placeholder.png'}
          alt={instructor.full_name}
          className="w-[600px] h-[700px] object-cover rounded-xl shadow"
        />
      </div>

      <p className=" text-lg text-center">{instructor.bio || 'No bio available.'}</p>
<p className="mb-1 text-lg text-center">{instructor.email || ''}</p>
      <div className="flex justify-center gap-6 mt-8 mb-20">
        {instructor.link && (
          <a
            href={instructor.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="bg-gray-200 rounded-full px-4 py-2 text-[#3E4939] font-semibold text-lg transition-transform duration-500 hover:scale-115 cursor-pointer select-none"
          >
            IG
          </a>
        )}
        {instructor.cv && (
          <a
            href={instructor.cv}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="CV"
            className="bg-gray-200 rounded-full px-4 py-2 text-[#3E4939] font-semibold text-lg transition-transform duration-500 hover:scale-115 cursor-pointer select-none"
          >
            CV
          </a>
        )}
      </div>

      <section className="bg-[#fafaf8] py-20 px-8 max-w-4xl mx-auto font-serif text-[#3E4939] mt-10 mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          COURSES WITH {instructor.full_name}
        </h2>

     <div className="space-y-10">
  {courses.length === 0 ? (
    <p className="text-center text-gray-500">No scheduled classes found.</p>
  ) : (
    courses.map((course, idx) => {
      const start = course.startTime.slice(0, 5)
      const end = new Date(new Date(`1970-01-01T${course.startTime}`).getTime() + course.durationMinutes * 60000)
        .toTimeString()
        .slice(0, 5)

      return (
        <div key={idx}>
          <div className="flex justify-between items-center text-sm md:text-lg font-medium group">
            <span className="capitalize">{course.title}</span>
            <span>{start} - {end}</span>
            <span>{course.location?.address || '—'}</span>
            <a
              href={'/book'}
              className="ml-4 transition-transform group-hover:translate-x-2 group-hover:scale-125 duration-500"
              title="Book now"
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                className="inline"
                style={{ verticalAlign: 'middle' }}
              >
                <path
                  d="M9 6l6 6-6 6"
                  stroke="#3E4939"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
          <hr className="mt-2 border-[#3E4939]" />
        </div>
      )
    })
  )}
</div> 
      </section>
    </div>
  )
}
