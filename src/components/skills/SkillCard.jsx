/**
 * SkillCard - Displays an individual skill with details
 */
function SkillCard({ skill = {} }) {
  if (!skill || !skill.name) return null

  const getLevelBadge = (level) => {
    if (!level) return null
    const levelMap = {
      beginner: { label: 'Beginner', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      intermediate: { label: 'Intermediate', color: 'bg-gold/20 text-gold border-gold/30' },
      advanced: { label: 'Advanced', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      expert: { label: 'Expert', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    }
    const levelInfo = levelMap[level.toLowerCase()] || { label: level, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${levelInfo.color} backdrop-blur-sm shadow-sm`}>
        {levelInfo.label}
      </span>
    )
  }

  const getTypeBadge = (type) => {
    if (!type) return null
    const typeMap = {
      technical: { label: 'Technical', color: 'bg-gold/20 text-gold border-gold/30' },
      tool: { label: 'Tool', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      soft: { label: 'Soft Skill', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    }
    const typeInfo = typeMap[type.toLowerCase()] || { label: type, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${typeInfo.color} backdrop-blur-sm shadow-sm`}>
        {typeInfo.label}
      </span>
    )
  }

  return (
    <div
      className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 md:p-5 shadow-md"
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Skill Header */}
      <div className="mb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-head text-lg md:text-xl font-semibold flex-1">
            {skill.name}
          </h3>
          <div className="flex flex-wrap gap-2">
            {getLevelBadge(skill.level)}
            {getTypeBadge(skill.type)}
          </div>
        </div>
      </div>

      {/* Description */}
      {skill.description && (
        <p className="text-body text-sm md:text-base mb-4 leading-relaxed">
          {skill.description}
        </p>
      )}

      {/* Learned From */}
      {skill.learnedFrom && Array.isArray(skill.learnedFrom) && skill.learnedFrom.length > 0 && (
        <div className="mb-4">
          <h4 className="text-head text-xs font-semibold mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Learned From
          </h4>
          <ul className="space-y-1">
            {skill.learnedFrom.map((source, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-gold mt-1">•</span>
                <span className="text-body text-xs md:text-sm leading-relaxed flex-1">
                  {source}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Used In */}
      {skill.usedIn && Array.isArray(skill.usedIn) && skill.usedIn.length > 0 && (
        <div>
          <h4 className="text-head text-xs font-semibold mb-2 uppercase tracking-wide flex items-center gap-2">
            <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Used In
          </h4>
          <div className="flex flex-wrap gap-2">
            {skill.usedIn.map((project, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-card/90 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
              >
                {project}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillCard

