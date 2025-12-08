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
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const debounceTimerRef = useRef(null)
  const [filters, setFilters] = useState({
    customerRegion: '',
    gender: '',
    ageFilter: null, // { min, max } or null
    productCategory: '',
    tags: [], // Array of selected tags
    paymentMethod: '',
    dateFilter: null, // { preset, from, to } or null
    sortBy: 'customerName',
    sortOrder: 'asc'
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 6
  })

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      
      // Build search filters for API - only include filters that have values
      const searchFilters = {}
      
      // Only add filters if they have actual values
      if (filters.customerRegion) {
        searchFilters.customerRegion = filters.customerRegion
      }
      if (filters.gender) {
        searchFilters.gender = filters.gender
      }
      if (filters.productCategory) {
        searchFilters.productCategory = filters.productCategory
      }
      if (Array.isArray(filters.tags) && filters.tags.length > 0) {
        searchFilters.tags = filters.tags
      }
      if (filters.paymentMethod) {
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
      if (debouncedSearchQuery.trim()) {
        const query = debouncedSearchQuery.trim()
        if (/^\d+$/.test(query)) {
          searchFilters.phoneNumber = query
        } else {
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

      setStatistics(statsResponse.data)
      // Ensure we always set transactions, even if empty array
      setTransactions(transactionsResponse.data || [])
      setPagination(prev => ({
        ...prev,
        total: transactionsResponse.total || 0,
        totalPages: transactionsResponse.totalPages || 6
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      // Set empty statistics when API fails
      setStatistics({
        totalQuantity: 0,
        totalRevenue: 0,
        totalAmount: 0,
        totalTransactions: 0
      })
      // Don't clear transactions on error - keep existing data
      // setTransactions([])
      setPagination(prev => ({
        ...prev,
        total: 0,
        totalPages: 0
      }))
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
          <Filters
            filters={filters}
            onFilterChange={handleFilterChange}
            onRefresh={handleRefresh}
          />
          <SummaryCards statistics={statistics} />
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