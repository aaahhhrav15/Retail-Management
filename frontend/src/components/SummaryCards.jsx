const SummaryCards = ({ statistics }) => {
    const formatCurrency = (amount) => {
      if (!amount) return '₹0'
      return `₹${amount.toLocaleString('en-IN')}`
    }
  
    const formatNumber = (num) => {
      if (!num) return '0'
      return num.toLocaleString('en-IN')
    }
  
    if (!statistics) {
      return (
        <div className="flex gap-4 mb-6">
          <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280]">Total units sold</span>
              <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total number of product units sold across all transactions">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-semibold text-[#1a1a1a]">0</div>
          </div>
          <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280]">Total Amount</span>
              <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total revenue amount from all sales transactions (SRs = Sales Records)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-semibold text-[#1a1a1a]">
              ₹0 <span className="text-xs text-[#6b7280] font-normal">(0 SRs)</span>
            </div>
          </div>
          <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-[#6b7280]">Total Discount</span>
              <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total discount amount applied across all transactions (calculated as difference between total amount and total revenue)">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            <div className="text-xl font-semibold text-[#1a1a1a]">
              ₹0 <span className="text-xs text-[#6b7280] font-normal">(0 SRs)</span>
            </div>
          </div>
        </div>
      )
    }
  
    const totalDiscount = statistics.totalTransactions 
      ? statistics.totalAmount - statistics.totalRevenue 
      : 0
  
    return (
      <div className="flex gap-4 mb-6">
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280]">Total units sold</span>
            <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total number of product units sold across all transactions">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="text-xl font-semibold text-[#1a1a1a]">
            {formatNumber(statistics.totalQuantity || 0)}
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280]">Total Amount</span>
            <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total revenue amount from all sales transactions (SRs = Sales Records)">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="text-xl font-semibold text-[#1a1a1a]">
            {formatCurrency(statistics.totalRevenue || 0)}
            <span className="text-xs text-[#6b7280] font-normal ml-1">
              ({statistics.totalTransactions || 0} SRs)
            </span>
          </div>
        </div>
        <div className="bg-white border border-[#e0e0e0] rounded-lg p-4 w-fit">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#6b7280]">Total Discount</span>
            <button className="text-[#9ca3af] hover:text-[#6b7280] relative" title="Total discount amount applied across all transactions (calculated as difference between total amount and total revenue)">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <div className="text-xl font-semibold text-[#1a1a1a]">
            {formatCurrency(totalDiscount)}
            <span className="text-xs text-[#6b7280] font-normal ml-1">
              ({statistics.totalTransactions || 0} SRs)
            </span>
          </div>
        </div>
      </div>
    )
  }
  
  export default SummaryCards