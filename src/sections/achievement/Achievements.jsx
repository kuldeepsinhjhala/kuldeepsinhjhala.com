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

function Achievements() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  /** Only one achievement expanded at a time (avoids row layout glitches). */
  const [expandedAchievementId, setExpandedAchievementId] = useState(null)

  // Load data
  useEffect(() => {
    try {
      setData(achievementData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading achievements data:', error)
      setLoading(false)
    }
  }, [achievementData])

  // Get data with fallbacks
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

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
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
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No achievements data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
        {achievementsList.length > 0 ? (
          <section className="mb-8 md:mb-12">
            <div className="grid grid-cols-1 gap-3 sm:gap-4 items-stretch">
              {achievementsList.map((achievement, index) => {
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
          </section>
        ) : (
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(87, 6, 140, 0.05)',
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
