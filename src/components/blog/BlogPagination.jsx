/**
 * BlogPagination - Reusable pagination component
 * Can be used in Blog section, Projects section, etc.
 */
function BlogPagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '',
}) {
  if (!totalPages || totalPages <= 1) return null

  const handlePageClick = (page) => {
    if (onPageChange && page >= 1 && page <= totalPages) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push(1)
        pages.push('ellipsis')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {/* Previous Button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-4 py-2 rounded border transition-all duration-200 backdrop-blur-sm shadow-md
          ${currentPage === 1
            ? 'bg-card/70 backdrop-blur-sm border-gold/10 text-body/50 cursor-not-allowed'
            : 'bg-card/90 backdrop-blur-sm border-gold/20 text-head hover:border-gold hover:bg-gold/10'
          }
        `}
        style={currentPage !== 1 ? {
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
        } : {}}
        aria-label="Previous page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {pageNumbers.map((page, index) => {
          if (page === 'ellipsis') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-body"
              >
                ...
              </span>
            )
          }

          const isActive = page === currentPage

          return (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={`
                min-w-[40px] px-3 py-2 rounded border transition-all duration-200 text-sm font-medium backdrop-blur-sm shadow-md
                ${isActive
                  ? 'bg-gold text-bg border-gold shadow-lg'
                  : 'bg-card/90 backdrop-blur-sm border-gold/20 text-head hover:border-gold hover:bg-gold/10'
                }
              `}
              style={!isActive ? {
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
              } : {}}
              aria-label={`Go to page ${page}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-2 rounded border transition-all duration-200 backdrop-blur-sm shadow-md
          ${currentPage === totalPages
            ? 'bg-card/70 backdrop-blur-sm border-gold/10 text-body/50 cursor-not-allowed'
            : 'bg-card/90 backdrop-blur-sm border-gold/20 text-head hover:border-gold hover:bg-gold/10'
          }
        `}
        style={currentPage !== totalPages ? {
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(201, 166, 107, 0.05)'
        } : {}}
        aria-label="Next page"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  )
}

export default BlogPagination

