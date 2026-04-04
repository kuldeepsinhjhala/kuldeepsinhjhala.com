import { useState, useEffect, useMemo } from 'react'
import experienceData from '../../data/experience.json'
import ExperienceCard from '../../components/experience/ExperienceCard'

/** Higher `sequence` appears first (descending). Missing sequence sorts last. */
function getExperienceSequenceRank(exp) {
  const s = exp?.sequence
  if (s == null || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

function getExperienceStartMs(exp) {
  const start = exp?.duration?.startDate
  if (start == null || String(start).trim() === '') return 0
  const raw = String(start).trim()
  if (/^\d{4}$/.test(raw)) {
    const y = parseInt(raw, 10)
    return Number.isFinite(y) ? Date.UTC(y, 0, 1) : 0
  }
  const parsed = Date.parse(raw)
  return Number.isNaN(parsed) ? 0 : parsed
}

const INITIAL_VISIBLE_COUNT = 2

function Experience() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAllExperiences, setShowAllExperiences] = useState(false)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(experienceData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading experience data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const experiences = useMemo(() => {
    if (!data?.experiences || !Array.isArray(data.experiences)) return []
    return [...data.experiences].sort((a, b) => {
      const sa = getExperienceSequenceRank(a)
      const sb = getExperienceSequenceRank(b)
      const ra = sa ?? Number.NEGATIVE_INFINITY
      const rb = sb ?? Number.NEGATIVE_INFINITY
      if (ra !== rb) return rb - ra
      return getExperienceStartMs(b) - getExperienceStartMs(a)
    })
  }, [data])

  const visibleExperiences = useMemo(() => {
    if (showAllExperiences || experiences.length <= INITIAL_VISIBLE_COUNT) return experiences
    return experiences.slice(0, INITIAL_VISIBLE_COUNT)
  }, [experiences, showAllExperiences])

  const hasMoreExperiences = experiences.length > INITIAL_VISIBLE_COUNT

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading experience...</p>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="section-heading-highlight text-head text-3xl font-bold mb-4">Experience</h1>
            <p className="text-body">No experience data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12 text-center">
          {meta.title && (
            <h1 className="section-heading-highlight text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h1>
          )}
        </header>

        {/* Experiences Section */}
        {experiences && experiences.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="space-y-8 md:space-y-12">
              {visibleExperiences.map((experience, index) => (
                <ExperienceCard
                  key={experience.id || index}
                  experience={experience}
                />
              ))}
            </div>
            {hasMoreExperiences && (
              <div className="flex justify-center mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={() => setShowAllExperiences((v) => !v)}
                  className="px-6 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded-lg border border-gold/20 hover:border-gold transition-all duration-200"
                >
                  {showAllExperiences ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Experience
