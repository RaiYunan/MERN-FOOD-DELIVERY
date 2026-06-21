import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Star, Flame, Leaf, Search, SlidersHorizontal, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { getProducts } from '@/features/product/productSlice'

const categories = [
  { key: 'all', label: 'All' },
  { key: 'appetizer', label: 'Appetizers' },
  { key: 'main_course', label: 'Main course' },
  { key: 'dessert', label: 'Desserts' },
  { key: 'beverage', label: 'Drinks' },
  { key: 'fast_food', label: 'Fast food' },
]

const filterChips = [
  { key: 'popular', label: 'Popular' },
  { key: 'veg', label: 'Veg only' },
  { key: 'rating', label: 'Top rated' },
  { key: 'spicy', label: 'Spicy' },
  { key: 'priceLow', label: 'Price: low to high' },
]

const spiceDots = { none: 0, mild: 1, medium: 2, hot: 3 }

function Menu() {
  const dispatch = useAppDispatch()
  const { items, status } = useAppSelector((state) => state.product)

  const [activeCategory, setActiveCategory] = useState('all')
  const [activeFilters, setActiveFilters] = useState([])
  const [search, setSearch] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    dispatch(getProducts())
  }, [dispatch])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleFilter = (key) => {
    setActiveFilters((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    )
  }

  const filtered = useMemo(() => {
    let result = [...items]

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    if (activeFilters.includes('veg')) {
      result = result.filter((p) => p.isVeg)
    }
    if (activeFilters.includes('popular')) {
      result = result.filter((p) => p.isPopular)
    }
    if (activeFilters.includes('spicy')) {
      result = result.filter(
        (p) => p.spiceLevel === 'medium' || p.spiceLevel === 'hot'
      )
    }
    if (activeFilters.includes('rating')) {
      result = result.filter((p) => (p.averageRating || 0) >= 4)
    }
    if (activeFilters.includes('priceLow')) {
      result = [...result].sort((a, b) => a.price - b.price)
    }

    return result
  }, [items, activeCategory, search, activeFilters])

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen">
      {/* Sticky header — collapses on scroll, Apple HIG large-title pattern */}
      <div
        className={`sticky top-16 z-40 bg-cream/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-ink/10 dark:border-border-dark transition-all duration-300 ${
          scrolled ? 'py-3' : 'py-6'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between gap-4">
            <h1
              className={`font-display font-bold text-ink dark:text-text-dark transition-all duration-300 ${
                scrolled ? 'text-xl' : 'text-3xl md:text-4xl'
              }`}
            >
              Today's menu
            </h1>

            <button
              type="button"
              onClick={() => setSearchOpen((s) => !s)}
              className="p-2.5 rounded-full text-ink/60 dark:text-text-dark/60 hover:bg-clay-light dark:hover:bg-card-dark transition-colors shrink-0"
              aria-label="Search menu"
            >
              {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
          </div>

          {searchOpen && (
            <div className="mt-4 animate-in fade-in slide-in-from-top-1 duration-200">
              <input
                type="text"
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search momo, sekuwa, chiya..."
                className="w-full font-body bg-clay-light dark:bg-card-dark border border-ink/10 dark:border-border-dark rounded-full px-5 py-3 text-sm text-ink dark:text-text-dark placeholder:text-ink/40 dark:placeholder:text-text-dark/40 focus:outline-none focus:border-chili transition-colors"
              />
            </div>
          )}

          {/* Category tabs */}
          <div className="flex gap-2 mt-5 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 font-body text-sm font-semibold cursor-pointer px-4 py-2 rounded-full border transition-colors ${
                  activeCategory === cat.key
                    ? 'bg-ink dark:bg-chili text-cream border-ink dark:border-chili'
                    : 'bg-transparent text-ink/60 dark:text-text-dark/60 border-ink/15 dark:border-border-dark hover:border-ink/40 dark:hover:border-text-dark/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar -mx-6 px-6 pb-1">
            <SlidersHorizontal
              size={14}
              className="text-ink/30 dark:text-text-dark/30 shrink-0"
            />
            {filterChips.map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => toggleFilter(chip.key)}
                className={`shrink-0 font-body text-xs font-medium px-3.5 py-1.5 rounded-full border  cursor-pointer transition-colors ${
                  activeFilters.includes(chip.key)
                    ? 'bg-chili/10 text-chili border-chili'
                    : 'bg-transparent text-ink/50 dark:text-text-dark/50 border-ink/10 dark:border-border-dark hover:border-ink/25'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {status === 'loading' && <SkeletonGrid />}

        {status === 'succeeded' && filtered.length === 0 && (
          <EmptyState query={search} />
        )}

        {status === 'succeeded' && filtered.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }) {
  const dots = spiceDots[product.spiceLevel] ?? 0

  return (
    <Link
      to={`/menu/${product._id}`}
      className="group flex flex-col bg-card dark:bg-card-dark border border-ink/8 dark:border-border-dark rounded-lg overflow-hidden hover:border-ink/20 dark:hover:border-text-dark/20 hover:shadow-[0_8px_24px_-12px_rgba(26,20,16,0.18)] transition-all duration-300"
    >
      <div className="relative aspect-square bg-clay-light dark:bg-surface-dark overflow-hidden">
        {product.image ? (
          <img
            src={
              product.image.startsWith('http')
                ? product.image
                : `${import.meta.env.VITE_SOCKET_URL}${product.image}`
            }
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/20 dark:text-text-dark/20 font-display text-2xl">
            {product.name[0]}
          </div>
        )}

        {/* Veg/non-veg indicator — top left, like Zomato/Swiggy convention */}
        <span
          className={`absolute top-2.5 left-2.5 w-4 h-4 rounded-[3px] border-2 flex items-center justify-center bg-cream ${
            product.isVeg ? 'border-cardamom' : 'border-chili'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              product.isVeg ? 'bg-cardamom' : 'bg-chili'
            }`}
          />
        </span>

        {product.isPopular && (
          <span className="absolute top-2.5 right-2.5 bg-turmeric text-ink text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
            Popular
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col gap-1.5 flex-1">
        <h3 className="font-display font-semibold text-ink dark:text-text-dark text-[15px] leading-snug line-clamp-1">
          {product.name}
        </h3>

        {product.averageRating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="fill-turmeric text-turmeric" />
            <span className="font-body text-xs text-ink/60 dark:text-text-dark/60">
              {product.averageRating.toFixed(1)}
            </span>
            <span className="font-body text-xs text-ink/35 dark:text-text-dark/35">
              ({product.totalReviews})
            </span>
          </div>
        )}

        {dots > 0 && (
          <div className="flex items-center gap-0.5">
            {[1, 2, 3].map((i) => (
              <Flame
                key={i}
                size={11}
                className={
                  i <= dots
                    ? 'text-chili fill-chili'
                    : 'text-ink/10 dark:text-text-dark/10'
                }
              />
            ))}
          </div>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <span className="font-body font-bold text-ink dark:text-text-dark text-sm">
            Rs. {product.price}
          </span>
        </div>
      </div>
    </Link>
  )
}

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <div className="aspect-square bg-clay-light dark:bg-card-dark rounded-lg animate-pulse" />
          <div className="h-3.5 w-3/4 bg-clay-light dark:bg-card-dark rounded mt-3 animate-pulse" />
          <div className="h-3 w-1/3 bg-clay-light dark:bg-card-dark rounded mt-2 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

function EmptyState({ query }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Leaf size={28} className="text-ink/20 dark:text-text-dark/20 mb-4" />
      <p className="font-display text-xl font-semibold text-ink dark:text-text-dark mb-1">
        {query ? `Nothing matches "${query}"` : 'Nothing here yet'}
      </p>
      <p className="font-body text-sm text-ink/50 dark:text-text-dark/50">
        Try a different category or clear your filters.
      </p>
    </div>
  )
}

export default Menu