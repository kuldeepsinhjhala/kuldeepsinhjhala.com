import TechnologySection from '../experience/TechnologySection'
import ProjectMediaSection from './ProjectMediaSection'

/**
 * Full project narrative + tech + media + duration (single source; used inside collapsible).
 */
function ProjectExpandedBody({ project = {} }) {
  if (!project || !project.title) return null

  return (
    <div className="space-y-6 pt-5 sm:pt-6">
      {project.longDescription && (
        <div>
          <p className="text-body text-base md:text-lg leading-relaxed">
            {project.longDescription}
          </p>
        </div>
      )}

      {project.organization && (
        <div>
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

      {project.problem && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card/80 backdrop-blur-sm border border-gold/10 rounded-lg p-4">
            <h3 className="text-head text-lg font-semibold mb-2">Problem</h3>
            {project.problem.summary && (
              <p className="text-body text-sm mb-2">{project.problem.summary}</p>
            )}
            {project.problem.constraints &&
              Array.isArray(project.problem.constraints) &&
              project.problem.constraints.length > 0 && (
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
              {project.solution.designPatterns &&
                Array.isArray(project.solution.designPatterns) &&
                project.solution.designPatterns.length > 0 && (
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

      {project.features && Array.isArray(project.features) && project.features.length > 0 && (
        <div>
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

      {project.challenges && Array.isArray(project.challenges) && project.challenges.length > 0 && (
        <div>
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
                  <p className="text-body text-sm mb-1">Solution: {challenge.solution}</p>
                )}
                {challenge.learning && (
                  <p className="text-gold text-xs italic">Learning: {challenge.learning}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {project.techStack && Object.keys(project.techStack).length > 0 && (
        <TechnologySection technologies={project.techStack} />
      )}

      {project.metrics && (
        <div>
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

      {project.skillsGained && Array.isArray(project.skillsGained) && project.skillsGained.length > 0 && (
        <div>
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

      <ProjectMediaSection
        media={project.media}
        projectTitle={project.title}
        embedded
      />

      {project.duration && (
        <div>
          <p className="text-body text-sm">
            <span className="font-semibold text-head">Duration: </span>
            {project.duration.durationText || 'N/A'}
            {(project.duration.working === true ||
              String(project.duration.working).toLowerCase() === 'true') && (
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

export default ProjectExpandedBody
