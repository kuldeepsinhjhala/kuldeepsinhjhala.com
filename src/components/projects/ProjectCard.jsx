import { useState } from 'react'
import ProjectDetailCard from './ProjectDetailCard'
import TechnologySection from '../experience/TechnologySection'

/**
 * ProjectCard - Displays a project card with expandable details
 */
function ProjectCard({ project = {} }) {
  const [isExpanded, setIsExpanded] = useState(false)

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

  const getTypeBadge = (type) => {
    if (!type) return null
    return (
      <span className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs font-medium rounded border border-gold/10 shadow-sm capitalize">
        {type}
      </span>
    )
  }

  const getCategoryBadge = (category) => {
    if (!category) return null
    return (
      <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded border border-gold/30 backdrop-blur-sm shadow-sm capitalize">
        {category}
      </span>
    )
  }

  return (
    <>
      {/* Compact Card View */}
      {!isExpanded && (
        <div
          className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-5 md:p-6 shadow-lg cursor-pointer hover:border-gold hover:ring-1 hover:ring-gold/50 transition-all duration-200 h-full flex flex-col"
          style={{
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
          }}
          onClick={() => setIsExpanded(true)}
        >
          {/* Cover Image */}
          {project.media?.coverImage?.url && (
            <div className="mb-4 rounded-lg overflow-hidden">
              <img
                src={project.media.coverImage.url}
                alt={project.media.coverImage.alt || project.title}
                className="w-full h-48 object-cover"
              />
            </div>
          )}

          {/* Header */}
          <div className="mb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-head text-xl md:text-2xl font-bold flex-1">
                {project.title}
              </h3>
              {getStatusBadge(project.status)}
            </div>
            <div className="flex flex-wrap gap-2">
              {getCategoryBadge(project.category)}
              {getTypeBadge(project.type)}
            </div>
          </div>

          {/* Short Description */}
          {project.shortDescription && (
            <p className="text-body text-sm mb-4 leading-relaxed flex-1">
              {project.shortDescription}
            </p>
          )}

          {/* Tags */}
          {project.tags && Array.isArray(project.tags) && project.tags.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10 shadow-sm"
                >
                  {tag}
                </span>
              ))}
              {project.tags.length > 3 && (
                <span className="px-2 py-1 text-body text-xs">
                  +{project.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Tech Stack Preview */}
          {project.techStack && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-1.5">
                {project.techStack.languages?.slice(0, 3).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
                  >
                    {tech}
                  </span>
                ))}
                {project.techStack.frameworks?.slice(0, 2).map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 bg-card/80 backdrop-blur-sm text-body text-xs rounded border border-gold/10"
                  >
                    {tech}
                  </span>
                ))}
                {((project.techStack.languages?.length || 0) + (project.techStack.frameworks?.length || 0)) > 5 && (
                  <span className="px-2 py-0.5 text-body text-xs">+more</span>
                )}
              </div>
            </div>
          )}

          {/* Links Preview */}
          {(project.links?.github || project.links?.demo) && (
            <div className="mt-auto pt-4 border-t border-gold/20 flex gap-3">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-gold hover:text-gold/80 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
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
                  onClick={(e) => e.stopPropagation()}
                  className="text-gold hover:text-gold/80 text-sm font-medium transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Demo
                </a>
              )}
            </div>
          )}

          {/* View Details Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(true)
            }}
            className="mt-4 w-full px-4 py-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded border border-gold/20 hover:border-gold transition-all duration-200 flex items-center justify-center gap-2"
          >
            <span>View Details</span>
            <svg 
              className="w-4 h-4 transition-transform"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Expanded Detail View */}
      {isExpanded && (
        <div className="col-span-full">
          <ProjectDetailCard
            project={project}
            onClose={() => setIsExpanded(false)}
          />
        </div>
      )}
    </>
  )
}

export default ProjectCard

