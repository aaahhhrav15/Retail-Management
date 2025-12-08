import { useState, useRef, useEffect } from 'react'

const DateRangeFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempFrom, setTempFrom] = useState('')
  const [tempTo, setTempTo] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const [error, setError] = useState('')
  const dropdownRef = useRef(null)

  const formatDate = (date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `${day} ${month} ${year}`
  }

  const getPresetDates = () => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const last7Days = new Date(today)
    last7Days.setDate(last7Days.getDate() - 7)
    const last30Days = new Date(today)
    last30Days.setDate(last30Days.getDate() - 30)
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)

    return {
      today: formatDate(today),
      yesterday: formatDate(yesterday),
      last7DaysFrom: formatDate(last7Days),
      last7DaysTo: formatDate(today),
      last30DaysFrom: formatDate(last30Days),
      last30DaysTo: formatDate(today),
      thisMonthFrom: formatDate(firstDayOfMonth),
      thisMonthTo: formatDate(today)
    }
  }

  // Initialize temp values when value changes
  useEffect(() => {
    if (value && value.preset === 'custom') {
      setTempFrom(value.from || '')
      setTempTo(value.to || '')
      setShowCustom(true)
    } else if (value && value.preset) {
      setShowCustom(false)
      // For presets, we don't need to set temp values since they're calculated on-demand
      // But we should set them if the value has from/to already
      if (value.from) setTempFrom(value.from)
      if (value.to) setTempTo(value.to)
    } else {
      setTempFrom('')
      setTempTo('')
      setShowCustom(false)
    }
  }, [value])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const getDisplayText = () => {
    if (!value || !value.preset) {
      return ''
    }

    if (value.preset === 'today') {
      return 'Today'
    } else if (value.preset === 'last7days') {
      return 'Last 7 days'
    } else if (value.preset === 'last30days') {
      return 'Last 30 days'
    } else if (value.preset === 'thisMonth') {
      return 'This month'
    } else if (value.preset === 'custom' && value.from && value.to) {
      return `${formatDisplayDate(value.from)} – ${formatDisplayDate(value.to)}`
    } else if (value.preset === 'custom' && (value.from || value.to)) {
      if (value.from) {
        return `${formatDisplayDate(value.from)} – ...`
      } else if (value.to) {
        return `... – ${formatDisplayDate(value.to)}`
      }
    }

    return ''
  }

  const handlePresetClick = (preset) => {
    setShowCustom(false)
    const dates = getPresetDates()
    
    if (preset === 'any') {
      onChange(null)
    } else if (preset === 'today') {
      onChange({ preset: 'today', from: dates.today, to: dates.today })
    } else if (preset === 'last7days') {
      onChange({ preset: 'last7days', from: dates.last7DaysFrom, to: dates.last7DaysTo })
    } else if (preset === 'last30days') {
      onChange({ preset: 'last30days', from: dates.last30DaysFrom, to: dates.last30DaysTo })
    } else if (preset === 'thisMonth') {
      onChange({ preset: 'thisMonth', from: dates.thisMonthFrom, to: dates.thisMonthTo })
    }
    setIsOpen(false)
  }

  const handleCustomClick = () => {
    setShowCustom(true)
    // Initialize temp values from current value if exists
    if (value && value.from) {
      setTempFrom(value.from)
    }
    if (value && value.to) {
      setTempTo(value.to)
    }
  }

  const handleApply = () => {
    setError('')
    
    // Validate dates if both are provided
    if (tempFrom && tempTo) {
      const fromDate = new Date(tempFrom)
      const toDate = new Date(tempTo)
      
      if (isNaN(fromDate.getTime())) {
        setError('Invalid start date format.')
        return
      }
      
      if (isNaN(toDate.getTime())) {
        setError('Invalid end date format.')
        return
      }
      
      if (fromDate > toDate) {
        setError('Start date cannot be after end date.')
        return
      }
    }
    
    // Only apply if validation passes
    if (tempFrom === '' && tempTo === '') {
      onChange(null)
    } else {
      onChange({ preset: 'custom', from: tempFrom || null, to: tempTo || null })
    }
    setIsOpen(false)
    setError('')
  }

  const handleClear = () => {
    setTempFrom('')
    setTempTo('')
    onChange(null)
    setIsOpen(false)
  }

  const presets = [
    { value: 'any', label: 'Any' },
    { value: 'today', label: 'Today' },
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'thisMonth', label: 'This month' },
    { value: 'custom', label: 'Custom' }
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[200px] text-left text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between"
      >
        <span className="truncate text-[#6b7280]">
          {getDisplayText() || 'Date Range'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform flex-shrink-0 ml-2 ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[300px] p-3">
          {/* Preset Options */}
          {!showCustom && (
            <div className="space-y-1">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => {
                    if (preset.value === 'custom') {
                      handleCustomClick()
                    } else {
                      handlePresetClick(preset.value)
                    }
                  }}
                  className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                    value && value.preset === preset.value
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}

          {/* Custom Date Inputs */}
          {showCustom && (
            <div className="space-y-3">
              {error && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm text-[#6b7280] block">From:</label>
                <input
                  type="date"
                  value={tempFrom}
                  onChange={(e) => {
                    setTempFrom(e.target.value)
                    setError('') // Clear error when user changes input
                  }}
                  className={`w-full py-1.5 px-2 border rounded text-sm outline-none focus:ring-1 ${
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#e0e0e0] focus:border-[#3b82f6] focus:ring-[#3b82f6]/20'
                  }`}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#6b7280] block">To:</label>
                <input
                  type="date"
                  value={tempTo}
                  onChange={(e) => {
                    setTempTo(e.target.value)
                    setError('') // Clear error when user changes input
                  }}
                  className={`w-full py-1.5 px-2 border rounded text-sm outline-none focus:ring-1 ${
                    error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-[#e0e0e0] focus:border-[#3b82f6] focus:ring-[#3b82f6]/20'
                  }`}
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleApply}
                  className="flex-1 px-3 py-2 text-sm bg-[#3b82f6] text-white rounded hover:bg-[#2563eb] transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex-1 px-3 py-2 text-sm bg-white text-[#6b7280] border border-[#e0e0e0] rounded hover:bg-[#f3f4f6] transition-colors"
                >
                  Clear
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="w-full px-3 py-2 text-sm text-[#6b7280] hover:text-[#3b82f6] transition-colors"
              >
                ← Back to Presets
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default DateRangeFilter
