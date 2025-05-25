"use client"
import { useEffect, useState } from 'react'

export default function UpButton() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 200)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 w-12 h-12 bg-[#3E4939] hover:bg-[#263123] rounded-sm flex items-center justify-center transition-all duration-200 shadow-lg border-none outline-none
        ${show ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
      `}
      style={{ boxShadow: '0 4px 16px 0 rgba(0,0,0,0.08)' }}
    >
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M7 17L14 10L21 17" stroke="#f9f9f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  )
}
