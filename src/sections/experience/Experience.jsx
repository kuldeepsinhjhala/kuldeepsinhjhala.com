import { useState, useEffect, useMemo } from 'react'
import experienceData from '../../data/experience.json'
import ExperienceSummary from '../../components/experience/ExperienceSummary'
import ExperienceCard from '../../components/experience/ExperienceCard'

function Experience() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
  const summary = useMemo(() => data?.summary || {}, [data])
  const experiences = useMemo(() => {
    if (!data?.experiences || !Array.isArray(data.experiences)) return []
    return data.experiences
  }, [data])
  const totalExperience = useMemo(() => data?.totalExperience || {}, [data])
  const skillsSummary = useMemo(() => data?.skillsSummary || {}, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Experience</h1>
            <p className="text-body">No experience data available.</p>
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

        {/* Summary Section */}
        {summary && Object.keys(summary).length > 0 && (
          <section className="mb-16 md:mb-24">
            <ExperienceSummary 
              summary={summary} 
              totalExperience={totalExperience}
              skillsSummary={skillsSummary}
            />
          </section>
        )}

        {/* Experiences Section */}
        {experiences && experiences.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              Work Experience
            </h2>
            <div className="space-y-8 md:space-y-12">
              {experiences.map((experience, index) => (
                <ExperienceCard
                  key={experience.id || index}
                  experience={experience}
                  index={index}
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
