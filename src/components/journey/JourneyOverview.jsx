/**
 * JourneyOverview - Reusable component for displaying journey overview section
 * Shows headline, summary, current focus, long-term goals, and custom values
 */
function JourneyOverview({ overview = {}, className = '' }) {
  if (!overview || Object.keys(overview).length === 0) return null

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8
        shadow-lg
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {overview.headline && (
        <h2 className="text-head text-2xl md:text-3xl font-bold mb-4">
          {overview.headline}
        </h2>
      )}

      {overview.summary && (
        <p className="text-body text-base md:text-lg mb-6 leading-relaxed">
          {overview.summary}
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current Focus */}
        {overview.currentFocus && (
          <div className="space-y-2">
            <h3 className="text-gold text-sm font-semibold uppercase tracking-wide">
              Current Focus
            </h3>
            <p className="text-head text-base">
              {overview.currentFocus}
            </p>
          </div>
        )}

        {/* Long Term Goal */}
        {overview.longTermGoal && (
          <div className="space-y-2">
            <h3 className="text-gold text-sm font-semibold uppercase tracking-wide">
              Long Term Goal
            </h3>
            <p className="text-head text-base">
              {overview.longTermGoal}
            </p>
          </div>
        )}
      </div>

      {/* Custom Section */}
      {overview.custom && (
        <div className="mt-6 pt-6 border-t border-gold/10">
          {overview.custom.inspiration && (
            <div className="mb-4">
              <h3 className="text-gold text-sm font-semibold uppercase tracking-wide mb-2">
                Inspiration
              </h3>
              <p className="text-body text-sm italic">
                "{overview.custom.inspiration}"
              </p>
            </div>
          )}

          {overview.custom.values && Array.isArray(overview.custom.values) && overview.custom.values.length > 0 && (
            <div>
              <h3 className="text-gold text-sm font-semibold uppercase tracking-wide mb-3">
                Values
              </h3>
              <div className="flex flex-wrap gap-2">
                {overview.custom.values.map((value, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
                    style={{
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                    }}
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JourneyOverview

