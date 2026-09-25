import { useState, useEffect, useMemo } from 'react'
import projectData from '../../data/project.json'
import ProjectCard from '../../components/projects/ProjectCard'

function Projects() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load data
  useEffect(() => {
    try {
      setData(projectData)
      setLoading(false)
    } catch (error) {
      console.error('Error loading project data:', error)
      setLoading(false)
    }
  }, [projectData])

  // Get data with fallbacks
  const projects = useMemo(() => {
    if (!data?.projects || !Array.isArray(data.projects)) return []
    const list = [...data.projects]
    list.sort((a, b) => {
      const sa = typeof a.sequence === 'number' ? a.sequence : Number.NEGATIVE_INFINITY
      const sb = typeof b.sequence === 'number' ? b.sequence : Number.NEGATIVE_INFINITY
      if (sa !== sb) return sb - sa
      return 0
    })
    return list
  }, [data])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  // No data state
  if (!data) {
    return (
      <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
        <div className="site-shell">
          <div className="text-center py-12">
            <p className="text-body">No project data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted pb-2 pt-8 md:pb-4 md:pt-10 lg:pb-6 lg:pt-12">
      <div className="site-shell">
        {projects.length > 0 ? (
          <section className="space-y-8 md:space-y-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </section>
        ) : (
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(87, 6, 140, 0.05)',
            }}
          >
            <svg
              className="w-16 h-16 text-body/50 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-head text-xl font-semibold mb-2">No projects found</h3>
            <p className="text-body">No projects available yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
