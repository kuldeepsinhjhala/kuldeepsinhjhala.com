import { useState, useEffect, useMemo } from 'react'
import achievementData from '../../data/achievements.json'
import AchievementCard from '../../components/achievements/AchievementCard'

/** Used for primary sort; final list is reversed for display (see below). */
function getAchievementSequenceRank(a) {
  const s = a?.sequence
  if (s == null || s === '') return null
  const n = Number(s)
  return Number.isFinite(n) ? n : null
}

const INITIAL_VISIBLE_COUNT = 2

function Achievements() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  /** Only one achievement expanded at a time (avoids row layout glitches). */
  const [expandedAchievementId, setExpandedAchievementId] = useState(null)
  const [showAllAchievements, setShowAllAchievements] = useState(false)

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

  const achievementsList = useMemo(() => {
    if (!data?.achievements || !Array.isArray(data.achievements)) return []

    return [...data.achievements]
      .sort((a, b) => {
        const sa = getAchievementSequenceRank(a)
        const sb = getAchievementSequenceRank(b)
        if (sa != null && sb != null && sa !== sb) return sa - sb
        if (sa != null && sb == null) return -1
        if (sa == null && sb != null) return 1
        const aDate = a.date?.achievedOn || ''
        const bDate = b.date?.achievedOn || ''
        return bDate.localeCompare(aDate)
      })
      .reverse()
  }, [data])

  const visibleAchievements = useMemo(() => {
    if (showAllAchievements || achievementsList.length <= INITIAL_VISIBLE_COUNT) return achievementsList
    return achievementsList.slice(0, INITIAL_VISIBLE_COUNT)
  }, [achievementsList, showAllAchievements])

  const hasMoreAchievements = achievementsList.length > INITIAL_VISIBLE_COUNT

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
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
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="section-heading-highlight text-head text-3xl font-bold mb-4">Achievements</h2>
            <p className="text-body">No achievements data available.</p>
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

        {/* Achievements Grid */}
        {achievementsList.length > 0 ? (
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 items-start">
              {visibleAchievements.map((achievement, index) => {
                const cardKey = achievement.id ?? `achievement-${index}`
                return (
                  <AchievementCard
                    key={cardKey}
                    achievement={achievement}
                    expanded={expandedAchievementId === cardKey}
                    onToggle={() => {
                      setExpandedAchievementId((prev) =>
                        prev === cardKey ? null : cardKey
                      )
                    }}
                  />
                )
              })}
            </div>
            {hasMoreAchievements && (
              <div className="flex justify-center mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={() => {
                    setShowAllAchievements((v) => {
                      const next = !v
                      if (!next) setExpandedAchievementId(null)
                      return next
                    })
                  }}
                  className="px-6 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded-lg border border-gold/20 hover:border-gold transition-all duration-200"
                >
                  {showAllAchievements ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </section>
        ) : (
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
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
            <p className="text-body">No achievements available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Achievements
