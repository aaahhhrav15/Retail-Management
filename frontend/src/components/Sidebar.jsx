import { useState } from 'react'

const Sidebar = () => {
  const [servicesOpen, setServicesOpen] = useState(true)
  const [invoicesOpen, setInvoicesOpen] = useState(true)

  return (
    <div className="w-[220px] h-screen bg-white border-r border-[#e0e0e0] fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-[#e0e0e0]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">V</span>
          </div>
          <div className="flex flex-col">
            <div className="text-sm font-semibold">Vault</div>
            <button className="text-xs text-[#6b7280] text-left flex items-center gap-1 hover:text-[#4b5563]">
              Anurag Yadav
              <svg width="8" height="8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <nav className="py-2">
        <div className="px-2">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors bg-[#f3f4f6] text-[#1a1a1a]">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" strokeWidth="2"/>
            </svg>
            <span className="text-sm">Dashboard</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <circle cx="12" cy="12" r="9" strokeWidth="2"/>
            </svg>
            <span className="text-sm">Nexus</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" strokeWidth="2"/>
              <path d="M12 3v6m0 6v6" strokeWidth="2"/>
            </svg>
            <span className="text-sm">Intake</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div>
            <div 
              className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" strokeWidth="2"/>
              </svg>
              <span className="text-sm flex-1">Services</span>
              <svg className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {servicesOpen && (
              <div className="ml-7 mt-1">
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <span className="w-2 h-2 rounded-full bg-gray-400 mr-3"></span>
                  <span className="text-sm">Pre-active</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-3"></span>
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <span className="w-2 h-2 rounded-full bg-red-500 mr-3"></span>
                  <span className="text-sm">Blocked</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <span className="w-2 h-2 rounded-full bg-gray-700 mr-3"></span>
                  <span className="text-sm">Closed</span>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div>
            <div 
              className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]"
              onClick={() => setInvoicesOpen(!invoicesOpen)}
            >
              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
              </svg>
              <span className="text-sm flex-1">Invoices</span>
              <svg className={`w-3 h-3 transition-transform ${invoicesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {invoicesOpen && (
              <div className="ml-7 mt-1">
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <svg className="w-3 h-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">Proforma Invoices</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <svg className="w-3 h-3 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2"/>
                  </svg>
                  <span className="text-sm">Final Invoices</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar