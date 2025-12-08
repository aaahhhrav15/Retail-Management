import { useState, useEffect, useCallback, useRef } from 'react'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import SummaryCards from '../components/SummaryCards'
import Filters from '../components/Filters'
import TransactionsTable from '../components/TransactionsTable'
import Pagination from '../components/Pagination'
import { apiService } from '../services/api.service'

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const debounceTimerRef = useRef(null)
  const [filters, setFilters] = useState({
    customerRegion: [], // Array of selected regions
    gender: '',
    ageFilter: null, // { min, max } or null
    productCategory: [], // Array of selected categories
    tags: [], // Array of selected tags
    paymentMethod: [], // Array of selected payment methods
    dateFilter: null, // { preset, from, to } or null
    sortBy: 'customerName',
    sortOrder: 'asc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 6
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null) // Clear any previous errors
      
      // Build search filters for API - only include filters that have values
      const searchFilters = {}
      
      // Only add filters if they have actual values
      if (Array.isArray(filters.customerRegion) && filters.customerRegion.length > 0) {
        searchFilters.customerRegion = filters.customerRegion
      }
      if (filters.gender) {
        searchFilters.gender = filters.gender
      }
      if (Array.isArray(filters.productCategory) && filters.productCategory.length > 0) {
        searchFilters.productCategory = filters.productCategory
      }
      if (Array.isArray(filters.tags) && filters.tags.length > 0) {
        searchFilters.tags = filters.tags
      }
      if (Array.isArray(filters.paymentMethod) && filters.paymentMethod.length > 0) {
        searchFilters.paymentMethod = filters.paymentMethod
      }
      
      // Always include sort parameters (defaults if not set)
      searchFilters.sortBy = filters.sortBy || 'customerName'
      searchFilters.sortOrder = filters.sortOrder || 'asc'
      
      // Handle age filter - convert to backend format
      if (filters.ageFilter && (filters.ageFilter.min !== null || filters.ageFilter.max !== null)) {
        const { min, max } = filters.ageFilter
        if (min !== null && max !== null) {
          searchFilters.ageRange = `${min}-${max}`
        } else if (min !== null) {
          searchFilters.ageRange = `${min}+`
        } else if (max !== null) {
          searchFilters.ageRange = `0-${max}`
        }
      }
      
      // Handle date filter - convert to backend format
      if (filters.dateFilter && filters.dateFilter.preset) {
        const { preset, from, to } = filters.dateFilter
        if (preset === 'custom') {
          if (from) searchFilters.dateFrom = from
          if (to) searchFilters.dateTo = to
        } else if (preset === 'today') {
          searchFilters.date = from
        } else if (preset === 'last7days' || preset === 'last30days' || preset === 'thisMonth') {
          if (from) searchFilters.dateFrom = from
          if (to) searchFilters.dateTo = to
        }
      }
      
      // Handle search query (use debounced version)
      // Search both customerName and phoneNumber simultaneously for better results
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.trim()
        // Clean phone number (remove non-digits) for phone search
        const cleanedPhone = query.replace(/\D/g, '')
        
        // If query contains only digits, prioritize phone search but also search name
        // This allows finding customers by phone even if they have numbers in their name
        if (cleanedPhone.length > 0) {
          searchFilters.phoneNumber = cleanedPhone
        }
        
        // Always search customerName for text queries (case-insensitive search handled by backend)
        // This allows finding customers by name even if query contains numbers
        if (query.length > 0) {
          searchFilters.customerName = query
        }
      }

      // Make API calls in parallel for better performance
      // Pass same filters to statistics so it shows filtered stats
      const [statsResponse, transactionsResponse] = await Promise.all([
        apiService.getStatistics(searchFilters),
        apiService.searchTransactions(
          searchFilters,
          pagination.page,
          pagination.limit
        )
      ])

      // Only update statistics if we got valid data with actual values
      if (statsResponse && statsResponse.data) {
        const statsData = statsResponse.data
        // Validate that we have meaningful statistics data before updating
        // This prevents setting statistics to null or empty objects
        if (statsData && typeof statsData === 'object' && (
          statsData.totalQuantity !== undefined ||
          statsData.totalRevenue !== undefined ||
          statsData.totalAmount !== undefined ||
          statsData.totalTransactions !== undefined
        )) {
          setStatistics(statsData)
        }
      }
      // Handle no search results
      if (!transactionsResponse.success) {
        // API returned an error
        setTransactions([])
        setPagination(prev => ({
          ...prev,
          total: 0,
          totalPages: 0
        }))
        // Show error message if available
        const errorMessage = transactionsResponse.message || 'An error occurred while loading transactions.'
        setError(errorMessage)
        console.error('API Error:', errorMessage)
      } else {
        // Ensure we always set transactions, even if empty array
        setTransactions(transactionsResponse.data || [])
        setPagination(prev => ({
          ...prev,
          total: transactionsResponse.total || 0,
          totalPages: transactionsResponse.totalPages || 0
        }))
        
        // Reset to page 1 if current page is beyond available pages
        if (transactionsResponse.totalPages > 0 && pagination.page > transactionsResponse.totalPages) {
          setPagination(prev => ({ ...prev, page: 1 }))
        }
      }
    } catch (error) {
      console.error('Error loading data:', error)
      // Handle network errors or other exceptions
      setTransactions([])
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0
      }))
      
      // Show user-friendly error message
      let errorMessage = 'An error occurred while loading data. Please try again.'
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [filters, debouncedSearchQuery, pagination.page, pagination.limit])

  // Debounce search query - wait 300ms after user stops typing
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 300)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [searchQuery])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Reset page to 1 when filters or debounced search change
  useEffect(() => {
    setPagination(prev => {
      if (prev.page !== 1) {
        return { ...prev, page: 1 }
      }
      return prev
    })
  }, [filters, debouncedSearchQuery])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const handleRefresh = () => {
    loadData()
  }

  return (
    <div className="flex min-h-screen bg-[#f8f9fa]">
      <Sidebar />
      <div className="flex-1 ml-[220px] flex flex-col">
        <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <div className="p-6 flex-1">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-800">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800"
                  aria-label="Dismiss error"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />
          <SummaryCards statistics={statistics} loading={loading} />
          <TransactionsTable transactions={transactions} loading={loading} />
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard