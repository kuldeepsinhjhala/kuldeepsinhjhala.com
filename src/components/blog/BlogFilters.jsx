import { useMemo } from 'react'

/**
 * BlogFilters - Reusable component for filtering blog posts by category and tags
 * Can be used in Blog section, Projects section, etc.
 */
function BlogFilters({
  categories = [],
  tags = [],
  selectedCategory = '',
  selectedTags = [],
  onCategoryChange,
  onTagChange,
  enableCategories = true,
  enableTags = true,
  className = '',
}) {
  // Get category label
  const getCategoryLabel = (categoryId) => {
    if (!categories || categories.length === 0) return categoryId
    const category = categories.find(cat => cat.id === categoryId)
    return category?.label || categoryId
  }

  // Handle category selection
  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId === selectedCategory ? '' : categoryId)
    }
  }

  // Handle tag selection
  const handleTagClick = (tag) => {
    if (!onTagChange) return
    
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    onTagChange(newSelectedTags)
  }

  // Show "All" category option
  const allCategories = useMemo(() => {
    if (!enableCategories || !categories || categories.length === 0) return []
    return [{ id: 'all', label: 'All Posts' }, ...categories]
  }, [categories, enableCategories])

  if (!enableCategories && !enableTags) return null

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Category Filters */}
      {enableCategories && allCategories.length > 0 && (
        <div>
          <h3 className="text-head text-sm font-semibold mb-3">Categories</h3>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((category) => {
              const isActive = category.id === 'all' 
                ? !selectedCategory 
                : category.id === selectedCategory
              
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id === 'all' ? '' : category.id)}
                  className={`
                    px-4 py-2 rounded transition-all duration-200 text-sm font-medium backdrop-blur-sm
                    ${isActive
                      ? 'bg-gold text-bg border border-gold shadow-lg'
                      : 'bg-card/90 backdrop-blur-sm text-body border border-gold/20 hover:border-gold hover:text-head shadow-md'
                    }
                  `}
                  style={!isActive ? {
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
                  } : {}}
                >
                  {category.label || category.id}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Tag Filters */}
      {enableTags && tags && tags.length > 0 && (
        <div>
          <h3 className="text-head text-sm font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => {
              const isSelected = selectedTags.includes(tag)
              
              return (
                <button
                  key={index}
                  onClick={() => handleTagClick(tag)}
                  className={`
                    px-3 py-1.5 rounded transition-all duration-200 text-xs font-medium backdrop-blur-sm
                    ${isSelected
                      ? 'bg-gold/20 text-gold border border-gold shadow-md'
                      : 'bg-card/90 backdrop-blur-sm text-body border border-gold/10 hover:border-gold/30 hover:text-head shadow-sm'
                    }
                  `}
                  style={!isSelected ? {
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.15), 0 0 5px rgba(201, 166, 107, 0.03)'
                  } : {}}
                >
                  #{tag}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {(selectedCategory || (selectedTags && selectedTags.length > 0)) && (
        <div className="flex items-center gap-2 pt-2 border-t border-gold/10">
          <span className="text-body text-xs">Active filters:</span>
          {selectedCategory && (
            <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded">
              {getCategoryLabel(selectedCategory)}
            </span>
          )}
          {selectedTags && selectedTags.length > 0 && (
            <span className="px-2 py-1 bg-gold/20 text-gold text-xs rounded">
              {selectedTags.length} tag{selectedTags.length > 1 ? 's' : ''}
            </span>
          )}
          <button
            onClick={() => {
              if (onCategoryChange) onCategoryChange('')
              if (onTagChange) onTagChange([])
            }}
            className="text-body hover:text-head text-xs underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}

export default BlogFilters

