import { useState, useEffect, useMemo } from 'react'
import landingData from '../../data/landing.json'
import HeroSection from '../../components/landing/HeroSection'
import TechStackCard from '../../components/landing/TechStackCard'

function Landing() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openTechKey, setOpenTechKey] = useState(null)

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
  const techStack = useMemo(() => data?.techStack || {}, [data])
  const quickLinks = useMemo(() => data?.quickLinks || [], [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen px-4 pb-4 pt-8 md:px-8 md:pb-8 md:pt-12 lg:px-12 lg:pb-12 lg:pt-16">
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
      <div className="bg-dotted min-h-screen px-4 pb-4 pt-8 md:px-8 md:pb-8 md:pt-12 lg:px-12 lg:pb-12 lg:pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="section-heading-highlight text-head text-3xl font-bold mb-4">Landing</h1>
            <p className="text-body">No landing data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-screen px-4 pb-4 pt-8 md:px-8 md:pb-8 md:pt-12 lg:px-12 lg:pb-12 lg:pt-16">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="pt-4 md:pt-6 lg:pt-8 mb-16 md:mb-24">
          <HeroSection hero={hero} quickLinks={quickLinks} meta={meta} />
        </section>

        {/* Tech Stack Section */}
        {techStack && techStack.categories && techStack.categories.length > 0 && (
          <section className="mb-12 sm:mb-16 md:mb-24">
            {techStack.title && (
              <h2 className="section-heading-highlight text-head text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center md:text-left">
                {techStack.title}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-start">
              {techStack.categories.map((category, index) => {
                const cardKey = category.name || `tech-${index}`
                return (
                  <TechStackCard
                    key={cardKey}
                    category={category}
                    expanded={openTechKey === cardKey}
                    onExpandedChange={(open) =>
                      setOpenTechKey(open ? cardKey : null)
                    }
                  />
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Landing
