'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'

export default function ContactPage() {
  const searchParams = useSearchParams()
  const prefillEmail = searchParams.get('email') || ''

  const [form, setForm] = useState({
    full_name: '',
    email: prefillEmail,
    subject: '',
    message: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (prefillEmail) {
      setForm((prev) => ({ ...prev, email: prefillEmail }))
    }
  }, [prefillEmail])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

 const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  setError('')
  setSuccess('')

  if (!form.email || !form.message) {
    setError('Please fill in at least your email and message.')
    return
  }

  const templateParams = {
    full_name: form.full_name,
    email: form.email,
    subject: form.subject,
    message: form.message,
  }

  emailjs
    .send('service_vm6fedm', 'template_g9ol0hv', templateParams, 'Xj730mnMzgxCUOnaT')
    .then(() => {
      setSuccess('Your message has been sent!')
      setForm({ full_name: '', email: '', subject: '', message: '' })
    })
    .catch((err) => {
      console.error(err)
      setError('Failed to send message. Try again later.')
    })
}


  return (
    <div className="mt-30 min-h-screen bg-[#fafaf8] py-16 px-4">
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-md border border-gray-200"
      >
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl md:text-6xl font-serif text-[#3E4939]">
            How can we serve you
          </h1>
        </div>

        {error && <p className="text-[#3E4939] mb-4 text-center">{error}</p>}
        {success && <p className="text-[#3E4939] mb-4 text-center font-semibold">{success}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <input
              type="text"
              name="full_name"
              placeholder="Full Name"
              value={form.full_name}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#3E4939] pb-2 focus:outline-none placeholder-[#3E4939] text-[#3E4939]"
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-transparent border-b border-[#3E4939] pb-2 focus:outline-none placeholder-[#3E4939] text-[#3E4939]"
              required
            />
          </div>
        </div>

        <div className="mt-8">
          <input
            type="text"
            name="subject"
            placeholder="Message Subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full bg-transparent border-b border-[#3E4939] pb-2 focus:outline-none placeholder-[#3E4939] text-[#3E4939]"
          />
        </div>

        <div className="mt-8">
          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            rows={6}
            className="w-full bg-transparent border-b border-[#3E4939] pb-2 focus:outline-none placeholder-[#3E4939] text-[#3E4939] resize-none"
            required
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="mt-10 text-[#3E4939] font-semibold flex items-center gap-2 mx-auto hover:text-[#263123] transition"
          >
            Submit
            <span className="inline-block transition-transform duration-500 hover:scale-115 hover:translate-x-2">
              <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                <path d="M2 12h27M22 6l7 6-7 6" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      </form>
    </div>
  )
}
