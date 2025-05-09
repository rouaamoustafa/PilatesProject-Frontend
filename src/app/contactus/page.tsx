'use client'

import { useState } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // TODO: replace with real submit logic
    if (!form.email || !form.message) {
      setError('Please fill in at least your email and message.')
      return
    }

    setSuccess('Your message has been sent!')
    setForm({ full_name: '', email: '', subject: '', message: '' })
  }

  return (
    <div className="mt-30 min-h-screen bg-gray-50 py-12 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow"
      >
        {/* Heading */}
        <div className="mb-8 relative ">
          <h1 className="text-3xl font-serif text-teal-900 inline-block border-b-2 border-teal-700 pb-2">
            How can we serve you
          </h1>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}
        {success && <p className="text-teal-700 mb-4">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-teal-700 pb-2 focus:outline-none"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b-2 border-teal-700 pb-2 focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <input
            type="text"
            name="subject"
            placeholder="Message Subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full bg-transparent border-b-2 border-teal-700 pb-2 focus:outline-none"
          />
        </div>

        <div className="mt-6">
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className="w-full bg-transparent border-b-2 border-teal-700 pb-2 focus:outline-none resize-none"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-8 bg-teal-900 text-white py-3 px-6 rounded hover:bg-teal-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  )
}
