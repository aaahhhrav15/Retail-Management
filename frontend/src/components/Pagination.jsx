const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    // Don't show pagination if there are no pages or only one page
    if (totalPages <= 1) {
      return null
    }

    const handlePrevious = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1)
      }
    }

    const handleNext = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1)
      }
    }

    const getPageNumbers = () => {
      const pages = []
      const delta = 1 // Number of pages to show on each side of current page
      
      // Always show first page
      if (currentPage > delta + 2) {
        pages.push(1)
        if (currentPage > delta + 3) {
          pages.push('ellipsis-start')
        }
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - delta)
      const end = Math.min(totalPages - 1, currentPage + delta)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      // Always show last page
      if (currentPage < totalPages - delta - 1) {
        if (currentPage < totalPages - delta - 2) {
          pages.push('ellipsis-end')
        }
        pages.push(totalPages)
      }

      // Handle edge cases where first/last page should be in the middle section
      if (totalPages <= 5) {
        // For 5 or fewer pages, show all
        return Array.from({ length: totalPages }, (_, i) => i + 1)
      }

      // Ensure first page is shown
      if (pages[0] !== 1 && currentPage <= delta + 2) {
        pages.unshift(1)
      }

      // Ensure last page is shown
      if (pages[pages.length - 1] !== totalPages && currentPage >= totalPages - delta - 1) {
        pages.push(totalPages)
      }

      return pages
    }

    const pages = getPageNumbers()
    const isFirstPage = currentPage === 1
    const isLastPage = currentPage === totalPages

    return (
      <div className="flex justify-center items-center gap-1 mt-6 py-4">
        {/* Previous Button */}
        <button
          onClick={handlePrevious}
          disabled={isFirstPage}
          className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-all flex items-center justify-center ${
            isFirstPage
              ? 'text-[#d1d5db] cursor-not-allowed'
              : 'text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer'
          }`}
          aria-label="Previous page"
        >
          <svg 
            className="w-4 h-4" 
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
        {pages.map((page, index) => {
          if (page === 'ellipsis-start' || page === 'ellipsis-end') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="min-w-[32px] h-8 px-2 flex items-center justify-center text-[#6b7280] text-sm"
              >
                ...
              </span>
            )
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-[#1a1a1a] text-white'
                  : 'text-[#6b7280] hover:bg-[#f3f4f6]'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={isLastPage}
          className={`min-w-[32px] h-8 px-2 rounded text-sm font-medium transition-all flex items-center justify-center ${
            isLastPage
              ? 'text-[#d1d5db] cursor-not-allowed'
              : 'text-[#6b7280] hover:bg-[#f3f4f6] cursor-pointer'
          }`}
          aria-label="Next page"
        >
          <svg 
            className="w-4 h-4" 
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
  
  export default Pagination