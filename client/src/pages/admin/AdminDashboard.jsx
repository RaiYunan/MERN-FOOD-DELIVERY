import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchOrderStats, fetchAllOrders } from '@/features/admin/adminSlice'
import { Link } from 'react-router-dom'
import {
  ShoppingBag,
  BadgeDollarSign,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
} from 'lucide-react'

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

const PAYMENT_STATUS_CLS = {
  pending: 'text-turmeric',
  paid:    'text-cardamom',
  failed:  'text-chili',
}

const PAYMENT_STATUS_LABEL = { pending: 'Unpaid', paid: 'Paid', failed: 'Failed' }

function relativeDate(str) {
  const diff  = Date.now() - new Date(str)
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  return new Date(str).toLocaleDateString('en-NP', { day: 'numeric', month: 'short' })
}

function StatCard({ label, value, icon: Icon, sub }) {
  return (
    <div className="bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm px-6 py-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold">
          {label}
        </p>
        <Icon size={16} className="text-chili shrink-0" strokeWidth={1.75} />
      </div>
      <p className="font-display text-3xl font-bold text-ink dark:text-text-dark">{value}</p>
      {sub && (
        <p className="font-body text-xs text-ink/40 dark:text-text-dark/40 mt-1">{sub}</p>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const dispatch = useAppDispatch()
  const { stats, statsStatus, orders, status } = useAppSelector((s) => s.admin)

  useEffect(() => {
    dispatch(fetchOrderStats())
    dispatch(fetchAllOrders({ limit: 8, page: 1 }))
  }, [dispatch])

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-1">
          Overview
        </p>
        <h1 className="font-display text-4xl font-bold text-ink dark:text-text-dark">
          Dashboard
        </h1>
      </div>

      {statsStatus === 'loading' && (
        <div className="flex items-center gap-3 py-12">
          <div className="w-5 h-5 border-2 border-chili border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">Loading stats…</p>
        </div>
      )}

      {stats && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            <StatCard
              label="Total orders"
              value={stats.totalOrders}
              icon={ShoppingBag}
            />
            <StatCard
              label="Revenue"
              value={`Rs. ${stats.totalRevenue.toLocaleString('en-NP')}`}
              icon={BadgeDollarSign}
              sub="From paid orders"
            />
            <StatCard
              label="Pending"
              value={stats.byStatus?.pending || 0}
              icon={Clock}
              sub="Need attention"
            />
            <StatCard
              label="Delivered"
              value={stats.byStatus?.delivered || 0}
              icon={CheckCircle2}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-3 mb-8">
            <div className="bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm px-6 py-5">
              <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-4">
                Orders by status
              </p>
              <div className="space-y-3">
                {Object.entries(STATUS_LABEL).map(([key, label]) => {
                  const count = stats.byStatus?.[key] || 0
                  const pct = stats.totalOrders > 0
                    ? Math.round((count / stats.totalOrders) * 100)
                    : 0
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${STATUS_DOT[key]}`} />
                          <span className="font-body text-sm text-ink/70 dark:text-text-dark/70">
                            {label}
                          </span>
                        </div>
                        <span className="font-body text-sm font-semibold text-ink dark:text-text-dark tabular-nums">
                          {count}
                        </span>
                      </div>
                      <div className="h-1 bg-clay-light dark:bg-surface-dark rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${STATUS_DOT[key]} transition-all duration-500`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm px-6 py-5">
              <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-4">
                Quick numbers
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Cancelled',        value: stats.byStatus?.cancelled        || 0, icon: XCircle,      cls: 'text-chili'    },
                  { label: 'Out for delivery', value: stats.byStatus?.out_for_delivery || 0, icon: Truck,        cls: 'text-cardamom' },
                  { label: 'Preparing',        value: stats.byStatus?.preparing        || 0, icon: Clock,        cls: 'text-turmeric' },
                ].map(({ label, value, icon: Icon, cls }) => (
                  <div key={label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Icon size={15} className={cls} strokeWidth={1.75} />
                      <span className="font-body text-sm text-ink/70 dark:text-text-dark/70">
                        {label}
                      </span>
                    </div>
                    <span className="font-body text-sm font-bold text-ink dark:text-text-dark tabular-nums">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      <div>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark">
            Recent orders
          </h2>
          <Link
            to="/admin/orders"
            className="font-body text-sm font-semibold text-chili hover:text-chili-dark"
          >
            View all →
          </Link>
        </div>

        {status === 'loading' && (
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 py-6">Loading…</p>
        )}

        {orders.length > 0 && (
          <div className="border border-clay dark:border-border-dark rounded-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-clay dark:border-border-dark bg-clay-light/50 dark:bg-surface-dark">
                    {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'When'].map((h) => (
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
                  {orders.map((order, idx) => {
                    const ps = PAYMENT_STATUS_CLS[order.paymentStatus] || 'text-turmeric'
                    return (
                      <tr
                        key={order._id}
                        className={`border-b border-clay/50 dark:border-border-dark last:border-0 ${
                          idx % 2 === 0
                            ? 'bg-cream dark:bg-card-dark'
                            : 'bg-clay-light/20 dark:bg-surface-dark/50'
                        }`}
                      >
                        <td className="px-4 py-3 font-body text-sm font-bold text-ink dark:text-text-dark whitespace-nowrap">
                          #{order._id.slice(-6).toUpperCase()}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-ink/70 dark:text-text-dark/70 whitespace-nowrap">
                          {order.user?.name || '—'}
                        </td>
                        <td className="px-4 py-3 font-body text-sm text-ink/60 dark:text-text-dark/60 max-w-45 truncate">
                          {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                        </td>
                        <td className="px-4 py-3 font-body text-sm font-semibold text-ink dark:text-text-dark whitespace-nowrap">
                          Rs. {order.totalAmount.toLocaleString('en-NP')}
                        </td>
                        <td className={`px-4 py-3 font-body text-xs font-semibold whitespace-nowrap ${ps}`}>
                          {PAYMENT_STATUS_LABEL[order.paymentStatus] || '—'}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 font-body text-xs font-semibold">
                            <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status] || 'bg-clay'}`} />
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-body text-xs text-ink/40 dark:text-text-dark/40 whitespace-nowrap">
                          {relativeDate(order.createdAt)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}