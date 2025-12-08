import { useState, useRef, useEffect } from 'react'

const AgeRangeFilter = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [tempMin, setTempMin] = useState('')
  const [tempMax, setTempMax] = useState('')
  const [showCustom, setShowCustom] = useState(false)
  const dropdownRef = useRef(null)

  const presetRanges = [
    { label: '18-25', min: 18, max: 25 },
    { label: '26-35', min: 26, max: 35 },
    { label: '36-45', min: 36, max: 45 },
    { label: '46-60', min: 46, max: 60 },
    { label: '60+', min: 60, max: null }
  ]

  // Initialize temp values when value changes
  useEffect(() => {
    if (value) {
      setTempMin(value.min !== null && value.min !== undefined ? value.min.toString() : '')
      setTempMax(value.max !== null && value.max !== undefined ? value.max.toString() : '')
      // Check if it matches any preset range
      const matchesPreset = presetRanges.some(range => {
        if (range.max === null) {
          // Handle 60+ case
          return value.min === range.min && value.max === null
        }
        return range.min === value.min && range.max === value.max
      })
      setShowCustom(!matchesPreset)
    } else {
      setTempMin('')
      setTempMax('')
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
    if (!value || (value.min === null && value.max === null)) {
      return ''
    }

    const min = value.min
    const max = value.max

    if (min !== null && max !== null) {
      return `Age Range: ${min}–${max}`
    } else if (min !== null) {
      return `Age Range: ≥${min}`
    } else if (max !== null) {
      return `Age Range: ≤${max}`
    }

    return ''
  }

  const handlePresetClick = (range) => {
    setShowCustom(false)
    onChange({ min: range.min, max: range.max })
    setIsOpen(false)
  }

  const handleApply = () => {
    let min = tempMin === '' ? null : parseInt(tempMin)
    let max = tempMax === '' ? null : parseInt(tempMax)

    // Auto-swap if min > max
    if (min !== null && max !== null && min > max) {
      const temp = min
      min = max
      max = temp
    }

    // Empty means null
    if (tempMin === '' && tempMax === '') {
      onChange(null)
    } else {
      onChange({ min, max })
    }
    setIsOpen(false)
  }

  const handleClear = () => {
    setTempMin('')
    setTempMax('')
    onChange(null)
    setIsOpen(false)
  }

  const handleCustomClick = () => {
    setShowCustom(true)
    // Initialize temp values from current value if exists
    if (value) {
      setTempMin(value.min !== null ? value.min.toString() : '')
      setTempMax(value.max !== null ? value.max.toString() : '')
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="py-2 px-3 border border-[#e0e0e0] rounded-md text-xs bg-white cursor-pointer outline-none min-w-[140px] text-left text-[#6b7280] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20 flex items-center justify-between"
      >
        <span className={getDisplayText() ? 'text-[#6b7280]' : 'text-[#6b7280]'}>
          {getDisplayText() || 'Age Range'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 min-w-[280px] p-3">
          {/* Preset Range Buttons */}
          {!showCustom && (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {presetRanges.map((range) => (
                  <button
                    key={range.label}
                    type="button"
                    onClick={() => handlePresetClick(range)}
                    className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                      value && value.min === range.min && value.max === range.max
                        ? 'bg-[#3b82f6] text-white border-[#3b82f6]'
                        : 'bg-white text-[#6b7280] border-[#e0e0e0] hover:border-[#3b82f6] hover:text-[#3b82f6]'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCustomClick}
                className="w-full px-3 py-2 text-sm text-[#3b82f6] border border-[#3b82f6] rounded hover:bg-[#3b82f6] hover:text-white transition-colors"
              >
                Custom Range
              </button>
            </>
          )}

          {/* Custom Inputs */}
          {showCustom && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#6b7280] min-w-[70px]">Min Age:</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={tempMin}
                  onChange={(e) => setTempMin(e.target.value)}
                  className="flex-1 py-1.5 px-2 border border-[#e0e0e0] rounded text-sm outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
                  placeholder="Min"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-[#6b7280] min-w-[70px]">Max Age:</label>
                <input
                  type="number"
                  min="0"
                  max="150"
                  value={tempMax}
                  onChange={(e) => setTempMax(e.target.value)}
                  className="flex-1 py-1.5 px-2 border border-[#e0e0e0] rounded text-sm outline-none focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
                  placeholder="Max"
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

export default AgeRangeFilter
