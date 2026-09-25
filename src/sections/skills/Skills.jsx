import { useState, useEffect, useMemo } from 'react'
import skillsData from '../../data/skills.json'
import SkillCategoryCard from '../../components/skills/SkillCategoryCard'

function Skills() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setData(skillsData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading skills data:', error)
      setLoading(false)
    }
  }, [skillsData])

  // Get data with fallbacks
  const categories = useMemo(() => {
    if (!data?.categories || !Array.isArray(data.categories)) return []
    return data.categories
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
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
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No skills data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
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
