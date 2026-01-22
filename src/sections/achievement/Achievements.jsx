import { useState, useEffect, useMemo } from 'react'
import achievementData from '../../data/achievements.json'
import AchievementCard from '../../components/achievements/AchievementCard'

function Achievements() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(achievementData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading achievements data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
  const categories = useMemo(() => {
    if (!data?.categories || !Array.isArray(data.categories)) return []
    return data.categories
  }, [data])
  const stats = useMemo(() => data?.stats || {}, [data])

  // Filter achievements
  const filteredAchievements = useMemo(() => {
    if (!data?.achievements || !Array.isArray(data.achievements)) return []

    let achievements = [...data.achievements]

    // Filter by visibility (only show public achievements)
    achievements = achievements.filter(achievement => {
      return achievement.visibility?.public !== false
    })

    // Filter by category
    if (selectedCategory) {
      achievements = achievements.filter(achievement => {
        return achievement.category === selectedCategory
      })
    }

    // Filter by featured
    if (showFeaturedOnly) {
      achievements = achievements.filter(achievement => {
        return achievement.visibility?.featured === true
      })
    }

    // Sort: featured first, then by date (newest first)
    achievements.sort((a, b) => {
      const aFeatured = a.visibility?.featured || false
      const bFeatured = b.visibility?.featured || false
      
      if (aFeatured && !bFeatured) return -1
      if (!aFeatured && bFeatured) return 1
      
      // If both have same featured status, sort by date
      const aDate = a.date?.achievedOn || a.date?.year || ''
      const bDate = b.date?.achievedOn || b.date?.year || ''
      
      return bDate.localeCompare(aDate)
    })

    return achievements
  }, [data, selectedCategory, showFeaturedOnly])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading achievements...</p>
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
            <h1 className="text-head text-3xl font-bold mb-4">Achievements</h1>
            <p className="text-body">No achievements data available.</p>
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
          {meta.description && (
            <p className="text-body text-sm md:text-base mt-2 max-w-3xl">
              {meta.description}
            </p>
          )}
        </header>

        {/* Stats Section */}
        {stats && Object.keys(stats).length > 0 && (
          <section className="mb-8 md:mb-12">
            <div 
              className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-6 shadow-lg"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                {stats.totalAchievements && (
                  <div className="text-center">
                    <div className="text-gold text-3xl md:text-4xl font-bold mb-1">
                      {stats.totalAchievements}
                    </div>
                    <div className="text-body text-sm md:text-base">
                      Total Achievements
                    </div>
                  </div>
                )}
                {stats.featuredCount && (
                  <div className="text-center">
                    <div className="text-gold text-3xl md:text-4xl font-bold mb-1">
                      {stats.featuredCount}
                    </div>
                    <div className="text-body text-sm md:text-base">
                      Featured
                    </div>
                  </div>
                )}
                {stats.lastUpdated && (
                  <div className="text-center">
                    <div className="text-gold text-lg md:text-xl font-semibold mb-1">
                      Last Updated
                    </div>
                    <div className="text-body text-sm">
                      {new Date(stats.lastUpdated).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Filters Section */}
        {(categories.length > 0 || stats.featuredCount) && (
          <section className="mb-8 md:mb-12">
            <div 
              className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-6 shadow-lg"
              style={{
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
              }}
            >
              <h3 className="text-head text-lg md:text-xl font-semibold mb-4">Filters</h3>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Category Filter */}
                {categories.length > 0 && (
                  <div className="flex-1">
                    <label className="block text-body text-sm font-medium mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
                      style={{
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                      }}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Featured Filter */}
                {stats.featuredCount && parseInt(stats.featuredCount) > 0 && (
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={showFeaturedOnly}
                        onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                        className="w-4 h-4 text-gold bg-card border-gold/20 rounded focus:ring-gold focus:ring-2"
                      />
                      <span className="text-body text-sm">Show Featured Only</span>
                    </label>
                  </div>
                )}

                {/* Clear Filters */}
                {(selectedCategory || showFeaturedOnly) && (
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        setSelectedCategory('')
                        setShowFeaturedOnly(false)
                      }}
                      className="px-4 py-2 bg-card/80 hover:bg-card/90 text-gold rounded border border-gold/20 hover:border-gold/30 transition-colors text-sm font-medium shadow-md"
                      style={{
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                      }}
                    >
                      Clear Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-body text-sm">
            Showing {filteredAchievements.length} of {data?.achievements?.length || 0} achievement{filteredAchievements.length !== 1 ? 's' : ''}
            {selectedCategory && (
              <span className="ml-2">
                in <span className="text-head font-medium">
                  {categories.find(c => c.id === selectedCategory)?.label || selectedCategory}
                </span>
              </span>
            )}
            {showFeaturedOnly && (
              <span className="ml-2">
                <span className="text-head font-medium">(Featured only)</span>
              </span>
            )}
          </p>
        </div>

        {/* Achievements Grid */}
        {filteredAchievements.length > 0 ? (
          <section className="mb-16 md:mb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id || Math.random()}
                  achievement={achievement}
                />
              ))}
            </div>
          </section>
        ) : (
          <div 
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
            }}
          >
            <svg
              className="w-16 h-16 text-body/50 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
            <h3 className="text-head text-xl font-semibold mb-2">No achievements found</h3>
            <p className="text-body">
              {selectedCategory || showFeaturedOnly
                ? 'Try adjusting your filters.'
                : 'No achievements available yet.'}
            </p>
            {(selectedCategory || showFeaturedOnly) && (
              <button
                onClick={() => {
                  setSelectedCategory('')
                  setShowFeaturedOnly(false)
                }}
                className="mt-4 px-4 py-2 bg-gold/20 backdrop-blur-sm text-gold rounded border border-gold/30 hover:bg-gold/30 transition-colors shadow-md"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Categories Info Section */}
        {categories.length > 0 && (
          <section className="mb-16 md:mb-24">
            <h2 className="text-head text-2xl md:text-3xl font-bold mb-8 md:mb-12 text-center">
              Achievement Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => {
                const categoryCount = filteredAchievements.filter(
                  a => a.category === category.id
                ).length
                return (
                  <div
                    key={category.id}
                    className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-5 md:p-6 shadow-lg"
                    style={{
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                    }}
                  >
                    <h3 className="text-head text-lg md:text-xl font-semibold mb-2">
                      {category.label}
                    </h3>
                    {category.description && (
                      <p className="text-body text-sm mb-3 leading-relaxed">
                        {category.description}
                      </p>
                    )}
                    <div className="mt-4 pt-4 border-t border-gold/20">
                      <span className="text-gold text-sm font-medium">
                        {categoryCount} achievement{categoryCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

export default Achievements

