import TechnologySection from '../experience/TechnologySection'

/**
 * ProjectDetailCard - Displays detailed project information
 */
function ProjectDetailCard({ project = {}, onClose }) {
  if (!project || !project.title) return null

  const getStatusBadge = (status) => {
    if (!status) return null
    const statusMap = {
      completed: { label: 'Completed', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
      'in-progress': { label: 'In Progress', color: 'bg-gold/20 text-gold border-gold/30' },
      planning: { label: 'Planning', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
      onhold: { label: 'On Hold', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
    }
    const statusInfo = statusMap[status.toLowerCase()] || { label: status, color: 'bg-card/80 text-body border-gold/10' }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded border ${statusInfo.color} backdrop-blur-sm shadow-sm`}>
        {statusInfo.label}
      </span>
    )
  }

  return (
    <div
      className="bg-card/95 backdrop-blur-sm border-2 border-gold rounded-lg p-6 md:p-8 shadow-xl relative"
      style={{
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(201, 166, 107, 0.1)'
      }}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-gold hover:text-gold/80 transition-all bg-card/80 backdrop-blur-sm rounded-full p-1 border border-gold/20 hover:border-gold hover:ring-1 hover:ring-gold/50 cursor-pointer"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Cover Image */}
      {project.media?.coverImage?.url && (
        <div className="mb-6 rounded-lg overflow-hidden">
          <img
            src={project.media.coverImage.url}
            alt={project.media.coverImage.alt || project.title}
            className="w-full h-64 md:h-80 object-cover"
          />
        </div>
      )}

      {/* Header */}
      <div className="mb-6 pb-6 border-b border-gold/20">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-head text-3xl md:text-4xl font-bold flex-1">
            {project.title}
          </h2>
          {getStatusBadge(project.status)}
        </div>
        <div className="flex flex-wrap gap-2">
          {project.category && (
            <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm capitalize">
              {project.category}
            </span>
          )}
          {project.type && (
            <span className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm font-medium rounded border border-gold/10 shadow-sm capitalize">
              {project.type}
            </span>
          )}
        </div>
      </div>

      {/* Long Description */}
      {project.longDescription && (
        <div className="mb-6">
          <p className="text-body text-base md:text-lg leading-relaxed">
            {project.longDescription}
          </p>
        </div>
      )}

      {/* Organization */}
      {project.organization && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-2">Organization</h3>
          <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
            <p className="text-gold font-medium">{project.organization.name}</p>
            {project.organization.role && (
              <p className="text-body text-sm mt-1">Role: {project.organization.role}</p>
            )}
            {project.organization.teamSize && (
              <p className="text-body text-sm">Team Size: {project.organization.teamSize}</p>
            )}
          </div>
        </div>
      )}

      {/* Problem & Solution */}
      {project.problem && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
            <h3 className="text-head text-lg font-semibold mb-2">Problem</h3>
            {project.problem.summary && (
              <p className="text-body text-sm mb-2">{project.problem.summary}</p>
            )}
            {project.problem.constraints && Array.isArray(project.problem.constraints) && project.problem.constraints.length > 0 && (
              <ul className="space-y-1">
                {project.problem.constraints.map((constraint, idx) => (
                  <li key={idx} className="text-body text-xs flex items-start gap-2">
                    <span className="text-gold mt-1">•</span>
                    <span>{constraint}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {project.solution && (
            <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
              <h3 className="text-head text-lg font-semibold mb-2">Solution</h3>
              {project.solution.approach && (
                <p className="text-body text-sm mb-2">{project.solution.approach}</p>
              )}
              {project.solution.architecture && (
                <p className="text-body text-xs mb-2">
                  <span className="font-semibold text-head">Architecture: </span>
                  {project.solution.architecture}
                </p>
              )}
              {project.solution.designPatterns && Array.isArray(project.solution.designPatterns) && project.solution.designPatterns.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {project.solution.designPatterns.map((pattern, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded border border-gold/20"
                    >
                      {pattern}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Features */}
      {project.features && Array.isArray(project.features) && project.features.length > 0 && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-3">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4"
              >
                <h4 className="text-head font-semibold mb-1">{feature.title}</h4>
                {feature.description && (
                  <p className="text-body text-sm mb-2">{feature.description}</p>
                )}
                {feature.impact && (
                  <p className="text-gold text-xs">
                    <span className="font-semibold">Impact: </span>
                    {feature.impact}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Challenges */}
      {project.challenges && Array.isArray(project.challenges) && project.challenges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-3">Challenges & Learnings</h3>
          <div className="space-y-3">
            {project.challenges.map((challenge, idx) => (
              <div
                key={idx}
                className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4"
              >
                {challenge.challenge && (
                  <p className="text-head font-semibold text-sm mb-1">
                    Challenge: {challenge.challenge}
                  </p>
                )}
                {challenge.solution && (
                  <p className="text-body text-sm mb-1">
                    Solution: {challenge.solution}
                  </p>
                )}
                {challenge.learning && (
                  <p className="text-gold text-xs italic">
                    Learning: {challenge.learning}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tech Stack */}
      {project.techStack && Object.keys(project.techStack).length > 0 && (
        <div className="mb-6">
          <TechnologySection technologies={project.techStack} />
        </div>
      )}

      {/* Metrics */}
      {project.metrics && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-3">Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project.metrics.performance && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
                <h4 className="text-head text-xs font-semibold mb-1 uppercase">Performance</h4>
                <p className="text-body text-sm">{project.metrics.performance}</p>
              </div>
            )}
            {project.metrics.scale && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
                <h4 className="text-head text-xs font-semibold mb-1 uppercase">Scale</h4>
                <p className="text-body text-sm">{project.metrics.scale}</p>
              </div>
            )}
            {project.metrics.reliability && (
              <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
                <h4 className="text-head text-xs font-semibold mb-1 uppercase">Reliability</h4>
                <p className="text-body text-sm">{project.metrics.reliability}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Skills Gained */}
      {project.skillsGained && Array.isArray(project.skillsGained) && project.skillsGained.length > 0 && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-3">Skills Gained</h3>
          <div className="flex flex-wrap gap-2">
            {project.skillsGained.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-gold/20 text-gold text-sm rounded border border-gold/30 backdrop-blur-sm shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-head text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-card/80 backdrop-blur-sm text-body text-sm rounded border border-gold/10 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      {project.links && (
        <div className="mb-6 pt-6 border-t border-gold/20">
          <h3 className="text-head text-lg font-semibold mb-3">Links</h3>
          <div className="flex flex-wrap gap-3">
            {project.links.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            )}
            {project.links.demo && (
              <a
                href={project.links.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Live Demo
              </a>
            )}
            {project.links.documentation && (
              <a
                href={project.links.documentation}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Documentation
              </a>
            )}
            {project.links.blog && (
              <a
                href={project.links.blog}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-gold/20 hover:bg-gold/30 text-gold rounded border border-gold/30 hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Blog Post
              </a>
            )}
          </div>
        </div>
      )}

      {/* Custom Section */}
      {project.custom && (
        <div className="mb-6 pt-6 border-t border-gold/20">
          {project.custom.heading && (
            <h3 className="text-head text-xl md:text-2xl font-bold mb-4">
              {project.custom.heading}
            </h3>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {/* Custom Image */}
            {project.custom.image && (
              <div className="flex-shrink-0 w-full md:w-1/2 lg:w-2/5">
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={project.custom.image}
                    alt={project.custom.heading || 'Custom content'}
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23112240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23C9A66B" font-family="Arial" font-size="20"%3EImage Not Found%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Custom Data Points */}
            {project.custom.data && Array.isArray(project.custom.data) && project.custom.data.length > 0 && (
              <div className={`flex-1 ${project.custom.image ? 'md:pl-0' : ''}`}>
                <ul className="space-y-3">
                  {project.custom.data.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-gold mt-1.5 flex-shrink-0">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="text-body text-base leading-relaxed flex-1">
                        {point}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Duration */}
      {project.duration && (
        <div className="pt-6 border-t border-gold/20">
          <p className="text-body text-sm">
            <span className="font-semibold text-head">Duration: </span>
            {project.duration.durationText || 'N/A'}
            {project.duration.working && (
              <span className="ml-2 px-2 py-0.5 bg-gold/20 text-gold text-xs rounded border border-gold/30">
                Currently Working
              </span>
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default ProjectDetailCard

