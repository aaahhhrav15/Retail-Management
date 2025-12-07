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
    ageRange: '',
    productCategory: '',
    tags: '',
    paymentMethod: '',
    date: '',
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
      
      // Build search filters
      const searchFilters = { ...filters }
      
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
      const [statsResponse, transactionsResponse] = await Promise.all([
        apiService.getStatistics(),
        apiService.searchTransactions(
          searchFilters,
          pagination.page,
          pagination.limit
        )
      ])

      setStatistics(statsResponse.data)
      setTransactions(transactionsResponse.data || [])
      setPagination(prev => ({
        ...prev,
        total: transactionsResponse.total || 0,
        totalPages: transactionsResponse.totalPages || 6
      }))
    } catch (error) {
      console.error('Error loading data:', error)
      // Set some default data if API fails
      setStatistics({
        totalQuantity: 10,
        totalRevenue: 89000,
        totalAmount: 104000,
        totalTransactions: 19
      })
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
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }))
    }
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