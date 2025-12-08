import { useState } from 'react'

const Sidebar = () => {
  const [servicesOpen, setServicesOpen] = useState(true)
  const [invoicesOpen, setInvoicesOpen] = useState(true)

  return (
    <div className="w-[220px] h-screen bg-white border-r border-[#e0e0e0] fixed left-0 top-0 overflow-y-auto">
      <div className="p-4 border-b border-[#e0e0e0] relative">
        <div className="flex items-center gap-2">
          <img src="/vault.png" alt="Vault" className="w-8 h-8 object-contain" />
          <div className="flex flex-col flex-1">
            <div className="text-sm font-semibold">Vault</div>
            <button className="text-xs text-[#6b7280] text-left hover:text-[#4b5563]">
              Anurag Yadav
            </button>
          </div>
        </div>
        <svg className="w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#4b5563] cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
      
      <nav className="py-2">
        <div className="px-2">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors bg-[#f3f4f6] text-[#1a1a1a]">
            <img src="/dashboard.png" alt="Dashboard" className="w-4 h-4 mr-3 object-contain" />
            <span className="text-sm">Dashboard</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
            <img src="/nexus.png" alt="Nexus" className="w-4 h-4 mr-3 object-contain" />
            <span className="text-sm">Nexus</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
            <img src="/intake.png" alt="Intake" className="w-4 h-4 mr-3 object-contain" />
            <span className="text-sm">Intake</span>
          </div>
        </div>
        
        <div className="px-2 mt-1">
          <div>
            <div 
              className="flex items-center px-3 py-2 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]"
              onClick={() => setServicesOpen(!servicesOpen)}
            >
              <img src="/services.png" alt="Services" className="w-4 h-4 mr-3 object-contain" />
              <span className="text-sm flex-1">Services</span>
              <svg className={`w-3 h-3 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {servicesOpen && (
              <div className="ml-7 mt-1">
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/preactive.png" alt="Pre-active" className="w-3 h-3 mr-3 object-contain" />
                  <span className="text-sm">Pre-active</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/active.png" alt="Active" className="w-3 h-3 mr-3 object-contain" />
                  <span className="text-sm">Active</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/blocked.png" alt="Blocked" className="w-3 h-3 mr-3 object-contain" />
                  <span className="text-sm">Blocked</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/closed.png" alt="Closed" className="w-3 h-3 mr-3 object-contain" />
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
              <img src="/invoices.png" alt="Invoices" className="w-4 h-4 mr-3 object-contain" />
              <span className="text-sm flex-1">Invoices</span>
              <svg className={`w-3 h-3 transition-transform ${invoicesOpen ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            {invoicesOpen && (
              <div className="ml-7 mt-1">
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/proformainvoices.png" alt="Proforma Invoices" className="w-3 h-3 mr-3 object-contain" />
                  <span className="text-sm">Proforma Invoices</span>
                </div>
                <div className="flex items-center px-3 py-1.5 rounded-md cursor-pointer transition-colors hover:bg-[#f3f4f6] text-[#6b7280]">
                  <img src="/proformainvoices.png" alt="Final Invoices" className="w-3 h-3 mr-3 object-contain" />
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