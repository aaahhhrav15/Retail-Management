const Header = ({ searchQuery, onSearchChange }) => {
    return (
      <div className="h-[60px] bg-white flex items-center justify-between px-6 border-b border-[#e0e0e0]">
        <h1 className="text-xl font-medium text-[#1a1a1a] m-0">Sales Management System</h1>
        <div className="relative w-[280px]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7280]">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" strokeWidth="2"/>
              <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
          <input
            type="text"
            placeholder="Name, Phone no."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full py-2 pr-4 pl-9 border border-[#e0e0e0] rounded-md text-sm outline-none placeholder-[#9ca3af] focus:border-[#3b82f6] focus:ring-1 focus:ring-[#3b82f6]/20"
          />
        </div>
      </div>
    )
  }
  
  export default Header