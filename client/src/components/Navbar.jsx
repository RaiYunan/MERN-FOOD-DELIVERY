import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ShoppingBag,
  Moon,
  Sun,
  ChevronDown,
  User,
  Package,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { useTheme } from '@/context/ThemeContext'

const navLinks = [
  { label: 'Menu', to: '/menu' },
  { label: 'Orders', to: '/orders' },
  { label: 'About', to: '/about' },
]

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)

  const { theme, toggleTheme } = useTheme()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { items } = useAppSelector((state) => state.cart)
  const cartCount = items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    dispatch(logout())
    setDropdownOpen(false)
    navigate('/login')
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <header className="sticky top-0 z-50 bg-cream/90 dark:bg-surface-dark/90 backdrop-blur-sm border-b border-ink/10 dark:border-border-dark">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-display text-xl font-bold text-ink dark:text-text-dark">
          Khaja.
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 hover:text-chili dark:hover:text-chili transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-chili text-cream text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Auth area */}
          {isAuthenticated ? (
            <div className="relative ml-1" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-clay-light dark:hover:bg-card-dark transition-colors cursor-pointer"
              >
                <span className="w-8 h-8 rounded-full bg-chili text-cream font-body font-semibold text-xs flex items-center justify-center">
                  {initials}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-ink/50 dark:text-text-dark/50 transition-transform ${
                    dropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-cream dark:bg-card-dark border border-ink/10 dark:border-border-dark rounded-sm shadow-lg overflow-hidden">
                  <div className="px-4 py-3 border-b border-ink/10 dark:border-border-dark">
                    <p className="font-body font-semibold text-sm text-ink dark:text-text-dark truncate">
                      {user?.name}
                    </p>
                    <p className="font-body text-xs text-ink/50 dark:text-text-dark/50 truncate">
                      {user?.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <User size={16} />
                    My profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                  >
                    <Package size={16} />
                    My orders
                  </Link>

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 font-body text-sm text-ink/80 dark:text-text-dark/80 hover:bg-clay-light dark:hover:bg-surface-dark transition-colors"
                    >
                      <ChevronDown size={16} className="-rotate-90" />
                      Admin dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 font-body text-sm text-chili hover:bg-clay-light dark:hover:bg-surface-dark transition-colors border-t border-ink/10 dark:border-border-dark"
                  >
                    <LogOut size={16} />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-1 font-body text-sm font-semibold bg-ink dark:bg-chili text-cream px-4 py-2 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
            >
              Log in
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="md:hidden p-2.5 rounded-full text-ink/70 dark:text-text-dark/70 hover:bg-clay-light dark:hover:bg-card-dark transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-ink/10 dark:border-border-dark bg-cream dark:bg-surface-dark px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="font-body text-sm font-medium text-ink/80 dark:text-text-dark/80 py-2.5"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar