/**
 * ProjectCard - Displays a project within an experience entry
 * Supports both 'name' (experience) and 'title' (education) fields
 */
function ProjectCard({ project = {} }) {
  const projectName = project.name || project.title
  if (!project || !projectName) return null

  return (
    <div
      className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4 shadow-md h-full"
      style={{
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
      }}
    >
      {/* Project Name */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h5 className="text-head text-base font-semibold flex-1">
          {projectName}
        </h5>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold hover:text-gold/80 transition-colors flex-shrink-0"
            aria-label="View project"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        )}
      </div>

      {/* Role or Year */}
      {(project.role || project.year) && (
        <p className="text-gold text-sm font-medium mb-2">
          {project.role || `Year: ${project.year}`}
        </p>
      )}

      {/* Description */}
      {project.description && (
        <p className="text-body text-sm mb-3 leading-relaxed">
          {project.description}
        </p>
      )}

      {/* Technologies */}
      {project.technologies && Array.isArray(project.technologies) && project.technologies.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.map((tech, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-card/90 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Outcome */}
      {project.outcome && (
        <div className="pt-3 border-t border-gold/10">
          <p className="text-body text-xs leading-relaxed">
            <span className="font-semibold text-head">Outcome: </span>
            {project.outcome}
          </p>
        </div>
      )}

      {/* Custom Fields */}
      {project.custom && Object.keys(project.custom).length > 0 && (
        <div className="pt-3 mt-3 border-t border-gold/10 space-y-1">
          {Object.entries(project.custom).map(([key, value]) => {
            if (Array.isArray(value)) {
              return (
                <div key={key} className="text-xs">
                  <span className="text-head font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                  </span>
                  <span className="text-body">
                    {value.join(', ')}
                  </span>
                </div>
              )
            }
            return (
              <div key={key} className="text-xs">
                <span className="text-head font-medium capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}:{' '}
                </span>
                <span className="text-body">{String(value)}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ProjectCard

