import SkillCard from './SkillCard'

/**
 * SkillCategoryCard - Displays a category of skills
 */
function SkillCategoryCard({ category = {} }) {
  if (!category || !category.name) return null

  const skills = category.skills || []

  return (
    <div
      className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6 md:p-8 shadow-lg"
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Category Header */}
      <div className="mb-6 pb-4 border-b border-gold/20">
        <h2 className="text-head text-2xl md:text-3xl font-bold mb-2">
          {category.name}
        </h2>
        {category.description && (
          <p className="text-body text-sm md:text-base leading-relaxed">
            {category.description}
          </p>
        )}
      </div>

      {/* Skills List */}
      {skills.length > 0 ? (
        <div className="space-y-4">
          {skills.map((skill, index) => (
            <SkillCard
              key={skill.id || index}
              skill={skill}
            />
          ))}
        </div>
      ) : (
        <p className="text-body text-sm text-center py-4">
          No skills listed in this category.
        </p>
      )}
    </div>
  )
}

export default SkillCategoryCard

