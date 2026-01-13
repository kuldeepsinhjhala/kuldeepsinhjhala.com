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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Skills</h1>
            <p className="text-body">No skills data available.</p>
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

        {/* Skills Categories */}
        {categories && categories.length > 0 && (
          <section className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
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
