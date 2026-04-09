import { useState, useEffect, useMemo } from 'react'
import skillsData from '../../data/skills.json'
import SkillCategoryCard from '../../components/skills/SkillCategoryCard'

function Skills() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(skillsData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading skills data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const categories = useMemo(() => {
    if (!data?.categories || !Array.isArray(data.categories)) return []
    return data.categories
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading skills...</p>
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
            <h2 className="section-heading-highlight text-head text-3xl font-bold mb-4">Skills</h2>
            <p className="text-body">No skills data available.</p>
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
            <h2 className="section-heading-highlight text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h2>
          )}
        </header>

        {/* Skills Categories */}
        {categories && categories.length > 0 && (
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-start">
              {categories.map((category, index) => (
                <SkillCategoryCard
                  key={category.id || index}
                  category={category}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Skills
