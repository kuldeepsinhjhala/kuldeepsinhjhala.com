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

function Experience() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setData(experienceData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading experience data:', error)
      setLoading(false)
    }
  }, [experienceData])

  // Get data with fallbacks
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
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
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No experience data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
        {experiences && experiences.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="space-y-8 md:space-y-12">
              {experiences.map((experience, index) => (
                <ExperienceCard
                  key={experience.id || index}
                  experience={experience}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Experience
