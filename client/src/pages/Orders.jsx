import { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { getMyOrders, cancelOrder } from '@/features/order/orderSlice'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  Clock,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  StickyNote,
  CreditCard,
  CheckCircle2,
} from 'lucide-react'

// Status config
const STATUS = {
  pending:          { label: 'Pending',          dot: 'bg-turmeric',  text: 'text-turmeric',  pill: 'bg-turmeric/10 text-turmeric'   },
  confirmed:        { label: 'Confirmed',         dot: 'bg-cardamom',  text: 'text-cardamom',  pill: 'bg-cardamom/10 text-cardamom'   },
  preparing:        { label: 'Preparing',         dot: 'bg-turmeric',  text: 'text-turmeric',  pill: 'bg-turmeric/10 text-turmeric'   },
  out_for_delivery: { label: 'Out for delivery',  dot: 'bg-cardamom',  text: 'text-cardamom',  pill: 'bg-cardamom/10 text-cardamom'   },
  delivered:        { label: 'Delivered',         dot: 'bg-cardamom',  text: 'text-cardamom',  pill: 'bg-cardamom/10 text-cardamom'   },
  cancelled:        { label: 'Cancelled',         dot: 'bg-chili',     text: 'text-chili',     pill: 'bg-chili/10 text-chili'         },
}

const PAYMENT_METHOD = { cash: 'Cash on delivery', khalti: 'Khalti', esewa: 'eSewa', card: 'Card' }
const PAYMENT_STATUS  = {
  pending: { label: 'Unpaid',  cls: 'text-turmeric' },
  paid:    { label: 'Paid',    cls: 'text-cardamom' },
  failed:  { label: 'Failed',  cls: 'text-chili'    },
}

const FILTER_TABS = [
  { key: 'all',              label: 'All'              },
  { key: 'pending',          label: 'Pending'          },
  { key: 'confirmed',        label: 'Confirmed'        },
  { key: 'preparing',        label: 'Preparing'        },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered',        label: 'Delivered'        },
  { key: 'cancelled',        label: 'Cancelled'        },
]

const CANCELLABLE = ['pending', 'confirmed']

// Relative date
function relativeDate(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7)   return `${days} days ago`
  return new Date(dateStr).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })
}

// Cancel modal
function CancelModal({ orderId, onClose, onConfirm }) {
  const [reason, setReason] = useState('')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-sm bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm p-7 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark mb-1">
          Cancel this order?
        </h3>
        <p className="font-body text-sm text-ink/55 dark:text-text-dark/55 mb-5">
          This can't be undone. A reason helps us improve.
        </p>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="What went wrong? (optional)"
          rows={3}
          className="w-full bg-clay-light/50 dark:bg-surface-dark border border-clay dark:border-border-dark px-4 py-3 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 dark:placeholder:text-text-dark/30 outline-none focus:border-chili transition-colors resize-none rounded-sm"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={() => onConfirm(reason)}
            className="flex-1 bg-chili hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors"
          >
            Yes, cancel it
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm py-3 rounded-sm hover:border-ink/40 transition-colors"
          >
            Keep order
          </button>
        </div>
      </div>
    </div>
  )
}

// Single order card
function OrderCard({ order }) {
  const dispatch = useAppDispatch()
  const [open, setOpen]           = useState(false)
  const [cancelling, setCancelling] = useState(false)

  const s  = STATUS[order.status]  || STATUS.pending
  const ps = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending
  const canCancel = CANCELLABLE.includes(order.status)

  const handleCancel = (reason) => {
    dispatch(cancelOrder({ id: order._id, reason }))
    setCancelling(false)
  }

  return (
    <>
      <article className="border border-clay/70 dark:border-border-dark bg-cream dark:bg-surface-dark rounded-sm overflow-hidden ">

        {/*Summary row */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full text-left flex items-start gap-4 px-5 py-5 hover:bg-clay-light/35 dark:hover:bg-card-dark/50 transition-colors cursor-pointer"
        >
          {/* Icon column */}
          <div className="w-9 h-9 shrink-0 rounded-sm bg-ink/5 dark:bg-white/5 flex items-center justify-center mt-0.5">
            <ShoppingBag size={16} className="text-ink/35 dark:text-text-dark/35" strokeWidth={1.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Top row */}
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-body text-sm font-bold text-ink dark:text-text-dark tracking-wide">
                #{order._id.slice(-6).toUpperCase()}
              </span>
              {/* Status pill */}
              <span className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.pill}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${s.dot} shrink-0`} />
                {s.label}
              </span>
            </div>

            {/* Item names */}
            <p className="font-body text-sm text-ink/60 dark:text-text-dark/60 truncate">
              {order.items.slice(0, 2).map((i) => `${i.name} ×${i.quantity}`).join(', ')}
              {order.items.length > 2 && (
                <span className="text-ink/40 dark:text-text-dark/40">
                  {` +${order.items.length - 2} more`}
                </span>
              )}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2">
              <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                Rs. {order.totalAmount.toLocaleString('en-NP')}
              </span>
              <span className="text-clay dark:text-border-dark text-xs">·</span>
              <span className={`font-body text-xs font-semibold ${ps.cls}`}>
                {ps.label}
              </span>
              <span className="text-clay dark:text-border-dark text-xs">·</span>
              <span className="font-body text-xs text-ink/40 dark:text-text-dark/40 flex items-center gap-1">
                <Clock size={11} />
                {relativeDate(order.createdAt)}
              </span>
            </div>
          </div>

          {/* Chevron */}
          <div className="text-ink/25 dark:text-text-dark/25 shrink-0 mt-1">
            {open ? <ChevronUp size={17} /> : <ChevronDown size={17} />}
          </div>
        </button>

        {/* Expanded detail*/}
        {open && (
          <div className="border-t border-clay/60 dark:border-border-dark bg-clay-light/25 dark:bg-card-dark/40 px-5 py-6 space-y-6">

            {/* Item breakdown */}
            <div>
              <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-3">
                Items ordered
              </p>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    {/* Qty badge */}
                    <span className="w-6 h-6 rounded-sm bg-ink/8 dark:bg-white/8 flex items-center justify-center font-body text-xs font-bold text-ink/50 dark:text-text-dark/50 shrink-0">
                      {item.quantity}
                    </span>
                    <span className="font-body text-sm text-ink dark:text-text-dark flex-1 min-w-0 truncate">
                      {item.name}
                    </span>
                    <span className="font-body text-sm font-semibold text-ink dark:text-text-dark shrink-0">
                      Rs. {(item.price * item.quantity).toLocaleString('en-NP')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Total line */}
              <div className="flex justify-between items-center pt-4 mt-4 border-t border-clay/50 dark:border-border-dark">
                <span className="font-body text-sm font-bold text-ink dark:text-text-dark">Total</span>
                <span className="font-display text-lg font-bold text-ink dark:text-text-dark">
                  Rs. {order.totalAmount.toLocaleString('en-NP')}
                </span>
              </div>
            </div>

            {/* Delivery + Payment  */}
            <div className="grid md:grid-cols-2 gap-5">
              {/* Delivery address */}
              <div className="bg-cream dark:bg-surface-dark border border-clay/60 dark:border-border-dark rounded-sm px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={13} className="text-chili" strokeWidth={2} />
                  <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold">
                    Delivery to
                  </p>
                </div>
                <p className="font-body text-sm text-ink dark:text-text-dark">{order.deliveryAddress.street}</p>
                <p className="font-body text-sm text-ink/70 dark:text-text-dark/70">{order.deliveryAddress.city}</p>
                <p className="font-body text-sm text-ink/70 dark:text-text-dark/70">{order.deliveryAddress.phone}</p>
              </div>

              {/* Payment */}
              <div className="bg-cream dark:bg-surface-dark border border-clay/60 dark:border-border-dark rounded-sm px-4 py-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={13} className="text-chili" strokeWidth={2} />
                  <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold">
                    Payment
                  </p>
                </div>
                <p className="font-body text-sm text-ink dark:text-text-dark">
                  {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod}
                </p>
                <p className={`font-body text-sm font-semibold mt-0.5 ${ps.cls}`}>
                  {ps.label}
                </p>
                {order.deliveredAt && (
                  <p className="font-body text-xs text-ink/40 dark:text-text-dark/40 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} />
                    Delivered {relativeDate(order.deliveredAt)}
                  </p>
                )}
              </div>
            </div>

            {/* Note */}
            {order.note && (
              <div className="flex items-start gap-2.5 bg-turmeric/8 dark:bg-turmeric/10 border border-turmeric/25 rounded-sm px-4 py-3">
                <StickyNote size={14} className="text-turmeric mt-0.5 shrink-0" strokeWidth={1.75} />
                <p className="font-body text-sm text-ink/75 dark:text-text-dark/75">{order.note}</p>
              </div>
            )}

            {/* Cancel reason (if cancelled) */}
            {order.status === 'cancelled' && order.cancelReason && (
              <div className="flex items-start gap-2.5 bg-chili/5 dark:bg-chili/8 border border-chili/20 rounded-sm px-4 py-3">
                <X size={14} className="text-chili mt-0.5 shrink-0" strokeWidth={2} />
                <p className="font-body text-sm text-chili/80">{order.cancelReason}</p>
              </div>
            )}

            {/* Cancel button */}
            {canCancel && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setCancelling(true)}
                  className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-chili/70 hover:text-chili border border-chili/25 hover:border-chili/55 px-4 py-2.5 rounded-sm transition-colors"
                >
                  <X size={14} />
                  Cancel order
                </button>
              </div>
            )}
          </div>
        )}
      </article>

      {cancelling && (
        <CancelModal
          orderId={order._id}
          onClose={() => setCancelling(false)}
          onConfirm={handleCancel}
        />
      )}
    </>
  )
}

// Page
export default function Orders() {
  const dispatch = useAppDispatch()
  const { orders, status, error } = useAppSelector((s) => s.order)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  const filtered =
    activeFilter === 'all'
      ? orders
      : orders.filter((o) => o.status === activeFilter)


  const countFor = (key) =>
    key === 'all' ? orders.length : orders.filter((o) => o.status === key).length

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen transition-colors">

      {/*Page header*/}
      <section className="border-b border-clay dark:border-border-dark">
        <div className="max-w-3xl mx-auto px-6 pt-16 pb-10">
          <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-3">
            Your history
          </p>
          <div className="flex items-end justify-between gap-4">
            <h1 className="font-display text-5xl font-bold text-ink dark:text-text-dark leading-none tracking-tight">
              Orders
            </h1>
            {status === 'succeeded' && orders.length > 0 && (
              <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 mb-1">
                {orders.length} total
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* Loading */}
        {status === 'loading' && (
          <div className="py-28 flex flex-col items-center gap-3">
            <div className="w-6 h-6 border-2 border-chili border-t-transparent rounded-full animate-spin" />
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">
              Fetching your orders…
            </p>
          </div>
        )}

        {/* Error*/}
        {status === 'failed' && (
          <div className="py-20 text-center">
            <p className="font-body text-sm text-chili mb-3">{error || 'Could not load orders.'}</p>
            <button
              onClick={() => dispatch(getMyOrders())}
              className="font-body text-sm font-semibold text-ink/60 dark:text-text-dark/60 hover:text-chili transition-colors"
            >
              Try again →
            </button>
          </div>
        )}

        {/* Empty state*/}
        {status === 'succeeded' && orders.length === 0 && (
          <div className="py-28 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-sm bg-ink/5 dark:bg-white/5 flex items-center justify-center mb-5">
              <ShoppingBag size={26} className="text-ink/20 dark:text-text-dark/20" strokeWidth={1.25} />
            </div>
            <h2 className="font-display text-2xl font-bold text-ink dark:text-text-dark mb-2">
              No orders yet
            </h2>
            <p className="font-body text-sm text-ink/50 dark:text-text-dark/50 max-w-xs mb-7">
              Once you place your first order it will show up here, ready to track.
            </p>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-ink dark:bg-chili text-cream font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors"
            >
              Browse the menu
            </Link>
          </div>
        )}

        {/*Has orders*/}
        {status === 'succeeded' && orders.length > 0 && (
          <>
            {/* Filter tabs*/}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-7">
              {FILTER_TABS.filter((t) => countFor(t.key) > 0 || t.key === 'all').map((tab) => {
                const count = countFor(tab.key)
                const active = activeFilter === tab.key
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveFilter(tab.key)}
                    className={`shrink-0 inline-flex items-center gap-1.5 font-body text-sm font-medium px-4 py-1.5 rounded-full border cursor-pointer transition-colors ${
                      active
                        ? 'bg-ink dark:bg-chili text-cream border-ink dark:border-chili'
                        : 'border-clay dark:border-border-dark text-ink/60 dark:text-text-dark/60 hover:border-chili hover:text-chili'
                    }`}
                  >
                    {tab.label}
                    {tab.key !== 'all' && count > 0 && (
                      <span className={`text-xs tabular-nums ${active ? 'opacity-70' : 'opacity-50'}`}>
                        {count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Empty filter state */}
            {filtered.length === 0 && (
              <div className="py-16 text-center border border-clay/50 dark:border-border-dark rounded-sm">
                <p className="font-body text-sm text-ink/45 dark:text-text-dark/45">
                  No {FILTER_TABS.find((t) => t.key === activeFilter)?.label.toLowerCase()} orders.
                </p>
                <button
                  onClick={() => setActiveFilter('all')}
                  className="font-body text-sm font-semibold text-chili hover:text-chili-dark mt-2 inline-block"
                >
                  Show all →
                </button>
              </div>
            )}

            {/* Order cards */}
            <div className="space-y-3 ">
              {filtered.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}