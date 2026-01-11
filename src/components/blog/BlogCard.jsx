import { useMemo } from 'react'

/**
 * BlogCard - Reusable component for displaying blog post cards
 * Can be used in Blog section, Featured posts, Related posts, etc.
 */
function BlogCard({ post, author, onClick, className = '' }) {
  // Safely get post data with fallbacks
  const postData = useMemo(() => {
    if (!post) return null
    
    return {
      id: post.id || '',
      title: post?.content?.title || 'Untitled',
      slug: post?.content?.slug || '',
      excerpt: post?.content?.excerpt || '',
      coverImage: post?.media?.coverImage || null,
      thumbnail: post?.media?.thumbnail || null,
      publishedDate: post?.dates?.published || '',
      updatedDate: post?.dates?.updated || '',
      readTime: post?.reading?.readTimeMinutes || 0,
      difficulty: post?.reading?.difficulty || 'beginner',
      category: post?.taxonomy?.category || '',
      tags: post?.taxonomy?.tags || [],
      featured: post?.status?.featured || false,
      pinned: post?.status?.pinned || false,
    }
  }, [post])

  // Get author info with fallback
  const authorInfo = useMemo(() => {
    if (!author) {
      return {
        name: 'Unknown Author',
        avatar: null,
      }
    }
    return {
      name: author.name || 'Unknown Author',
      avatar: author.avatar || null,
    }
  }, [author])

  if (!postData) return null

  const handleClick = () => {
    if (onClick) {
      onClick(postData.slug || postData.id)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch {
      return dateString
    }
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      beginner: 'text-success',
      intermediate: 'text-gold',
      advanced: 'text-error',
    }
    return colors[difficulty] || 'text-body'
  }

  const imageSrc = postData.coverImage?.src || postData.thumbnail || null
  const imageAlt = postData.coverImage?.alt || postData.title

  return (
    <article
      className={`
        group relative bg-card border border-gold/20 rounded-lg overflow-hidden
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-300 cursor-pointer
        ${postData.featured ? 'ring-2 ring-gold/30' : ''}
        ${postData.pinned ? 'border-l-4 border-l-gold' : ''}
        ${className}
      `}
      onClick={handleClick}
    >
      {/* Featured/Pinned Badge */}
      {(postData.featured || postData.pinned) && (
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          {postData.pinned && (
            <span className="px-2 py-1 bg-gold/20 text-gold text-xs font-medium rounded">
              Pinned
            </span>
          )}
          {postData.featured && (
            <span className="px-2 py-1 bg-success/20 text-success text-xs font-medium rounded">
              Featured
            </span>
          )}
        </div>
      )}

      {/* Cover Image */}
      {imageSrc && (
        <div className="relative w-full h-48 overflow-hidden bg-card">
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {postData.category && (
          <div className="mb-2">
            <span className="inline-block px-2 py-1 bg-gold/10 text-gold text-xs font-medium rounded">
              {postData.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-head text-xl font-bold mb-2 group-hover:text-gold transition-colors line-clamp-2">
          {postData.title}
        </h3>

        {/* Excerpt */}
        {postData.excerpt && (
          <p className="text-body text-sm mb-4 line-clamp-3">
            {postData.excerpt}
          </p>
        )}

        {/* Tags */}
        {postData.tags && postData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {postData.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-bg text-body text-xs rounded border border-gold/10"
              >
                #{tag}
              </span>
            ))}
            {postData.tags.length > 3 && (
              <span className="px-2 py-1 text-body text-xs">
                +{postData.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gold/10">
          {/* Author */}
          <div className="flex items-center gap-2">
            {authorInfo.avatar && (
              <img
                src={authorInfo.avatar}
                alt={authorInfo.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}
            <div>
              <p className="text-head text-xs font-medium">{authorInfo.name}</p>
              {postData.publishedDate && (
                <p className="text-body text-xs">
                  {formatDate(postData.publishedDate)}
                </p>
              )}
            </div>
          </div>

          {/* Reading Time & Difficulty */}
          <div className="flex items-center gap-3 text-xs">
            {postData.readTime > 0 && (
              <span className="text-body">
                {postData.readTime} min read
              </span>
            )}
            {postData.difficulty && (
              <span className={`font-medium ${getDifficultyColor(postData.difficulty)}`}>
                {postData.difficulty}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard

