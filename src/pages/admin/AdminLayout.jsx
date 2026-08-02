import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { label: 'პროდუქტის დამატება', href: '#/admin/products/new', icon: 'add_box' },
  { label: 'პროდუქტების მართვა', href: '#/admin/products', icon: 'inventory_2' },
  { label: 'შეკვეთები', href: '#/admin/orders', icon: 'receipt_long' },
]

export default function AdminLayout({ active, children }) {
  const { profile, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-container-low flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-outline-variant transform transition-transform duration-200 lg:translate-x-0 lg:static lg:shrink-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-outline-variant">
            <p className="text-xs font-medium text-secondary uppercase tracking-wider mb-1">
              ადმინისტრატორი
            </p>
            <p className="text-sm font-bold text-on-surface truncate">{profile?.full_name || 'ადმინი'}</p>
          </div>

          <nav className="flex-1 py-4 px-3 space-y-1">
            {TABS.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                onClick={() => setMobileOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded transition-colors ${
                  tab.label === active
                    ? 'bg-primary/5 text-primary'
                    : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{tab.icon}</span>
                {tab.label}
              </a>
            ))}
          </nav>

          <div className="p-3 border-t border-outline-variant space-y-1">
            <a
              href="#/"
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary rounded transition-colors hover:text-on-surface hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              მაღაზიაში დაბრუნება
            </a>
            <button
              onClick={signOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-secondary rounded transition-colors hover:text-error hover:bg-surface-container-low"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              გასვლა
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile menu toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border border-outline-variant rounded shadow-sm"
        onClick={() => setMobileOpen((o) => !o)}
        aria-label="მენიუ"
      >
        <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
      </button>

      <main className="flex-1 p-6 lg:p-8 min-h-screen">{children}</main>
    </div>
  )
}
