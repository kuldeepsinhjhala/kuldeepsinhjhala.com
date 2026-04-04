/**
 * AchievementCard - Compact achievement line (title only). Used by Journey and Experience.
 */
function AchievementCard({ achievement = {}, className = '' }) {
  if (!achievement || !achievement.title) return null

  return (
    <div
      className={`
        bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg px-4 py-3
        shadow-md
        ${className}
      `}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
    >
      <h5 className="text-head text-sm font-semibold">{achievement.title}</h5>
    </div>
  )
}

export default AchievementCard

