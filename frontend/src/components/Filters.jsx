import { useState, useEffect, useRef } from 'react'
import { apiService } from '../services/api.service'
import AgeRangeFilter from './AgeRangeFilter'
import DateRangeFilter from './DateRangeFilter'

const Filters = ({ filters, onFilterChange, onRefresh }) => {
    const [filterOptions, setFilterOptions] = useState({
        productCategories: [],
        customerRegions: [],
        genders: [],
        paymentMethods: [],
        tags: []
    })
    const [loading, setLoading] = useState(true)
    const [tagsDropdownOpen, setTagsDropdownOpen] = useState(false)
    const [regionDropdownOpen, setRegionDropdownOpen] = useState(false)
    const [genderDropdownOpen, setGenderDropdownOpen] = useState(false)
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
    const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
    
    const tagsDropdownRef = useRef(null)
    const regionDropdownRef = useRef(null)
    const genderDropdownRef = useRef(null)
    const categoryDropdownRef = useRef(null)
    const paymentDropdownRef = useRef(null)
    const sortDropdownRef = useRef(null)

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const response = await apiService.getFilterOptions()
                setFilterOptions(response.data)
            } catch (error) {
                console.error('Error loading filter options:', error)
                // Fallback to default values
                setFilterOptions({
                    productCategories: ['Electronics', 'Clothing', 'Beauty', 'Home', 'Sports'],
                    customerRegions: ['East', 'West', 'North', 'South', 'Central'],
                    genders: ['Male', 'Female'],
                    paymentMethods: ['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Net Banking'],
                    tags: ['New', 'Sale', 'Featured', 'Popular']
                })
            } finally {
                setLoading(false)
            }
        }
        loadFilterOptions()
    }, [])

    const regions = filterOptions.customerRegions
    const genders = filterOptions.genders
    const categories = filterOptions.productCategories
    const tags = filterOptions.tags
    const paymentMethods = filterOptions.paymentMethods
    const sortOptions = [
      { value: 'customerName', label: 'Sort by: Customer Name (A-Z)' },
      { value: '-customerName', label: 'Sort by: Customer Name (Z-A)' },
      { value: 'date', label: 'Sort by: Date (Newest)' },
      { value: '-date', label: 'Sort by: Date (Oldest)' },
      { value: 'finalAmount', label: 'Sort by: Amount (High to Low)' },
      { value: '-finalAmount', label: 'Sort by: Amount (Low to High)' }
    ]

    // Handle age filter change
    const handleAgeFilterChange = (ageFilter) => {
      onFilterChange('ageFilter', ageFilter)
    }

    // Handle date filter change
    const handleDateFilterChange = (dateFilter) => {
      onFilterChange('dateFilter', dateFilter)
    }

    // Handle tags checkbox change
    const handleTagToggle = (tag) => {
      const currentTags = Array.isArray(filters.tags) ? filters.tags : (filters.tags ? [filters.tags] : [])
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag]
      onFilterChange('tags', newTags.length > 0 ? newTags : [])
    }

    // Close dropdowns when clicking outside
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (tagsDropdownRef.current && !tagsDropdownRef.current.contains(event.target)) {
          setTagsDropdownOpen(false)
        }
        if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target)) {
          setRegionDropdownOpen(false)
        }
        if (genderDropdownRef.current && !genderDropdownRef.current.contains(event.target)) {
          setGenderDropdownOpen(false)
        }
        if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
          setCategoryDropdownOpen(false)
        }
        if (paymentDropdownRef.current && !paymentDropdownRef.current.contains(event.target)) {
          setPaymentDropdownOpen(false)
        }
        if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
          setSortDropdownOpen(false)
        }
      }
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [])
  
    return (
      <div className="flex gap-2 mb-6 items-start flex-wrap">
        <button 
          className="p-2 border border-[#e0e0e0] rounded-md bg-white cursor-pointer transition-all hover:bg-[#f3f4f6]"
          onClick={onRefresh} 
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        {/* Customer Region Dropdown */}
        <div className="relative" ref={regionDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[140px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
          >
            <span className="truncate">
              {filters.customerRegion || 'Customer Region'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${regionDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {regionDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[140px] max-h-[300px] overflow-y-auto">
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange('customerRegion', '')
                    setRegionDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    !filters.customerRegion
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Customer Region
                </button>
                {regions.map(region => (
                  <button
                    key={region}
                    type="button"
                    onClick={() => {
                      onFilterChange('customerRegion', region)
                      setRegionDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                      filters.customerRegion === region
                        ? 'bg-[#3b82f6] text-white'
                        : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Gender Dropdown */}
        <div className="relative" ref={genderDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[100px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setGenderDropdownOpen(!genderDropdownOpen)}
          >
            <span className="truncate">
              {filters.gender || 'Gender'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${genderDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {genderDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[100px] max-h-[300px] overflow-y-auto">
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange('gender', '')
                    setGenderDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    !filters.gender
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Gender
                </button>
                {genders.map(gender => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => {
                      onFilterChange('gender', gender)
                      setGenderDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                      filters.gender === gender
                        ? 'bg-[#3b82f6] text-white'
                        : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Age Range Filter */}
        <AgeRangeFilter
          value={filters.ageFilter || null}
          onChange={handleAgeFilterChange}
        />
  
        {/* Product Category Dropdown */}
        <div className="relative" ref={categoryDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[150px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
          >
            <span className="truncate">
              {filters.productCategory || 'Product Category'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {categoryDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[150px] max-h-[300px] overflow-y-auto">
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange('productCategory', '')
                    setCategoryDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    !filters.productCategory
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Product Category
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => {
                      onFilterChange('productCategory', category)
                      setCategoryDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                      filters.productCategory === category
                        ? 'bg-[#3b82f6] text-white'
                        : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
  
        {/* Tags Multi-Select Dropdown */}
        <div className="relative" ref={tagsDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[120px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setTagsDropdownOpen(!tagsDropdownOpen)}
          >
            <span className="truncate">
              {Array.isArray(filters.tags) && filters.tags.length > 0
                ? `${filters.tags.length} selected`
                : 'Tags'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform ${tagsDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {tagsDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="p-2">
                {tags.length > 0 ? (
                  tags.map(tag => {
                    const isSelected = Array.isArray(filters.tags) && filters.tags.includes(tag)
                    return (
                      <label
                        key={tag}
                        className="flex items-center gap-2 p-2 hover:bg-[#f3f4f6] rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleTagToggle(tag)}
                          className="w-4 h-4 text-[#3b82f6] border-[#d1d5db] rounded focus:ring-[#3b82f6] cursor-pointer"
                        />
                        <span className="text-xs text-[#374151]">{tag}</span>
                      </label>
                    )
                  })
                ) : (
                  <div className="p-2 text-xs text-[#6b7280]">No tags available</div>
                )}
                {Array.isArray(filters.tags) && filters.tags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => onFilterChange('tags', [])}
                    className="w-full mt-2 pt-2 border-t border-[#e0e0e0] text-xs text-[#ef4444] hover:text-[#dc2626] text-center"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
  
        {/* Payment Method Dropdown */}
        <div className="relative" ref={paymentDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[140px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
          >
            <span className="truncate">
              {filters.paymentMethod || 'Payment Method'}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${paymentDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {paymentDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[140px] max-h-[300px] overflow-y-auto">
              <div className="p-1">
                <button
                  type="button"
                  onClick={() => {
                    onFilterChange('paymentMethod', '')
                    setPaymentDropdownOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                    !filters.paymentMethod
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Payment Method
                </button>
                {paymentMethods.map(method => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => {
                      onFilterChange('paymentMethod', method)
                      setPaymentDropdownOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                      filters.paymentMethod === method
                        ? 'bg-[#3b82f6] text-white'
                        : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Date Range Filter */}
        <DateRangeFilter
          value={filters.dateFilter || null}
          onChange={handleDateFilterChange}
        />
  
        {/* Sort Dropdown */}
        <div className="relative ml-auto" ref={sortDropdownRef}>
          <button
            type="button"
            className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[200px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between gap-2"
            onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
          >
            <span className="truncate">
              {sortOptions.find(opt => {
                const currentSort = filters.sortBy || 'customerName'
                const currentOrder = filters.sortOrder || 'asc'
                const optValue = opt.value.startsWith('-') ? opt.value.substring(1) : opt.value
                const optOrder = opt.value.startsWith('-') ? 'desc' : 'asc'
                return optValue === currentSort && optOrder === currentOrder
              })?.label || sortOptions[0].label}
            </span>
            <svg
              className={`w-4 h-4 transition-transform flex-shrink-0 ${sortDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          {sortDropdownOpen && (
            <div className="absolute top-full right-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[200px] max-h-[300px] overflow-y-auto">
              <div className="p-1">
                {sortOptions.map(option => {
                  const currentSort = filters.sortBy || 'customerName'
                  const currentOrder = filters.sortOrder || 'asc'
                  const optValue = option.value.startsWith('-') ? option.value.substring(1) : option.value
                  const optOrder = option.value.startsWith('-') ? 'desc' : 'asc'
                  const isSelected = optValue === currentSort && optOrder === currentOrder
                  
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        const value = option.value
                        if (value.startsWith('-')) {
                          onFilterChange('sortBy', value.substring(1))
                          onFilterChange('sortOrder', 'desc')
                        } else {
                          onFilterChange('sortBy', value)
                          onFilterChange('sortOrder', 'asc')
                        }
                        setSortDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                        isSelected
                          ? 'bg-[#3b82f6] text-white'
                          : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                      }`}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  export default Filters