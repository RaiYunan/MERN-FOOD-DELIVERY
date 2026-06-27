import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  fetchAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from '@/features/admin/adminSlice'
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  MapPin,
  CreditCard,
} from 'lucide-react'

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
]

const STATUS_LABEL = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
}

const STATUS_DOT = {
  pending:          'bg-turmeric',
  confirmed:        'bg-cardamom',
  preparing:        'bg-turmeric',
  out_for_delivery: 'bg-cardamom',
  delivered:        'bg-cardamom',
  cancelled:        'bg-chili',
}

const PAYMENT_METHOD = { cash: 'Cash on delivery', khalti: 'Khalti', esewa: 'eSewa', card: 'Card' }
const PAYMENT_STATUS_OPTS  = ['pending', 'paid', 'failed']
const PAYMENT_STATUS_LABEL = { pending: 'Unpaid', paid: 'Paid', failed: 'Failed' }
const PAYMENT_STATUS_CLS   = { pending: 'text-turmeric', paid: 'text-cardamom', failed: 'text-chili' }

const FILTER_TABS = [
  { key: '', label: 'All' },
  ...ORDER_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] })),
]

function relativeDate(str) {
  const diff  = Date.now() - new Date(str)
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return new Date(str).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })
}

function StatusSelect({ orderId, current }) {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(current)

  const handleChange = (e) => {
    const next = e.target.value
    setValue(next)
    dispatch(updateOrderStatus({ id: orderId, status: next }))
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className="font-body text-sm bg-cream dark:bg-surface-dark border border-clay dark:border-border-dark text-ink dark:text-text-dark px-3 py-2 rounded-sm outline-none focus:border-chili transition-colors cursor-pointer"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
      ))}
    </select>
  )
}

function PaymentSelect({ orderId, current }) {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(current)

  const handleChange = (e) => {
    const next = e.target.value
    setValue(next)
    dispatch(updatePaymentStatus({ id: orderId, paymentStatus: next }))
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`font-body text-sm font-semibold bg-transparent border border-clay dark:border-border-dark px-3 py-2 rounded-sm outline-none focus:border-chili transition-colors cursor-pointer ${PAYMENT_STATUS_CLS[value]}`}
    >
      {PAYMENT_STATUS_OPTS.map((s) => (
        <option key={s} value={s} className="text-ink dark:text-text-dark font-normal">
          {PAYMENT_STATUS_LABEL[s]}
        </option>
      ))}
    </select>
  )
}

function OrderRow({ order }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <tr
        className="border-b border-clay/50 dark:border-border-dark hover:bg-clay-light/30 dark:hover:bg-card-dark/40 transition-colors cursor-pointer"
        onClick={() => setOpen((v) => !v)}
      >
        <td className="px-4 py-3.5 font-body text-sm font-bold text-ink dark:text-text-dark whitespace-nowrap">
          #{order._id.slice(-6).toUpperCase()}
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap">
          <p className="font-body text-sm text-ink dark:text-text-dark">{order.user?.name || '—'}</p>
          <p className="font-body text-xs text-ink/40 dark:text-text-dark/40">{order.user?.phone || ''}</p>
        </td>
        <td className="px-4 py-3.5 font-body text-sm text-ink/60 dark:text-text-dark/60 max-w-50 truncate">
          {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
        </td>
        <td className="px-4 py-3.5 font-body text-sm font-semibold text-ink dark:text-text-dark whitespace-nowrap">
          Rs. {order.totalAmount.toLocaleString('en-NP')}
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <StatusSelect orderId={order._id} current={order.status} />
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <PaymentSelect orderId={order._id} current={order.paymentStatus} />
        </td>
        <td className="px-4 py-3.5 font-body text-xs text-ink/40 dark:text-text-dark/40 whitespace-nowrap">
          {relativeDate(order.createdAt)}
        </td>
        <td className="px-4 py-3.5 text-ink/30 dark:text-text-dark/30">
          {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </td>
      </tr>

      {open && (
        <tr className="border-b border-clay/40 dark:border-border-dark">
          <td colSpan={8} className="bg-clay-light/30 dark:bg-card-dark/50 px-6 py-5">
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-3">
                  Items
                </p>
                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between gap-4">
                      <span className="font-body text-sm text-ink/80 dark:text-text-dark/80">
                        {item.name}{' '}
                        <span className="text-ink/40 dark:text-text-dark/40">×{item.quantity}</span>
                      </span>
                      <span className="font-body text-sm font-semibold text-ink dark:text-text-dark whitespace-nowrap">
                        Rs. {(item.price * item.quantity).toLocaleString('en-NP')}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 border-t border-clay/50 dark:border-border-dark">
                    <span className="font-body text-sm font-bold text-ink dark:text-text-dark">Total</span>
                    <span className="font-body text-sm font-bold text-ink dark:text-text-dark">
                      Rs. {order.totalAmount.toLocaleString('en-NP')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-3">
                  Delivery
                </p>
                <div className="flex items-start gap-2">
                  <MapPin size={13} className="text-chili mt-0.5 shrink-0" strokeWidth={2} />
                  <div>
                    <p className="font-body text-sm text-ink dark:text-text-dark">{order.deliveryAddress.street}</p>
                    <p className="font-body text-sm text-ink/60 dark:text-text-dark/60">{order.deliveryAddress.city}</p>
                    <p className="font-body text-sm text-ink/60 dark:text-text-dark/60">{order.deliveryAddress.phone}</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-3">
                  Payment
                </p>
                <div className="flex items-start gap-2">
                  <CreditCard size={13} className="text-chili mt-0.5 shrink-0" strokeWidth={2} />
                  <p className="font-body text-sm text-ink/70 dark:text-text-dark/70">
                    {PAYMENT_METHOD[order.paymentMethod] || order.paymentMethod}
                  </p>
                </div>
                {order.note && (
                  <div className="flex items-start gap-2 mt-3">
                    <StickyNote size={13} className="text-turmeric mt-0.5 shrink-0" strokeWidth={1.75} />
                    <p className="font-body text-sm text-ink/70 dark:text-text-dark/70">{order.note}</p>
                  </div>
                )}
                {order.cancelReason && (
                  <p className="font-body text-xs text-chili mt-2">Reason: {order.cancelReason}</p>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

export default function AdminOrders() {
  const dispatch = useAppDispatch()
  const { orders, status, total, page, totalPages } = useAppSelector((s) => s.admin)
  const [activeFilter, setActiveFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    dispatch(fetchAllOrders({ status: activeFilter || undefined, page: currentPage, limit: 15 }))
  }, [dispatch, activeFilter, currentPage])

  const handleFilter = (key) => {
    setActiveFilter(key)
    setCurrentPage(1)
  }

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-1">
          Manage
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-bold text-ink dark:text-text-dark">Orders</h1>
          {status === 'succeeded' && (
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 mb-1">{total} total</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleFilter(tab.key)}
            className={`font-body text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
              activeFilter === tab.key
                ? 'bg-ink dark:bg-chili text-cream border-ink dark:border-chili'
                : 'border-clay dark:border-border-dark text-ink/60 dark:text-text-dark/60 hover:border-chili hover:text-chili'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {status === 'loading' && (
        <div className="flex items-center gap-3 py-16">
          <div className="w-5 h-5 border-2 border-chili border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">Loading orders…</p>
        </div>
      )}

      {status === 'succeeded' && orders.length === 0 && (
        <div className="py-20 text-center border border-clay/50 dark:border-border-dark rounded-sm">
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">No orders found.</p>
        </div>
      )}

      {orders.length > 0 && (
        <>
          <div className="border border-clay dark:border-border-dark rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-clay dark:border-border-dark bg-clay-light/50 dark:bg-surface-dark">
                    {['Order', 'Customer', 'Items', 'Total', 'Status', 'Payment', 'When', ''].map((h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <OrderRow key={order._id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-5">
              <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-2 border border-clay dark:border-border-dark rounded-sm text-ink/60 dark:text-text-dark/60 hover:border-chili hover:text-chili disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-2 border border-clay dark:border-border-dark rounded-sm text-ink/60 dark:text-text-dark/60 hover:border-chili hover:text-chili disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}