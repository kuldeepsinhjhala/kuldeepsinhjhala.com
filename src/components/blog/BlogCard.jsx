import { useMemo } from 'react'

/**
 * BlogCard - Reusable component for displaying blog post cards
 * Layout slots are fixed so title, tags, name, date, read time, and level
 * stay in the same place on every card.
 */
function BlogCard({ post, author, onClick, className = '' }) {
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
      readTime: post?.reading?.readTimeMinutes || 0,
      difficulty: post?.reading?.difficulty || '',
      category: post?.taxonomy?.category || '',
      tags: post?.taxonomy?.tags || [],
      featured: post?.status?.featured || false,
      pinned: post?.status?.pinned || false,
    }
  }, [post])

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
        day: 'numeric',
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
  const visibleTags = postData.tags.slice(0, 3)
  const extraTagCount = Math.max(0, postData.tags.length - 3)

  return (
    <article
      className={`
        group relative flex h-full flex-col overflow-hidden rounded-lg
        bg-card/90 backdrop-blur-sm border border-gold/20
        hover:border-gold hover:ring-1 hover:ring-gold/50
        transition-all duration-300 cursor-pointer shadow-lg
        ${postData.featured ? 'ring-2 ring-gold/30' : ''}
        ${className}
      `}
      style={{
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(87, 6, 140, 0.05)',
      }}
      onClick={handleClick}
    >
      {(postData.featured || postData.pinned) && (
        <div className="absolute top-2 right-2 z-10 flex gap-1.5">
          {postData.pinned && (
            <span className="px-1.5 py-0.5 bg-gold/20 backdrop-blur-sm text-gold text-[10px] font-medium rounded border border-gold/30 shadow-sm">
              Pinned
            </span>
          )}
          {postData.featured && (
            <span className="px-1.5 py-0.5 bg-success/20 backdrop-blur-sm text-success text-[10px] font-medium rounded border border-success/30 shadow-sm">
              Featured
            </span>
          )}
        </div>
      )}

      <div className="relative h-32 w-full shrink-0 overflow-hidden bg-card">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={imageAlt}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
      </div>

      <div className="grid flex-1 grid-rows-[1.25rem_2.5rem_2rem_1.5rem_1fr_2.75rem] gap-y-1.5 p-4">
        <div className="flex h-5 items-center">
          {postData.category ? (
            <span className="inline-block truncate px-1.5 py-0.5 bg-gold/20 backdrop-blur-sm text-gold text-[10px] font-medium rounded border border-gold/30 shadow-sm">
              {postData.category}
            </span>
          ) : (
            <span className="invisible text-[10px]">category</span>
          )}
        </div>

        <h3 className="h-10 overflow-hidden text-base font-bold leading-5 text-head line-clamp-2 group-hover:text-gold transition-colors">
          {postData.title}
        </h3>

        <p className="h-8 overflow-hidden text-xs leading-4 text-body line-clamp-2">
          {postData.excerpt || '\u00a0'}
        </p>

        <div className="flex h-6 items-center gap-1.5 overflow-hidden">
          {visibleTags.map((tag) => (
            <span
              key={tag}
              className="shrink-0 px-1.5 py-0.5 bg-card/90 backdrop-blur-sm text-body text-[10px] rounded border border-gold/10 shadow-sm"
            >
              #{tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="shrink-0 px-1.5 py-0.5 text-body text-[10px]">
              +{extraTagCount} more
            </span>
          )}
        </div>

        <div aria-hidden="true" />

        <div className="flex h-11 items-center justify-between gap-2 border-t border-gold/10">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gold/15 text-[10px] font-semibold text-gold">
              {authorInfo.avatar ? (
                <img
                  src={authorInfo.avatar}
                  alt={authorInfo.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              ) : (
                authorInfo.name.charAt(0)
              )}
            </div>
            <div className="min-w-0">
              <p className="h-4 truncate text-[11px] font-medium leading-4 text-head">
                {authorInfo.name}
              </p>
              <p className="h-4 text-[11px] leading-4 text-body">
                {formatDate(postData.publishedDate) || '\u00a0'}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 text-[11px]">
            <span className="w-[4.75rem] text-right text-body">
              {postData.readTime > 0 ? `${postData.readTime} min read` : '\u00a0'}
            </span>
            <span
              className={`w-[5.5rem] truncate text-right font-medium capitalize ${getDifficultyColor(postData.difficulty)}`}
            >
              {postData.difficulty || '\u00a0'}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default BlogCard
