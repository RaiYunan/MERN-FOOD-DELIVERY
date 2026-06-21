import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Flame, Minus, Plus, ShoppingBag } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  getProductById,
  clearSelectedProduct,
} from '@/features/product/productSlice'

const spiceDots = { none: 0, mild: 1, medium: 2, hot: 3 }

const spiceLabel = {
  none: 'Not spicy',
  mild: 'Mild',
  medium: 'Medium spice',
  hot: 'Hot',
}

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)

  const { selected: product, selectedStatus } = useAppSelector(
    (state) => state.product
  )
  const { isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getProductById(id))
    return () => dispatch(clearSelectedProduct())
  }, [dispatch, id])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Log in to add items to your cart')
      navigate('/login')
      return
    }
    // dispatch(addToCart({ productId: product._id, quantity }))
    toast.success(`Added ${quantity} x ${product.name} to cart`)
  }

  if (selectedStatus === 'loading' || !product) {
    return <DetailSkeleton />
  }

  const dots = spiceDots[product.spiceLevel] ?? 0

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen">
      <div className="sticky top-16 z-30 bg-cream/95 dark:bg-surface-dark/95 backdrop-blur-md border-b border-ink/10 dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 py-3.5">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 font-body text-sm font-medium text-ink/60 dark:text-text-dark/60 hover:text-ink dark:hover:text-text-dark transition-colors"
          >
            <ArrowLeft size={16} />
            Back to menu
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 md:py-12 grid md:grid-cols-2 gap-10 md:gap-16">
        <div className="relative aspect-square bg-clay-light dark:bg-card-dark rounded-lg overflow-hidden">
          {product.image ? (
            <img
              src={
                product.image.startsWith('http')
                  ? product.image
                  : `${import.meta.env.VITE_SOCKET_URL}${product.image}`
              }
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/20 dark:text-text-dark/20 font-display text-6xl">
              {product.name[0]}
            </div>
          )}

          <span
            className={`absolute top-4 left-4 w-6 h-6 rounded-[5px] border-2 flex items-center justify-center bg-cream ${
              product.isVeg ? 'border-cardamom' : 'border-chili'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.isVeg ? 'bg-cardamom' : 'bg-chili'
              }`}
            />
          </span>
        </div>

        <div className="flex flex-col">
          <p className="font-body text-xs uppercase tracking-[0.15em] text-cardamom font-semibold mb-2">
            {product.category?.replace('_', ' ')}
          </p>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink dark:text-text-dark leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mt-4">
            {product.averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <Star size={16} className="fill-turmeric text-turmeric" />
                <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="font-body text-sm text-ink/40 dark:text-text-dark/40">
                  ({product.totalReviews} reviews)
                </span>
              </div>
            )}

            {dots > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <Flame
                      key={i}
                      size={14}
                      className={
                        i <= dots
                          ? 'text-chili fill-chili'
                          : 'text-ink/10 dark:text-text-dark/10'
                      }
                    />
                  ))}
                </div>
                <span className="font-body text-xs text-ink/50 dark:text-text-dark/50">
                  {spiceLabel[product.spiceLevel]}
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-ink/10 dark:bg-border-dark my-6" />

          <p className="font-body text-ink/70 dark:text-text-dark/70 leading-relaxed">
            {product.description}
          </p>

          <div className="mt-auto pt-8">
            <div className="flex items-center justify-between mb-5">
              <span className="font-display text-2xl font-bold text-ink dark:text-text-dark">
                Rs. {product.price}
              </span>

              <div className="flex items-center gap-4 bg-clay-light dark:bg-card-dark rounded-full px-2 py-1.5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-ink dark:text-text-dark hover:bg-cream dark:hover:bg-surface-dark transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="font-body font-semibold text-ink dark:text-text-dark w-4 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-ink dark:text-text-dark hover:bg-cream dark:hover:bg-surface-dark transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className="w-full flex items-center justify-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold py-4 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShoppingBag size={18} />
              {product.isAvailable
                ? `Add to cart - Rs. ${product.price * quantity}`
                : 'Currently unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 md:gap-16">
      <div className="aspect-square bg-clay-light dark:bg-card-dark rounded-lg animate-pulse" />
      <div className="flex flex-col gap-4">
        <div className="h-3 w-24 bg-clay-light dark:bg-card-dark rounded animate-pulse" />
        <div className="h-9 w-3/4 bg-clay-light dark:bg-card-dark rounded animate-pulse" />
        <div className="h-4 w-1/2 bg-clay-light dark:bg-card-dark rounded animate-pulse" />
        <div className="h-24 w-full bg-clay-light dark:bg-card-dark rounded animate-pulse mt-4" />
      </div>
    </div>
  )
}

export default ProductDetail