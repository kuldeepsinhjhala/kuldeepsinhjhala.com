import { useState, useEffect, useMemo } from 'react'
import educationData from '../../data/education.json'
import DegreeCard from '../../components/education/DegreeCard'
import CertificationCard from '../../components/education/CertificationCard'
import OnlineCourseCard from '../../components/education/OnlineCourseCard'

function Education() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

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
  const meta = useMemo(() => data?.meta || {}, [data])
  const degrees = useMemo(() => {
    if (!data?.degrees || !Array.isArray(data.degrees)) return []
    return data.degrees
  }, [data])
  const certifications = useMemo(() => {
    if (!data?.certifications || !Array.isArray(data.certifications)) return []
    return data.certifications
  }, [data])
  const onlineCourses = useMemo(() => {
    if (!data?.onlineCourses || !Array.isArray(data.onlineCourses)) return []
    return data.onlineCourses
  }, [data])
  const skillsGained = useMemo(() => {
    if (!data?.skillsGained || !Array.isArray(data.skillsGained)) return []
    return data.skillsGained
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Education</h1>
            <p className="text-body">No education data available.</p>
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

        {/* Degrees Section */}
        {degrees && degrees.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              Academic Degrees
            </h2>
            <div className="space-y-8 md:space-y-12">
              {degrees.map((degree, index) => (
                <DegreeCard
                  key={degree.id || index}
                  degree={degree}
                  index={index}
                />
              ))}
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {certifications && certifications.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certifications.map((certification, index) => (
                <CertificationCard
                  key={certification.id || index}
                  certification={certification}
                />
              ))}
            </div>
          </section>
        )}

        {/* Online Courses Section */}
        {onlineCourses && onlineCourses.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              Online Courses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {onlineCourses.map((course, index) => (
                <OnlineCourseCard
                  key={course.id || index}
                  course={course}
                />
              ))}
            </div>
          </section>
        )}

        {/* Skills Gained Section */}
        {skillsGained && skillsGained.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12">
              Skills Gained
            </h2>
            <div
              className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
              }}
            >
              <div className="flex flex-wrap gap-3">
                {skillsGained.map((skill, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gold/20 backdrop-blur-sm text-gold text-sm font-medium rounded border border-gold/30 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Education
