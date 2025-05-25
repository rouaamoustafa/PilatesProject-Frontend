'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Footer() {
  const router = useRouter()
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    router.push(`/contactus?email=${encodeURIComponent(email)}`)
  }

  return (
    <footer className="bg-[#fafaf8] pt-16 pb-8 px-30 border-t border-gray-200 mt-12">
      {/* Newsletter */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div>
          <h3 className="text-2xl font-semibold text-[#2e372c] mb-4 tracking-widest">NEWSLETTER</h3>
        <form onSubmit={handleNewsletterSubmit} className="flex border-b border-[#2e372c] max-w-xl">
      <input
        type="email"
        placeholder="Your e-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 bg-transparent outline-none text-lg py-3 px-0 text-[#2e372c] placeholder-[#2e372c]"
      />
      <button
        type="submit"
        className="py-3 px-1.5 text-[#2e372c] hover:text-[#4b5941] transition"
        aria-label="Subscribe"
      >
        <span className="inline-block transition-transform duration-500 hover:scale-115 hover:translate-x-2">
          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
            <path d="M2 12h27M22 6l7 6-7 6" stroke="#2e372c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </form>
        </div>
        {/* Studio, Connect, Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-[#2e372c] mb-2 tracking-wide">STUDIO</h4>
<ul className="space-y-2 text-[#2e372c]">
  <li>
    <a
      href="/book"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-500">Book Classes</span>
      <span
        className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full"
      />
    </a>
  </li>
  <li>
    <a
      href="/joinInstructor"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-500">Instructors</span>
      <span
        className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full"
      />
    </a>
  </li>
  <li>
    <a
      href="/subscribe"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-500">Piltes Studio</span>
      <span
        className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full"
      />
    </a>
  </li>
</ul>


          </div>
          <div>
            <h4 className="font-bold text-[#2e372c] mb-2 tracking-wide">CONNECT</h4>
            <ul className="space-y-2 text-[#2e372c]">
  <li>
    <a
      href="https://www.instagram.com/YOUR_HANDLE"
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-300">Instagram</span>
      <span className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full" />
    </a>
  </li>
  <li>
    <a
      href="https://www.facebook.com/YOUR_PAGE"
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-300">Facebook</span>
      <span className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full" />
    </a>
  </li>
  <li>
    <a
      href="https://www.youtube.com/YOUR_CHANNEL"
      target="_blank"
      rel="noopener noreferrer"
      className="relative inline-block group"
    >
      <span className="transition-colors duration-300">YouTube</span>
      <span className="absolute left-0 -bottom-0.5 w-0 h-[0.7px] bg-[#2e372c] transition-all duration-300 group-hover:w-full" />
    </a>
  </li>
</ul>

          </div>
          <div>
            <h4 className="font-bold text-[#2e372c] mb-2 tracking-wide">CONTACT</h4>
            <ul className="space-y-1 text-[#2e372c]">
              <li>+961 78 52 33 32</li>
              <li>+961 71 52 33 32</li>
              <li>pilateshub@example.com</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom row */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-6 gap-6">
        {/* Logo ${cormorantGaramond.className}*/}
       <div className={` font-serif text-[5vw] min-w-[280px] tracking-widest text-[#3E4939] select-none`}>
  Pilates
</div>
        {/* Social small icons */}
        <div className="flex items-center gap-3">
  <a
    href="https://www.instagram.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="bg-gray-200 rounded-full px-4 py-2 text-[#3E4939] font-semibold text-lg transition-transform duration-500 hover:scale-115 cursor-pointer select-none"
  >
    IG
  </a>
  <a
    href="https://www.linkedin.com/in/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="bg-gray-200 rounded-full px-4 py-2 text-[#3E4939] font-semibold text-lg transition-transform duration-500 hover:scale-115 cursor-pointer select-none"
  >
    LN
  </a>
  <a
    href="https://www.facebook.com/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Facebook"
    className="bg-gray-200 rounded-full px-4 py-2 text-[#3E4939] font-semibold text-lg transition-transform duration-500 hover:scale-115 cursor-pointer select-none"
  >
    FB
  </a>
  <div className="w-24 h-px bg-gray-300 mx-3 hidden md:block"></div>
  <span className="text-gray-600 text-sm">&copy; 2025 Rouaa Moustafa, All Rights Reserved</span>
</div>

    
      </div>
    </footer>
  )
}
