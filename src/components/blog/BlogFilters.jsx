/**
 * BlogFilters - Compact category / tag / sort controls for the blog toolbar
 */
const controlClass =
  'h-9 min-w-[8.5rem] px-2.5 text-sm bg-card/90 backdrop-blur-sm border border-gold/20 rounded text-head focus:outline-none focus:border-gold cursor-pointer'

function BlogFilters({
  categories = [],
  tags = [],
  selectedCategory = '',
  selectedTags = [],
  onCategoryChange,
  onTagChange,
  enableCategories = true,
  enableTags = true,
  sortBy = 'published',
  sortOrder = 'desc',
  onSortChange,
  className = '',
}) {
  if (!enableCategories && !enableTags && !onSortChange) return null

  const handleCategoryChange = (event) => {
    onCategoryChange?.(event.target.value)
  }

  const handleTagChange = (event) => {
    const value = event.target.value
    onTagChange?.(value ? [value] : [])
  }

  const handleSortChange = (event) => {
    const [nextSortBy, nextSortOrder] = event.target.value.split(':')
    onSortChange?.(nextSortBy, nextSortOrder)
  }

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {enableCategories && categories.length > 0 && (
        <select
          aria-label="Categories"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={controlClass}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.label || category.id}
            </option>
          ))}
        </select>
      )}

      {enableTags && tags.length > 0 && (
        <select
          aria-label="Tags"
          value={selectedTags[0] || ''}
          onChange={handleTagChange}
          className={controlClass}
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              #{tag}
            </option>
          ))}
        </select>
      )}

      {onSortChange && (
        <select
          aria-label="Sort by"
          value={`${sortBy}:${sortOrder}`}
          onChange={handleSortChange}
          className={controlClass}
        >
          <option value="published:desc">Newest</option>
          <option value="published:asc">Oldest</option>
          <option value="updated:desc">Recently updated</option>
          <option value="title:asc">Title A–Z</option>
          <option value="title:desc">Title Z–A</option>
        </select>
      )}
    </div>
  )
}

export default BlogFilters
