// app/book/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function BookPage() {
  const [tab, setTab] = useState<'classes' | 'programs'>('classes')

  // stub data
  const classes = [
    { id: 1, title: 'Live Int/Adv Mat Pilates', teacher: 'Amy Alpers', time: '1:00 AM – 1:55 AM', price: 25 },
    { id: 2, title: 'Beginner Mat Pilates', teacher: 'John Doe', time: '2:00 PM – 2:55 PM', price: 20 },
  ]
  const programs = [
    { id: 1, title: '6-Week Core Strength Program', description: 'Build core from the ground up.', price: 120 },
    { id: 2, title: 'Posture & Alignment Workshop', description: 'Improve posture in 4 sessions.', price: 80 },
  ]

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      {/* Title */}
      <h1 className="mt-30 text-4xl font-serif text-teal-900 text-center mb-8">
        Schedule a Class
      </h1>

      {/* Calendar (stub) */}
      <div className="mx-auto max-w-4xl mb-12">
        {/* Replace with your real calendar component */}
        <div className="h-64 bg-white rounded-lg shadow flex items-center justify-center text-gray-400">
          [Calendar goes here]
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center space-x-8 mb-8">
        <button
          onClick={() => setTab('classes')}
          className={`pb-2 border-b-2 ${
            tab === 'classes' ? 'border-teal-900 text-teal-900' : 'border-transparent text-gray-600'
          }`}
        >
          Classes
        </button>
        <button
          onClick={() => setTab('programs')}
          className={`pb-2 border-b-2 ${
            tab === 'programs' ? 'border-teal-900 text-teal-900' : 'border-transparent text-gray-600'
          }`}
        >
          Programs
        </button>
      </div>

      {/* List of Cards */}
      <div className="container mx-auto max-w-4xl space-y-6">
        {tab === 'classes' &&
          classes.map(c => (
            <div key={c.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">{c.title}</h2>
                <p className="mt-1 text-gray-600">By {c.teacher}</p>
                <p className="mt-1 text-gray-500">{c.time}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${c.price}</p>
                <Link href={`/book/classes/${c.id}`} className="mt-2 inline-block bg-teal-900 text-white px-4 py-2 rounded">
                  Book now
                </Link>
              </div>
            </div>
          ))}

        {tab === 'programs' &&
          programs.map(p => (
            <div key={p.id} className="bg-white rounded-lg shadow p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-gray-600">{p.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${p.price}</p>
                <Link href={`/book/programs/${p.id}`} className="mt-2 inline-block bg-teal-900 text-white px-4 py-2 rounded">
                  View details
                </Link>
              </div>
            </div>
          ))}
      </div>
    </main>
  )
}
