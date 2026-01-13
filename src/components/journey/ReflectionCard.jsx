/**
 * ReflectionCard - Reusable component for displaying reflection section
 * Shows challenges, learnings, and mindset
 */
function ReflectionCard({ reflection = {}, className = '' }) {
  if (!reflection || Object.keys(reflection).length === 0) return null

  return (
    <div
      className={`
        bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 md:p-6
        shadow-md
        ${className}
      `}
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
    >
      <h4 className="text-head text-sm font-semibold mb-4">Reflection</h4>
      
      <div className="space-y-4">
        {/* Challenges */}
        {reflection.challenges && (
          <div>
            <h5 className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
              Challenges
            </h5>
            <p className="text-body text-sm leading-relaxed">
              {reflection.challenges}
            </p>
          </div>
        )}

        {/* Learnings */}
        {reflection.learnings && (
          <div>
            <h5 className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
              Learnings
            </h5>
            <p className="text-body text-sm leading-relaxed">
              {reflection.learnings}
            </p>
          </div>
        )}

        {/* Mindset */}
        {reflection.mindset && (
          <div>
            <h5 className="text-gold text-xs font-semibold uppercase tracking-wide mb-2">
              Mindset
            </h5>
            <p className="text-body text-sm italic">
              "{reflection.mindset}"
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReflectionCard

