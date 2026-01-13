/**
 * AchievementCard - Reusable component for displaying an achievement
 * Shows title, description, impact, metrics, and custom data
 */
function AchievementCard({ achievement = {}, className = '' }) {
  if (!achievement || !achievement.title) return null

  return (
    <div
      className={`
        bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4
        shadow-md
        ${className}
      `}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Title */}
      <h5 className="text-head text-sm font-semibold mb-2">
        {achievement.title}
      </h5>

      {/* Description */}
      {achievement.description && (
        <p className="text-body text-xs mb-3 leading-relaxed">
          {achievement.description}
        </p>
      )}

      {/* Metrics */}
      {achievement.metrics && (
        <div className="mb-2">
          <span className="text-gold text-lg font-bold">
            {achievement.metrics.value}
          </span>
          {achievement.metrics.unit && (
            <span className="text-body text-xs ml-1">
              {achievement.metrics.unit}
            </span>
          )}
        </div>
      )}

      {/* Impact */}
      {achievement.impact && (
        <div className="mt-2">
          <span className="inline-block px-2 py-1 bg-gold/10 text-gold text-xs rounded border border-gold/20">
            {achievement.impact}
          </span>
        </div>
      )}
    </div>
  )
}

export default AchievementCard

