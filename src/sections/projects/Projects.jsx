import { useState, useEffect, useMemo } from 'react'
import projectData from '../../data/project.json'
import ProjectCard from '../../components/projects/ProjectCard'
import ProjectFilters from '../../components/projects/ProjectFilters'
import BlogSearch from '../../components/blog/BlogSearch'

function Projects() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

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
    return data.projects
  }, [data])
  const categories = useMemo(() => {
    if (!data?.categories || !Array.isArray(data.categories)) return []
    return data.categories
  }, [data])

  // Filter projects
  const filteredProjects = useMemo(() => {
    let filtered = [...projects]

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(project => {
        const title = project?.title?.toLowerCase() || ''
        const shortDesc = project?.shortDescription?.toLowerCase() || ''
        const longDesc = project?.longDescription?.toLowerCase() || ''
        const tags = (project?.tags || []).join(' ').toLowerCase()
        const skills = (project?.skillsGained || []).join(' ').toLowerCase()
        
        return title.includes(term) || 
               shortDesc.includes(term) || 
               longDesc.includes(term) ||
               tags.includes(term) ||
               skills.includes(term)
      })
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(project => {
        return project?.category === selectedCategory
      })
    }

    // Filter by type
    if (selectedType) {
      filtered = filtered.filter(project => {
        return project?.type === selectedType
      })
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(project => {
        return project?.status === selectedStatus
      })
    }

    return filtered
  }, [projects, searchTerm, selectedCategory, selectedType, selectedStatus])

  // Get unique types and statuses
  const types = useMemo(() => {
    const uniqueTypes = new Set()
    projects.forEach(project => {
      if (project?.type) uniqueTypes.add(project.type)
    })
    return Array.from(uniqueTypes)
  }, [projects])

  const statuses = useMemo(() => {
    const uniqueStatuses = new Set()
    projects.forEach(project => {
      if (project?.status) uniqueStatuses.add(project.status)
    })
    return Array.from(uniqueStatuses)
  }, [projects])

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
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
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-head text-3xl font-bold mb-4">Projects</h1>
            <p className="text-body">No project data available.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          {meta.title && (
            <h1 className="text-head text-4xl md:text-5xl font-bold mb-2">
              {meta.title}
            </h1>
          )}
          {meta.subtitle && (
            <p className="text-body text-lg md:text-xl">
              {meta.subtitle}
            </p>
          )}
        </header>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          <BlogSearch
            onSearch={setSearchTerm}
            placeholder="Search projects by title, description, tags, or skills..."
            className="w-full"
          />

          {/* Filters */}
          <div 
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-6 shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
            }}
          >
            <ProjectFilters
              categories={categories}
              types={types}
              statuses={statuses}
              selectedCategory={selectedCategory}
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              onCategoryChange={setSelectedCategory}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-body text-sm">
            Showing {filteredProjects.length} of {projects.length} project{projects.length !== 1 ? 's' : ''}
            {searchTerm && (
              <span className="ml-2">
                for "<span className="text-head font-medium">{searchTerm}</span>"
              </span>
            )}
          </p>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id || Math.random()}
                project={project}
              />
            ))}
          </div>
        ) : (
          <div 
            className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-12 text-center shadow-lg"
            style={{
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
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
            <p className="text-body">
              {searchTerm || selectedCategory || selectedType || selectedStatus
                ? 'Try adjusting your filters or search terms.'
                : 'No projects available yet.'}
            </p>
            {(searchTerm || selectedCategory || selectedType || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('')
                  setSelectedType('')
                  setSelectedStatus('')
                }}
                className="mt-4 px-4 py-2 bg-gold/20 backdrop-blur-sm text-gold rounded border border-gold/30 hover:bg-gold/30 transition-colors shadow-md"
                style={{
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                }}
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Projects
