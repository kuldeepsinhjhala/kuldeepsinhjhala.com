/**
 * SkillsList - Reusable component for displaying a list of skills
 * Shows skills as tags/badges
 */
function SkillsList({ skills = [], className = '' }) {
  if (!skills || !Array.isArray(skills) || skills.length === 0) return null

  return (
    <div className={className}>
      <h4 className="text-head text-sm font-semibold mb-3">Skills Developed</h4>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="px-3 py-1.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 hover:border-gold/30 hover:text-head transition-colors shadow-sm"
            style={{
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
            }}
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default SkillsList

