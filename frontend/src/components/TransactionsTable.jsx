const TransactionsTable = ({ transactions, loading }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return date.toISOString().split('T')[0]
    }
  
    const formatPhoneNumber = (phone) => {
      if (!phone) return '-'
      if (phone.startsWith('+91')) return phone
      return `+91 ${phone}`
    }

    const formatCurrency = (amount) => {
      if (!amount && amount !== 0) return '-'
      return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text)
    }
  
    if (loading) {
      return (
        <div className="bg-white rounded-lg overflow-hidden border border-[#e0e0e0]">
          <div className="text-center py-10 text-sm text-[#6b7280]">Loading transactions...</div>
        </div>
      )
    }
  
    if (!transactions || transactions.length === 0) {
      return (
        <div className="bg-white rounded-lg overflow-hidden border border-[#e0e0e0]">
          <div className="text-center py-10 text-sm text-[#6b7280]">No transactions found</div>
        </div>
      )
    }
  
    // Sample data to match the screenshot exactly
    const sampleTransactions = Array(14).fill(null).map((_, index) => ({
      transactionId: '1234567',
      date: '2023-09-26',
      customerId: 'CUST12016',
      customerName: 'Neha Yadav',
      phoneNumber: '9123456789',
      gender: 'Female',
      age: 25,
      productCategory: 'Clothing',
      productId: 'PROD123',
      quantity: 1,
      totalAmount: 5000,
      customerRegion: 'West',
      employeeName: 'John Doe'
    }))
  
    const displayTransactions = transactions.length > 0 ? transactions : sampleTransactions
  
    return (
      <div className="bg-white rounded-lg overflow-hidden border border-[#e0e0e0]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#f9fafb] border-b border-[#e0e0e0]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Customer ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Customer name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Phone Number
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Gender
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Age
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Product Category
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Product ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Customer Region
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-[#6b7280] uppercase tracking-wider">
                  Employee Name
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#f0f0f0]">
              {displayTransactions.map((transaction, index) => (
                <tr key={`${transaction.transactionId}-${index}`} className="hover:bg-[#fafafa] transition-colors">
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.transactionId}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{formatDate(transaction.date)}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.customerId}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.customerName}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">
                    <div className="flex items-center gap-1">
                      <span>{formatPhoneNumber(transaction.phoneNumber)}</span>
                      <button
                        className="p-1 rounded hover:bg-[#f3f4f6] transition-colors"
                        onClick={() => copyToClipboard(transaction.phoneNumber)}
                        title="Copy"
                      >
                        <svg className="w-3.5 h-3.5 text-[#6b7280]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.gender}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.age}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.productCategory}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.productId || '-'}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a] text-center">
                    {String(transaction.quantity).padStart(2, '0')}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">
                    {formatCurrency(transaction.totalAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.customerRegion || '-'}</td>
                  <td className="px-4 py-3 text-sm text-[#1a1a1a]">{transaction.employeeName || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
  
  export default TransactionsTable