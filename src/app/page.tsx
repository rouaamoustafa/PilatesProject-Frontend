'use client';

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-teal-900"></div>
    </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Nav */}
     

      <main className="flex-1 container mx-auto px-4 py-16">
        {user ? (
          <div className="text-center">
            <h1 className="text-3xl font-bold text-teal-900">
              Welcome, {user.full_name}!
            </h1>
            <p className="mt-2 text-gray-700">
              You’re logged in as <strong>{user.role}</strong>.
            </p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <section className="pt-13 flex flex-col items-center text-center max-w-3xl mx-auto px-4">
  {/* Logo */}
  <img
    src="/images/finalLogoPilates.png"
    alt="PilatesHub Logo"
    className="h-50 mb-8"
  />

  {/* Headline */}
  <h1 className="text-4xl md:text-5xl font-serif text-teal-900 leading-relaxed md:leading-snug">
    Success Start with movement,<br/>
    with <span className="text-orange-400">PILATES</span>
  </h1>

  {/* Description */}
  <p className="mt-6 text-gray-700 max-w-xxl">
    PilatesHub is your all-in-one space for mindful movement. Whether you’re a student seeking balance, an instructor guiding growth, or a studio owner building community — our platform connects you with classes, programs, and people who move with purpose.
  </p>

  {/* Call to Action */}
  <a
    href="/register"
    className="mt-8 inline-block border border-orange-400 text-orange-400 px-6 py-3 rounded font-medium hover:bg-orange-400 hover:text-white transition"
  >
    Register for a Class
  </a>
</section>




            {/* About */}
            <section className="mt-20 flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="md:w-1/2">
                <h2 className="text-2xl font-serif text-teal-900 inline-block border-b-2 border-teal-900 mb-4">
                  About Us
                </h2>
                <p className="text-gray-700 mb-2">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                </p>
                <p className="text-gray-700">
                  Nullam in risus vel augue lacinia cursus. Suspendisse potenti. Curabitur sed leo et lorem suscipit fermentum.
                </p>
              </div>
              <div className="md:w-1/2">
                <img
                  src="/images/about.png"
                  alt="Pilates studio"
                  className="w-full rounded-lg shadow-md object-cover"
                />
              </div>
            </section>
            {/* Divider */}
         <div className="mt-16 border-t border-teal-900 w-[70%] mx-auto"></div>

            {/* Our Approach */}
            <section className="mt-20 container mx-auto max-w-7xl px-6 text-center">
  <h2 className=" text-3xl font-serif text-teal-900 mb-4">
    Our Approach
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] items-start gap-8">
    {/* Left image */}
    <img
      src="/images/left-pilates.jpg"
      alt="Pilates session"
      className="mt-50 w-full h-[160px] object-cover rounded-md shadow-md"
    />

    {/* Center text block */}
    <div className="mt-50 px-4 flex items-start justify-center">
      <p className="text-teal-900 font-serif text-lg md:text-xl leading-relaxed">
        We blend expert instruction with personalized care to help you achieve your goals. Our focus is on mindful movement, proper alignment, and creating a welcoming space for everyone.
      </p>
    </div>

    {/* Right image */}
    <img
      src="/images/right-pilates.jpg"
      alt="Pilates reformer"
      className="w-full h-[340px] object-cover rounded-md shadow-md"
    />
  </div>

  {/* Bottom image centered */}
  <div className="mt-12">
    <img
      src="/images/center-pilates.jpg"
      alt="Group Pilates class"
      className="mt-20 w-full md:w-1/2 h-[300px] mx-auto object-cover rounded-md shadow-md"
    />
  </div>
</section>

{/* Services */}
<section className="mt-20 bg-gray-50">
  <div className="container mx-auto px-4 py-16 grid gap-12 md:grid-cols-3">
    {[
      {
        title: 'Do Pilates',
        text: 'Start your Pilates journey today and learn more about whole-body health by taking a class with us in Boulder, on Zoom, or by finding a studio near you.',
        href: '/book',              // ← new route
        label: 'Book',
      },
      {
        title: 'Teach Pilates',
        text: 'Teach with clarity and confidence. PilatesHub helps instructors manage their schedules, lead sessions, track attendance, and connect with students—all in one intuitive platform. Focus on what matters: guiding movement and inspiring growth.',
        href: '/joinInstructor',   // ← new route
        label: 'Join Instructor',
      },
      {
        title: 'Empower Your Studio',
        text: 'As a studio owner, you need more than just space—you need structure. PilatesHub gives you the tools to manage your classes, instructors, bookings, and revenue in one calm, organized place. Focus on your clients, while we handle the rest.',
        href: '/subscribe',         // ← new route
        label: 'Subscribe',
      },
    ].map(({ title, text, href, label }) => (
      <div key={title} className="flex flex-col">
        <div className="flex items-center mb-4">
          <h3 className="text-2xl font-serif text-teal-900">{title}</h3>
          <div className="flex-1 h-px bg-teal-900 ml-4"></div>
        </div>
        <p className="text-gray-700 flex-1">{text}</p>
        <Link
          href={href}
          className="mt-8 inline-block bg-teal-900 text-white py-3 px-6 rounded hover:bg-teal-800 transition text-center"
        >
          {label}
        </Link>
      </div>
    ))}
  </div>
</section>


          </>
        )}
      </main>
    </div>
  );
}
