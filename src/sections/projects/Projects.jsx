import { useState, useEffect, useMemo } from 'react'
import projectData from '../../data/project.json'
import ProjectCard from '../../components/projects/ProjectCard'

const INITIAL_VISIBLE_COUNT = 3

function Projects() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showAllProjects, setShowAllProjects] = useState(false)

  // Load data
  useEffect(() => {
    try {
      setTimeout(() => {
        setData(projectData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading project data:', error)
      setLoading(false)
    }
  }, [])

  // Get data with fallbacks
  const meta = useMemo(() => data?.meta || {}, [data])
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

  const visibleProjects = useMemo(() => {
    if (showAllProjects || projects.length <= INITIAL_VISIBLE_COUNT) return projects
    return projects.slice(0, INITIAL_VISIBLE_COUNT)
  }, [projects, showAllProjects])

  const hasMoreProjects = projects.length > INITIAL_VISIBLE_COUNT

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
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
      <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="section-heading-highlight text-head text-3xl font-bold mb-4">Projects</h2>
            <p className="text-body">No project data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted px-4 pb-2 pt-0 md:px-8 md:pb-4 md:pt-0 lg:px-12 lg:pb-6 lg:pt-0">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12 text-center">
          {meta.title && (
            <h2 className="section-heading-highlight text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h2>
          )}
        </header>

        {projects.length > 0 ? (
          <section className="space-y-8 md:space-y-12">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {hasMoreProjects && (
              <div className="flex justify-center mt-4 md:mt-5">
                <button
                  type="button"
                  onClick={() => setShowAllProjects((v) => !v)}
                  className="px-6 py-2.5 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium rounded-lg border border-gold/20 hover:border-gold transition-all duration-200"
                >
                  {showAllProjects ? 'Show less' : 'Show more'}
                </button>
              </div>
            )}
          </section>
        ) : (
          <div
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)',
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
