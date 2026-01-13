import { useState, useEffect, useMemo } from 'react'
import JourneyOverview from '../../components/journey/JourneyOverview'
import JourneyRoad from '../../components/journey/JourneyRoad'
import journeyDataRaw from '../../data/journey.json'

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
  const overview = useMemo(() => data?.overview || {}, [data])
  const timeline = useMemo(() => {
    if (!data?.timeline || !Array.isArray(data.timeline)) return []
    // Filter by visibility if needed
    return data.timeline.filter(item => {
      if (item?.status?.visibility === 'private') return false
      return true
    })
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Journey</h1>
            <p className="text-body">No journey data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          {meta.title && (
            <h1 className="text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h1>
          )}
          {meta.subtitle && (
            <p className="text-body text-lg md:text-xl">
              {meta.subtitle}
            </p>
          )}
        </header>

        {/* Overview Section */}
        {overview && Object.keys(overview).length > 0 && (
          <section className="mb-16 md:mb-24">
            <JourneyOverview overview={overview} />
          </section>
        )}

        {/* Timeline Section - Road View */}
        {timeline && timeline.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-12 text-center">
              My Journey Roadmap
            </h2>
            <JourneyRoad timeline={timeline} />
          </section>
        )}
      </div>
    </div>
  )
}

export default Journey
