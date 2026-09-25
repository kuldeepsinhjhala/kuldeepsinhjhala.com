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

function Journey() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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

      setData(parsedData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading journey data:', error)
      setLoading(false)
    }
  }, [journeyDataRaw])

  // Get data with fallbacks
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
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
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No journey data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
        {timeline && timeline.length > 0 && (
          <section className="mb-8 md:mb-12">
            <JourneyRoad timeline={timeline} />
          </section>
        )}
      </div>
    </div>
  )
}

export default Journey
