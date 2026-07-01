import { useEffect, useState } from 'react'
import { Star, Pencil, Trash2 } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
} from '@/features/review/reviewSlice'

function StarRating({ value, onChange, size = 20, readOnly = false }) {
  const [hover, setHover] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = readOnly ? star <= value : star <= (hover || value)
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => !readOnly && setHover(star)}
            onMouseLeave={() => !readOnly && setHover(0)}
            className={readOnly ? 'cursor-default' : 'cursor-pointer'}
            aria-label={`${star} star`}
          >
            <Star
              size={size}
              className={
                filled
                  ? 'fill-turmeric text-turmeric'
                  : 'text-ink/15 dark:text-text-dark/15'
              }
            />
          </button>
        )
      })}
    </div>
  )
}

function ReviewForm({ productId, existingReview, onDone }) {
  const dispatch = useAppDispatch()
  const [rating, setRating] = useState(existingReview?.rating || 0)
  const [comment, setComment] = useState(existingReview?.comment || '')
  const { actionStatus } = useAppSelector((state) => state.review)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rating) return

    if (existingReview) {
      await dispatch(
        updateReview({ id: existingReview._id, productId, rating, comment })
      )
    } else {
      await dispatch(createReview({ productId, rating, comment }))
      setRating(0)
      setComment('')
    }
    onDone?.()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-clay-light dark:bg-card-dark rounded-lg p-5"
    >
      <p className="font-body text-sm font-semibold text-ink dark:text-text-dark mb-3">
        {existingReview ? 'Edit your review' : 'Rate this dish'}
      </p>

      <StarRating value={rating} onChange={setRating} size={24} />

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share a few words about it..."
        maxLength={500}
        rows={3}
        required
        className="w-full mt-4 bg-cream dark:bg-surface-dark rounded-sm p-3 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 dark:placeholder:text-text-dark/30 border border-ink/10 dark:border-border-dark focus:outline-none focus:border-chili resize-none"
      />

      <div className="flex items-center gap-3 mt-4">
        <button
          type="submit"
          disabled={!rating || actionStatus === 'loading'}
          className="bg-ink dark:bg-chili text-cream font-body text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {existingReview ? 'Update review' : 'Post review'}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={onDone}
            className="font-body text-sm font-medium text-ink/50 dark:text-text-dark/50 hover:text-ink dark:hover:text-text-dark"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

function avatarUrl(avatar) {
  if (!avatar) return null
  return avatar.startsWith('http')
    ? avatar
    : `${import.meta.env.VITE_SOCKET_URL}${avatar}`
}

function ReviewSection({ productId }) {
  const dispatch = useAppDispatch()
  const [editingId, setEditingId] = useState(null)

  const { items, averageRating, totalReviews, status } = useAppSelector(
    (state) => state.review
  )
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(getProductReviews(productId))
  }, [dispatch, productId])

  const myReview = items.find((r) => r.user._id === user?._id)

  const handleDelete = (id) => {
    if (!window.confirm('Delete this review?')) return
    dispatch(deleteReview({ id, productId }))
  }

  return (
    <div className="max-w-5xl mx-auto px-6 pb-16">
      <div className="h-px bg-ink/10 dark:bg-border-dark mb-10" />

      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl font-bold text-ink dark:text-text-dark">
          Reviews
        </h2>
        {totalReviews > 0 && (
          <div className="flex items-center gap-1.5">
            <Star size={16} className="fill-turmeric text-turmeric" />
            <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
              {averageRating.toFixed(1)}
            </span>
            <span className="font-body text-sm text-ink/40 dark:text-text-dark/40">
              ({totalReviews})
            </span>
          </div>
        )}
      </div>

      {isAuthenticated && !myReview && (
        <div className="mb-8">
          <ReviewForm productId={productId} />
        </div>
      )}

      {isAuthenticated && myReview && editingId === myReview._id && (
        <div className="mb-8">
          <ReviewForm
            productId={productId}
            existingReview={myReview}
            onDone={() => setEditingId(null)}
          />
        </div>
      )}

      {status === 'loading' && (
        <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">
          Loading reviews...
        </p>
      )}

      {status === 'succeeded' && items.length === 0 && (
        <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">
          No reviews yet. Be the first to share your thoughts.
        </p>
      )}

      <div className="flex flex-col gap-5 mt-2">
        {items
          .filter((r) => editingId !== r._id)
          .map((review) => (
            <div
              key={review._id}
              className="border-b border-ink/10 dark:border-border-dark pb-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-clay-light dark:bg-card-dark flex items-center justify-center font-body text-sm font-semibold text-ink dark:text-text-dark overflow-hidden">
                    {review.user.avatar ? (
                      <img
                        src={avatarUrl(review.user.avatar)}
                        alt={review.user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      review.user.name?.[0]?.toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                      {review.user.name}
                    </p>
                    <StarRating value={review.rating} readOnly size={13} />
                  </div>
                </div>

                {user?._id === review.user._id && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingId(review._id)}
                      className="text-ink/40 dark:text-text-dark/40 hover:text-ink dark:hover:text-text-dark"
                      aria-label="Edit review"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(review._id)}
                      className="text-ink/40 dark:text-text-dark/40 hover:text-chili"
                      aria-label="Delete review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                )}
              </div>

              <p className="font-body text-sm text-ink/70 dark:text-text-dark/70 leading-relaxed mt-3">
                {review.comment}
              </p>
            </div>
          ))}
      </div>
    </div>
  )
}

export default ReviewSection