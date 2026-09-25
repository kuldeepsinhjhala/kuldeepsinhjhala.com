import { useState, useEffect, useMemo } from 'react'
import landingData from '../../data/landing.json'
import HeroSection from '../../components/landing/HeroSection'
import TechStackCard from '../../components/landing/TechStackCard'
import { resolveS3Url } from '../../utils/resolveS3Url'

function Landing() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openTechKey, setOpenTechKey] = useState(null)

  // Load data
  useEffect(() => {
    try {
      setData(landingData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading landing data:', error)
      setLoading(false)
    }
  }, [landingData])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const hero = useMemo(() => {
    const h = data?.hero || {}
    return {
      ...h,
      profile: {
        ...h.profile,
        image: resolveS3Url(h.profile?.image),
      },
    }
  }, [data])
  const techStack = useMemo(() => data?.techStack || {}, [data])
  const quickLinks = useMemo(() => data?.quickLinks || [], [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-12 lg:pb-12">
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
      <div className="bg-dotted min-h-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-12 lg:pb-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No landing data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-full pt-8 pb-4 md:pt-10 md:pb-8 lg:pt-12 lg:pb-12">
      <div className="site-shell">
        <section className="mb-4 md:mb-5">
          <HeroSection hero={hero} quickLinks={quickLinks} meta={meta} />
        </section>

        {techStack && techStack.categories && techStack.categories.length > 0 && (
          <section>
            {techStack.title && (
              <h2 className="section-heading-highlight text-head text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center md:text-left">
                {techStack.title}
              </h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 items-start">
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
