import { useState, useEffect, useMemo } from 'react'
import landingData from '../../data/landing.json'
import HeroSection from '../../components/landing/HeroSection'
import StatsCard from '../../components/landing/StatsCard'
import FocusCard from '../../components/landing/FocusCard'
import TechStackCard from '../../components/landing/TechStackCard'

function Landing() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(landingData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading landing data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const hero = useMemo(() => data?.hero || {}, [data])
  const stats = useMemo(() => data?.stats || [], [data])
  const currentFocus = useMemo(() => data?.currentFocus || {}, [data])
  const techStack = useMemo(() => data?.techStack || {}, [data])
  const quickLinks = useMemo(() => data?.quickLinks || [], [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Landing</h1>
            <p className="text-body">No landing data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="mb-16 md:mb-24">
          <HeroSection hero={hero} quickLinks={quickLinks} meta={meta} />
        </section>

        {/* Stats Section */}
        {stats && stats.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {stats.map((stat) => (
                <StatsCard
                  key={stat.id || Math.random()}
                  stat={stat}
                />
              ))}
            </div>
          </section>
        )}

        {/* Current Focus Section */}
        {currentFocus && currentFocus.items && currentFocus.items.length > 0 && (
          <section className="mb-12 sm:mb-16 md:mb-24">
            {currentFocus.label && (
              <h2 className="text-head text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
                {currentFocus.label}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {currentFocus.items.map((item, index) => (
                <FocusCard
                  key={index}
                  item={item}
                />
              ))}
            </div>
          </section>
        )}

        {/* Tech Stack Section */}
        {techStack && techStack.categories && techStack.categories.length > 0 && (
          <section className="mb-12 sm:mb-16 md:mb-24">
            {techStack.title && (
              <h2 className="text-head text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
                {techStack.title}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              {techStack.categories.map((category, index) => (
                <TechStackCard
                  key={index}
                  category={category}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Landing
