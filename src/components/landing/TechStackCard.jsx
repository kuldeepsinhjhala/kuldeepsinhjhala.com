/**
 * TechStackCard - Reusable tech stack category card component
 * Displays a category of technologies
 */
function TechStackCard({ category, className = '' }) {
  if (!category || !category.name) return null

  return (
    <div
      className={`
        bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-6
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-200 shadow-lg
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
      }}
    >
      <h3 className="text-gold text-base md:text-lg font-semibold mb-4">
        {category.name}
      </h3>
      
      {category.items && category.items.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {category.items.map((item, index) => (
            <span
              key={index}
              className="
                px-3 py-1.5 bg-card/80 backdrop-blur-sm border border-gold/10 rounded
                text-body text-xs md:text-sm
                hover:border-gold/30 hover:text-head
                transition-colors shadow-sm
              "
              style={{
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
              }}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default TechStackCard

