import { useState, useEffect, useMemo } from 'react'
import educationData from '../../data/education.json'
import DegreeCard from '../../components/education/DegreeCard'

/** Higher `sequence` appears first (descending). Missing sequence sorts last. */
function getDegreeSequenceRank(degree) {
  const s = degree?.sequence
  if (s == null || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Tie-break when sequence is missing or equal (later start = more recent first). */
function getDegreeStartMs(degree) {
  const raw = degree?.duration?.startDate
  if (raw == null || String(raw).trim() === '') return 0
  const str = String(raw).trim()
  if (/^\d{4}$/.test(str)) {
    const y = parseInt(str, 10)
    return Number.isFinite(y) ? Date.UTC(y, 0, 1) : 0
  }
  const parsed = Date.parse(str)
  return Number.isNaN(parsed) ? 0 : parsed
}

function Education() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  /** Accordion: at most one degree expanded at a time (same pattern as JourneyRoad). */
  const [expandedDegreeKeys, setExpandedDegreeKeys] = useState({})

  const toggleDegreeExpand = (key) => {
    setExpandedDegreeKeys((prev) => {
      if (prev[key]) return {}
      return { [key]: true }
    })
  }

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(educationData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading education data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const degrees = useMemo(() => {
    if (!data?.degrees || !Array.isArray(data.degrees)) return []
    return [...data.degrees].sort((a, b) => {
      const sa = getDegreeSequenceRank(a)
      const sb = getDegreeSequenceRank(b)
      const ra = sa ?? Number.NEGATIVE_INFINITY
      const rb = sb ?? Number.NEGATIVE_INFINITY
      if (ra !== rb) return rb - ra
      return getDegreeStartMs(b) - getDegreeStartMs(a)
    })
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading education...</p>
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
            <p className="text-body">No education data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
        {degrees && degrees.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="space-y-6 md:space-y-8">
              {degrees.map((degree, index) => {
                const degreeKey = degree.id ?? index
                return (
                  <DegreeCard
                    key={degreeKey}
                    degree={degree}
                    index={index}
                    expanded={Boolean(expandedDegreeKeys[degreeKey])}
                    onToggle={() => toggleDegreeExpand(degreeKey)}
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

export default Education
