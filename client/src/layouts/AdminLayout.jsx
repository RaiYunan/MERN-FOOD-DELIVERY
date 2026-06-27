import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { useTheme } from '@/context/ThemeContext'
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Users,
  LogOut,
  Sun,
  Moon,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard', to: '/admin',          icon: LayoutDashboard,  end: true },
  { label: 'Orders',    to: '/admin/orders',   icon: ClipboardList },
  { label: 'Products',  to: '/admin/products', icon: UtensilsCrossed },
  { label: 'Users',     to: '/admin/users',    icon: Users },
]

function Sidebar({ onClose }) {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((s) => s.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <aside className="flex flex-col h-full bg-ink dark:bg-card-dark w-64 shrink-0">
      <div className="px-6 h-16 flex items-center border-b border-white/10">
        <span className="font-display text-xl font-bold text-cream">Khaja.</span>
        <span className="ml-2 font-body text-xs text-cream/40 font-medium">admin</span>
        {onClose && (
          <button onClick={onClose} className="ml-auto text-cream/50 hover:text-cream transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {navItems.map(({ label, to, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-sm font-body text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-chili text-cream'
                  : 'text-cream/60 hover:text-cream hover:bg-white/8'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-5 border-t border-white/10">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="w-8 h-8 rounded-sm bg-chili flex items-center justify-center shrink-0">
            <span className="font-body text-xs font-bold text-cream">{initials}</span>
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-cream truncate">{user?.name}</p>
            <p className="font-body text-xs text-cream/40 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-sm font-body text-sm font-medium text-cream/55 hover:text-chili hover:bg-white/5 transition-colors"
        >
          <LogOut size={16} strokeWidth={1.75} />
          Log out
        </button>
      </div>
    </aside>
  )
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="flex h-screen bg-clay-light dark:bg-surface-dark overflow-hidden">
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 shrink-0 bg-cream dark:bg-card-dark border-b border-clay dark:border-border-dark flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-ink/60 dark:text-text-dark/60 hover:text-ink dark:hover:text-text-dark transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:flex items-center gap-1 text-ink/40 dark:text-text-dark/40 font-body text-xs">
            <span>Admin</span>
            <ChevronRight size={12} />
            <span className="text-ink dark:text-text-dark font-medium">Panel</span>
          </div>

          <button
            onClick={toggleTheme}
            className="ml-auto p-2.5 rounded-full text-ink/60 dark:text-text-dark/60 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}