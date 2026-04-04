import { useState, useEffect, useMemo } from 'react'
import JourneyRoad from '../../components/journey/JourneyRoad'
import journeyDataRaw from '../../data/journey.json'

/** Higher `sequence` appears first (descending). Missing sequence sorts last. */
function getJourneySequenceRank(item) {
  const s = item?.sequence
  if (s == null || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

/** Start of milestone for tie-breaking when sequence is missing or equal. */
function getJourneyTimelineStartMs(item) {
  const t = item?.time
  if (!t) return 0
  const raw =
    t.startDate != null && String(t.startDate).trim() !== ''
      ? String(t.startDate).trim()
      : null
  if (raw) {
    if (raw === 'present') return Date.now()
    if (/^\d{4}$/.test(raw)) {
      const y = parseInt(raw, 10)
      return Number.isFinite(y) ? Date.UTC(y, 0, 1) : 0
    }
    const parsed = Date.parse(raw)
    if (!Number.isNaN(parsed)) return parsed
  }
  return 0
}

const INITIAL_VISIBLE_JOURNEYS = 3

function Journey() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAllJourneys, setShowAllJourneys] = useState(false)

  // Load data
  useEffect(() => {
    try {
      let parsedData = journeyDataRaw

      // Handle markdown code fences if present
      // If the imported data is a string (which shouldn't happen with .json, but handle it)
      if (typeof parsedData === 'string') {
        if (parsedData.trim().startsWith('```json')) {
          // Remove markdown code fences
          const jsonContent = parsedData
            .replace(/^```json\s*/i, '')
            .replace(/\s*```$/i, '')
            .trim()
          parsedData = JSON.parse(jsonContent)
        } else {
          // Try parsing as regular JSON string
          parsedData = JSON.parse(parsedData)
        }
      }

      setTimeout(() => {
        setData(parsedData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading journey data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const timeline = useMemo(() => {
    if (!data?.timeline || !Array.isArray(data.timeline)) return []
    // Omit `status` → public. Use `"status": { "visibility": "private" }` to hide an item.
    const visible = data.timeline.filter((item) => item?.status?.visibility !== 'private')
    return [...visible].sort((a, b) => {
      const sa = getJourneySequenceRank(a)
      const sb = getJourneySequenceRank(b)
      const ra = sa ?? Number.NEGATIVE_INFINITY
      const rb = sb ?? Number.NEGATIVE_INFINITY
      if (ra !== rb) return rb - ra
      return getJourneyTimelineStartMs(b) - getJourneyTimelineStartMs(a)
    })
  }, [data])

  const visibleTimeline = useMemo(() => {
    if (!timeline.length) return []
    if (showAllJourneys || timeline.length <= INITIAL_VISIBLE_JOURNEYS) {
      return timeline
    }
    return timeline.slice(0, INITIAL_VISIBLE_JOURNEYS)
  }, [timeline, showAllJourneys])

  const hasMoreJourneys = timeline.length > INITIAL_VISIBLE_JOURNEYS

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading journey...</p>
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
            <h1 className="section-heading-highlight text-head text-3xl font-bold mb-4">Journey</h1>
            <p className="text-body">No journey data available.</p>
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

        {/* Timeline: each item’s `media` (images, documents, links) renders inside the expanded card (JourneyTimelineItem). */}
        {timeline && timeline.length > 0 && (
          <section className="mb-8 md:mb-12">
            <JourneyRoad
              timeline={visibleTimeline}
              showContinuationBadge={
                showAllJourneys || timeline.length <= INITIAL_VISIBLE_JOURNEYS
              }
            />
            {hasMoreJourneys && (
              <div className="flex justify-center mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={() => setShowAllJourneys((prev) => !prev)}
                  className="px-6 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded-lg border border-gold/20 hover:border-gold transition-all duration-200"
                >
                  {showAllJourneys ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  )
}

export default Journey
