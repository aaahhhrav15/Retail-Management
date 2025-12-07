import { useState, useEffect } from 'react'
import { apiService } from '../services/api.service'

const Filters = ({ filters, onFilterChange, onRefresh }) => {
    const [filterOptions, setFilterOptions] = useState({
        productCategories: [],
        customerRegions: [],
        genders: [],
        paymentMethods: [],
        tags: []
    })
    const [loading, setLoading] = useState(true)

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

    const regions = ['Customer Region', ...filterOptions.customerRegions]
    const genders = ['Gender', ...filterOptions.genders]
    const ageRanges = ['Age Range', '18-25', '26-35', '36-45', '46-55', '56+']
    const categories = ['Product Category', ...filterOptions.productCategories]
    const tags = ['Tags', ...filterOptions.tags]
    const paymentMethods = ['Payment Method', ...filterOptions.paymentMethods]
    const sortOptions = [
      { value: 'customerName', label: 'Sort by: Customer Name (A-Z)' },
      { value: '-customerName', label: 'Sort by: Customer Name (Z-A)' },
      { value: 'date', label: 'Sort by: Date (Newest)' },
      { value: '-date', label: 'Sort by: Date (Oldest)' },
      { value: 'finalAmount', label: 'Sort by: Amount (High to Low)' },
      { value: '-finalAmount', label: 'Sort by: Amount (Low to High)' }
    ]
  
    return (
      <div className="flex gap-2 mb-6 items-center flex-wrap">
        <button 
          className="p-2 border border-[#e0e0e0] rounded-md bg-white cursor-pointer transition-all hover:bg-[#f3f4f6]"
          onClick={onRefresh} 
          title="Refresh"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[140px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.customerRegion || 'Customer Region'}
          onChange={(e) => onFilterChange('customerRegion', e.target.value === 'Customer Region' ? '' : e.target.value)}
        >
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[100px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.gender || 'Gender'}
          onChange={(e) => onFilterChange('gender', e.target.value === 'Gender' ? '' : e.target.value)}
        >
          {genders.map(gender => (
            <option key={gender} value={gender}>{gender}</option>
          ))}
        </select>
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[120px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.ageRange || 'Age Range'}
          onChange={(e) => onFilterChange('ageRange', e.target.value === 'Age Range' ? '' : e.target.value)}
        >
          {ageRanges.map(range => (
            <option key={range} value={range}>{range}</option>
          ))}
        </select>
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[150px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.productCategory || 'Product Category'}
          onChange={(e) => onFilterChange('productCategory', e.target.value === 'Product Category' ? '' : e.target.value)}
        >
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[80px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.tags || 'Tags'}
          onChange={(e) => onFilterChange('tags', e.target.value === 'Tags' ? '' : e.target.value)}
        >
          {tags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[140px] text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.paymentMethod || 'Payment Method'}
          onChange={(e) => onFilterChange('paymentMethod', e.target.value === 'Payment Method' ? '' : e.target.value)}
        >
          {paymentMethods.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
  
        <input
          type="date"
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.date || ''}
          onChange={(e) => onFilterChange('date', e.target.value)}
          placeholder="Date"
        />
  
        <select
          className="py-2 px-3 border border-[#e0e0e0] rounded-md text-sm bg-white cursor-pointer outline-none min-w-[200px] text-[#6b7280] ml-auto focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          value={filters.sortBy || 'customerName'}
          onChange={(e) => {
            const value = e.target.value
            if (value.startsWith('-')) {
              onFilterChange('sortBy', value.substring(1))
              onFilterChange('sortOrder', 'desc')
            } else {
              onFilterChange('sortBy', value)
              onFilterChange('sortOrder', 'asc')
            }
          }}
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>
    )
  }
  
  export default Filters