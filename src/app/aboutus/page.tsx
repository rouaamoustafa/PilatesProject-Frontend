'use client'

export default function AboutUsPage() {
  return (
    <section className="min-h-screen bg-[#fafaf8] mt-50">
      {/* Hero Section with Title Above Image */}
      <div className="relative w-full bg-[#fafaf8]">
        <h1 className="absolute z-10 top-[-5rem] left-10 text-[9vw] md:text-[7vw] font-serif text-[#3E4939] ml-6">
          OUR STUDIO
        </h1>
        <div className="w-full h-[80vh] overflow-hidden">
          <img
            src="/images/studio.jpg"
            alt="Studio Hero"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Pilates Platform Section */}
      <div className="mt-50 max-w-4xl mx-auto px-6 py-12 text-[#2e372c] font-serif text-lg text-center">
        <p>
          PilatesHub aims to foster a connected environment between people, instructors, and studios. Our platform helps users grow stronger and more mindful while enabling instructors to reach their community, promote programs, and offer classes. Whether you want to subscribe, buy courses, or build your presence — this is your space to move and evolve.
        </p>
      </div>
{/* Benefits Section */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-16 items-center justify-center py-24 px-6 mt-50 mb-30">
        {/* Left Image */}
        <div className="flex justify-center items-center w-full md:w-1/2">
          <img
            src="/images/aboutus-1.jpg"
            alt="Pose 1"
            className="w-full max-w-md h-auto object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Right Paragraph */}
        <div className="text-[#2e372c] font-serif text-lg leading-relaxed w-full md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            THE BENEFITS WE GET FROM PRACTICING YOGA ARE MANIFOLD
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ul className="space-y-2">
              <li>✶ Better posture</li>
              <li>✶ Core strength</li>
              <li>✶ Flexibility</li>
              <li>✶ Focus</li>
            </ul>
            <ul className="space-y-2">
              <li>✶ Relaxation</li>
              <li>✶ Circulation</li>
              <li>✶ Injury recovery</li>
              <li>✶ Body awareness</li>
            </ul>
          </div>
        </div>
      </div>
      {/* About Section 
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-20 px-6">
        
        <div className="overflow-hidden rounded-lg shadow-md">
          <img
            src="/images/studio.jpg"
            alt="Studio Interior"
            className="w-full h-[480px] object-cover transition-transform duration-500 hover:scale-105"
          />
        </div>

        
        <div className="text-[#3E4939] text-lg font-serif space-y-6">
          <p>
            Our studio is a quiet sanctuary filled with breath, light, and purpose. Rooted in the ancient practices of Ashtanga Yoga, we guide practitioners through mindful sequencing designed to develop physical strength, mental clarity, and emotional balance.
          </p>
          <p>
            Whether you’re new to the mat or a seasoned yogi, our instructors bring warmth, precision, and experience to every class. Each session is more than movement — it’s a moment of reflection and a celebration of the human spirit.
          </p>
          <p>
            We invite you to explore the transformative power of daily practice. Together, we breathe, we move, and we grow.
          </p>
        </div>
      </div>*/}
    </section>
  )
}
