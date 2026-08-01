import { useAuth } from '../../context/AuthContext'

const TABS = [
  { label: 'პროდუქტის დამატება', href: '#/admin/products/new' },
  { label: 'პროდუქტების მართვა', href: '#/admin/products' },
]

export default function AdminLayout({ active, children }) {
  const { profile, signOut } = useAuth()
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-outline-variant px-container-padding py-6">
        <div className="max-w-[1400px] mx-auto w-full flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-primary">ადმინის პანელი</h1>
            <p className="font-label-sm text-label-sm text-secondary mt-1">{profile?.full_name}</p>
          </div>
          <nav className="flex items-center gap-8">
            {TABS.map((tab) => (
              <a
                key={tab.label}
                href={tab.href}
                className={
                  tab.label === active
                    ? 'font-label-sm text-label-sm uppercase tracking-widest text-primary font-bold border-b-2 border-primary pb-1'
                    : 'font-label-sm text-label-sm uppercase tracking-widest text-secondary hover:text-primary transition-colors'
                }
              >
                {tab.label}
              </a>
            ))}
            <a href="#/" className="font-label-sm text-label-sm text-secondary hover:text-primary transition-colors">
              საიტზე დაბრუნება
            </a>
            <button
              onClick={signOut}
              className="font-label-sm text-label-sm text-secondary hover:text-error transition-colors"
            >
              გასვლა
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow px-container-padding py-stack-lg max-w-[1400px] mx-auto w-full">
        {children}
      </main>
    </div>
  )
}
