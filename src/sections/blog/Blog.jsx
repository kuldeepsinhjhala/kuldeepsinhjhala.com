import { useState, useEffect, useMemo } from 'react'
import BlogCard from '../../components/blog/BlogCard'
import BlogFilters from '../../components/blog/BlogFilters'
import BlogSearch from '../../components/blog/BlogSearch'
import BlogPagination from '../../components/blog/BlogPagination'
import blogData from '../../data/blog.json'

function Blog() {
  // State management
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('published')
  const [sortOrder, setSortOrder] = useState('desc')

  // Load data (in real app, this would be an API call)
  useEffect(() => {
    try {
      // Simulate loading delay for better UX
      setTimeout(() => {
        setData(blogData)
        setLoading(false)
      }, 100)
    } catch (error) {
      console.error('Error loading blog data:', error)
      setLoading(false)
    }
  }, [])

  // Get settings with fallbacks
  const settings = useMemo(() => {
    if (!data?.settings) {
      return {
        enableSearch: true,
        enableCategories: true,
        enableTags: true,
        enableFeaturedPosts: true,
        enablePagination: true,
        postsPerPage: 6,
        sorting: { default: 'published', order: 'desc' },
      }
    }
    return data.settings
  }, [data])

  // Initialize sorting from settings
  useEffect(() => {
    if (settings.sorting) {
      setSortBy(settings.sorting.default || 'published')
      setSortOrder(settings.sorting.order || 'desc')
    }
  }, [settings])

  // Get authors map
  const authorsMap = useMemo(() => {
    if (!data?.authors || !Array.isArray(data.authors)) return {}
    return data.authors.reduce((acc, author) => {
      if (author?.id) {
        acc[author.id] = author
      }
      return acc
    }, {})
  }, [data])

  // Get default author
  const defaultAuthor = useMemo(() => {
    if (!data?.settings?.defaultAuthorId) return null
    return authorsMap[data.settings.defaultAuthorId] || null
  }, [data, authorsMap])

  // Filter and search posts
  const filteredPosts = useMemo(() => {
    if (!data?.posts || !Array.isArray(data.posts)) return []

    let posts = [...data.posts]

    // Filter by showInList
    posts = posts.filter(post => {
      if (post?.navigation?.showInList === false) return false
      return true
    })

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase()
      posts = posts.filter(post => {
        // Only search posts that allow search
        if (post?.navigation?.showInSearch === false) return false
        
        const title = post?.content?.title?.toLowerCase() || ''
        const excerpt = post?.content?.excerpt?.toLowerCase() || ''
        const body = post?.content?.body?.toLowerCase() || ''
        const tags = (post?.taxonomy?.tags || []).join(' ').toLowerCase()
        
        return title.includes(term) || 
               excerpt.includes(term) || 
               body.includes(term) || 
               tags.includes(term)
      })
    }

    // Filter by category
    if (selectedCategory) {
      posts = posts.filter(post => {
        return post?.taxonomy?.category === selectedCategory
      })
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      posts = posts.filter(post => {
        const postTags = post?.taxonomy?.tags || []
        return selectedTags.some(tag => postTags.includes(tag))
      })
    }

    // Sort posts
    posts.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'published':
          aValue = a?.dates?.published || ''
          bValue = b?.dates?.published || ''
          break
        case 'updated':
          aValue = a?.dates?.updated || a?.dates?.published || ''
          bValue = b?.dates?.updated || b?.dates?.published || ''
          break
        case 'title':
          aValue = a?.content?.title || ''
          bValue = b?.content?.title || ''
          break
        default:
          aValue = a?.dates?.published || ''
          bValue = b?.dates?.published || ''
      }

      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue)
      } else {
        return bValue.localeCompare(aValue)
      }
    })

    // Handle pinned posts (always show first)
    const pinnedPosts = posts.filter(post => post?.status?.pinned)
    const nonPinnedPosts = posts.filter(post => !post?.status?.pinned)
    
    return [...pinnedPosts, ...nonPinnedPosts]
  }, [data, searchTerm, selectedCategory, selectedTags, sortBy, sortOrder])

  // Paginate posts
  const paginatedPosts = useMemo(() => {
    if (!settings.enablePagination) return filteredPosts

    const postsPerPage = settings.postsPerPage || 6
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage

    return filteredPosts.slice(startIndex, endIndex)
  }, [filteredPosts, settings, currentPage])

  // Calculate total pages
  const totalPages = useMemo(() => {
    if (!settings.enablePagination) return 1
    const postsPerPage = settings.postsPerPage || 6
    return Math.ceil(filteredPosts.length / postsPerPage)
  }, [filteredPosts.length, settings])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory, selectedTags])

  // Get categories and tags from data
  const categories = useMemo(() => {
    if (!data?.categories || !Array.isArray(data.categories)) return []
    return data.categories
  }, [data])

  const tags = useMemo(() => {
    if (!data?.tags || !Array.isArray(data.tags)) return []
    return data.tags
  }, [data])

  // Handle post click (can be extended for navigation)
  const handlePostClick = (slugOrId) => {
    // TODO: Navigate to blog post detail page
    console.log('Navigate to post:', slugOrId)
  }

  // Loading state
  if (loading) {
    return (
      <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
            <p className="text-body">Loading blog posts...</p>
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
            <h1 className="text-head text-3xl font-bold mb-4">Blog</h1>
            <p className="text-body">No blog data available.</p>
          </div>
        </div>
      </div>
    )
  }

  // Get meta information
  const meta = data.meta || {}
  const title = meta.title || 'Blog'
  const subtitle = meta.subtitle || ''

  return (
    <div className="bg-dotted min-h-screen p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-head text-4xl md:text-5xl font-bold mb-2">
            {title}
          </h1>
          {subtitle && (
            <p className="text-body text-lg md:text-xl">
              {subtitle}
            </p>
          )}
        </header>

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Search */}
          {settings.enableSearch && (
            <BlogSearch
              onSearch={setSearchTerm}
              placeholder="Search posts by title, content, or tags..."
              className="w-full"
            />
          )}

          {/* Filters and Sort */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Filters */}
            <div className="lg:col-span-1">
              {(settings.enableCategories || settings.enableTags) && (
                <div 
                  className="bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 md:p-6 shadow-lg"
                  style={{
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                  }}
                >
                  <BlogFilters
                    categories={categories}
                    tags={tags}
                    selectedCategory={selectedCategory}
                    selectedTags={selectedTags}
                    onCategoryChange={setSelectedCategory}
                    onTagChange={setSelectedTags}
                    enableCategories={settings.enableCategories}
                    enableTags={settings.enableTags}
                  />
                </div>
              )}

              {/* Sort Options */}
              <div 
                className="mt-4 bg-card/90 backdrop-blur-sm border border-gold/20 rounded-lg p-4 shadow-lg"
                style={{
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(201, 166, 107, 0.05)'
                }}
              >
                <h3 className="text-head text-sm font-semibold mb-3">Sort By</h3>
                <div className="space-y-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
                    style={{
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                    }}
                  >
                    <option value="published">Published Date</option>
                    <option value="updated">Updated Date</option>
                    <option value="title">Title</option>
                  </select>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head text-sm focus:outline-none focus:border-gold shadow-md"
                    style={{
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                    }}
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              {/* Results Count */}
              <div className="mb-6 flex items-center justify-between">
                <p className="text-body text-sm">
                  Showing {paginatedPosts.length} of {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''}
                  {searchTerm && (
                    <span className="ml-2">
                      for "<span className="text-head font-medium">{searchTerm}</span>"
                    </span>
                  )}
                </p>
              </div>

              {/* Posts Grid */}
              {paginatedPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedPosts.map((post) => {
                    const authorId = post?.authorId || data?.settings?.defaultAuthorId
                    const author = authorId ? authorsMap[authorId] : defaultAuthor

                    return (
                      <BlogCard
                        key={post.id || Math.random()}
                        post={post}
                        author={author}
                        onClick={handlePostClick}
                      />
                    )
                  })}
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
                  <h3 className="text-head text-xl font-semibold mb-2">No posts found</h3>
                  <p className="text-body">
                    {searchTerm || selectedCategory || selectedTags.length > 0
                      ? 'Try adjusting your filters or search terms.'
                      : 'No blog posts available yet.'}
                  </p>
                  {(searchTerm || selectedCategory || selectedTags.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchTerm('')
                        setSelectedCategory('')
                        setSelectedTags([])
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

              {/* Pagination */}
              {settings.enablePagination && totalPages > 1 && (
                <div className="mt-8">
                  <BlogPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog
