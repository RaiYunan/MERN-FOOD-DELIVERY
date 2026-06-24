import { useState, useEffect } from 'react'
import { User, MapPin, Phone, Mail, Edit3, Check, X, Clock, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { fetchMe } from '@/features/auth/authSlice'
import { getMyOrders } from '@/features/order/orderSlice'
import { logout } from '@/features/auth/authSlice'
import { Link, useNavigate } from 'react-router-dom'

const STATUS_STYLE = {
  pending:    { dot: 'bg-turmeric',   text: 'text-turmeric',   label: 'Pending'    },
  confirmed:  { dot: 'bg-cardamom',   text: 'text-cardamom',   label: 'Confirmed'  },
  preparing:  { dot: 'bg-turmeric',   text: 'text-turmeric',   label: 'Preparing'  },
  delivered:  { dot: 'bg-cardamom',   text: 'text-cardamom',   label: 'Delivered'  },
  cancelled:  { dot: 'bg-chili',      text: 'text-chili',      label: 'Cancelled'  },
}

function FieldRow({ label, value, icon: Icon, editing, name, onChange, type = 'text' }) {
  return (
    <div className="flex items-start gap-4 py-5 border-b border-clay/60 dark:border-border-dark last:border-0">
      <Icon size={15} className="text-chili mt-0.5 shrink-0" strokeWidth={1.75} />
      <div className="flex-1 min-w-0">
        <p className="font-body text-xs uppercase tracking-widest text-ink/40 dark:text-text-dark/40 font-semibold mb-1">
          {label}
        </p>
        {editing ? (
          <input
            type={type}
            name={name}
            defaultValue={value}
            onChange={onChange}
            className="w-full bg-transparent font-body text-base text-ink dark:text-text-dark border-b border-chili outline-none pb-0.5"
          />
        ) : (
          <p className="font-body text-base text-ink dark:text-text-dark truncate">
            {value || <span className="text-ink/30 dark:text-text-dark/30 italic">Not set</span>}
          </p>
        )}
      </div>
    </div>
  )
}

function Profile() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, status } = useAppSelector((s) => s.auth)
  const { orders, status: orderStatus } = useAppSelector((s) => s.order)

  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  // Sync form when user loads
  useEffect(() => {
    if (!user) dispatch(fetchMe())
  }, [dispatch, user])

  useEffect(() => {
    dispatch(getMyOrders())
  }, [dispatch])

  useEffect(() => {
    if (user) {
      setForm({
        name:    user.name    || '',
        email:   user.email   || '',
        phone:   user.phone   || '',
        address: user.address || '',
      })
    }
  }, [user])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSave = () => {
    // dispatch(updateMe(form)) — wire when you add that thunk
    setEditing(false)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  if (status === 'loading' && !user) {
    return (
      <div className="min-h-screen bg-cream dark:bg-surface-dark flex items-center justify-center">
        <p className="font-body text-ink/40 dark:text-text-dark/40 text-sm">Loading…</p>
      </div>
    )
  }

  const initials = form.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '?'

  const recentOrders = orders.slice(0, 3)
  const totalSpent = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)

  // Most ordered item name (rough heuristic from flat items array)
  const allItemNames = orders.flatMap((o) =>
    o.items?.map((i) => i.product?.name || i.name || '') || []
  )
  const favourite = allItemNames.length
    ? Object.entries(
        allItemNames.reduce((acc, n) => ({ ...acc, [n]: (acc[n] || 0) + 1 }), {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : '—'

  return (
    <div className="bg-cream dark:bg-surface-dark min-h-screen transition-colors">
      {/* ── Header ── */}
      <section className="border-b border-clay dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 pt-16 pb-12 flex flex-col md:flex-row md:items-end gap-8">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-sm bg-ink dark:bg-chili flex items-center justify-center">
              <span className="font-display text-3xl font-bold text-cream tracking-tight">
                {initials}
              </span>
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full bg-chili border-2 border-cream dark:border-surface-dark" />
          </div>

          <div className="flex-1">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-2">
              Your profile
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-ink dark:text-text-dark leading-[1.05] tracking-tight">
              {form.name || 'Hello there'}
            </h1>
            {user?.createdAt && (
              <p className="font-body text-ink/50 dark:text-text-dark/50 text-sm mt-1">
                Member since {new Date(user.createdAt).toLocaleDateString('en-NP', { month: 'long', year: 'numeric' })} · Dharan
              </p>
            )}
          </div>

          <div className="flex gap-2 shrink-0">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-1.5 bg-ink dark:bg-chili text-cream font-body text-sm font-semibold px-5 py-2.5 rounded-sm hover:bg-chili transition-colors"
                >
                  <Check size={15} /> Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center gap-1.5 border border-clay dark:border-border-dark text-ink/60 dark:text-text-dark/60 font-body text-sm font-semibold px-4 py-2.5 rounded-sm hover:border-ink/40 transition-colors"
                >
                  <X size={15} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 border border-clay dark:border-border-dark text-ink/70 dark:text-text-dark/70 font-body text-sm font-semibold px-5 py-2.5 rounded-sm hover:border-chili hover:text-chili transition-colors"
              >
                <Edit3 size={14} /> Edit details
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid md:grid-cols-[1fr_1.1fr] gap-12 items-start">
        {/* Left — account info */}
        <div>
          <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark mb-1">
            Account details
          </h2>
          <div className="h-0.5 w-8 bg-chili mb-6" style={{ maskImage: 'linear-gradient(90deg, black 0%, transparent 100%)' }} />

          <div className="bg-clay-light/40 dark:bg-card-dark/50 border border-clay/60 dark:border-border-dark rounded-sm px-6">
            <FieldRow label="Full name"         value={form.name}    icon={User}    editing={editing} name="name"    onChange={handleChange} />
            <FieldRow label="Email"             value={form.email}   icon={Mail}    editing={editing} name="email"   onChange={handleChange} type="email" />
            <FieldRow label="Phone"             value={form.phone}   icon={Phone}   editing={editing} name="phone"   onChange={handleChange} type="tel" />
            <FieldRow label="Delivery address"  value={form.address} icon={MapPin}  editing={editing} name="address" onChange={handleChange} />
          </div>

          {/* Stat strip */}
          <div className="mt-8 grid grid-cols-3 gap-px bg-clay/40 dark:bg-border-dark border border-clay/60 dark:border-border-dark">
            {[
              { label: 'Orders',    value: orders.length },
              { label: 'Spent',     value: `Rs. ${totalSpent.toLocaleString('en-NP')}` },
              { label: 'Favourite', value: favourite.split(' ')[0] || '—' },
            ].map((stat) => (
              <div key={stat.label} className="bg-cream dark:bg-surface-dark px-4 py-5">
                <p className="font-display text-2xl font-bold text-ink dark:text-text-dark truncate">
                  {stat.value}
                </p>
                <p className="font-body text-xs uppercase tracking-wider text-ink/40 dark:text-text-dark/40 font-semibold mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — recent orders */}
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h2 className="font-display text-xl font-semibold text-ink dark:text-text-dark">
              Recent orders
            </h2>
            <Link to="/orders" className="font-body text-sm font-semibold text-chili hover:text-chili-dark hidden md:inline">
              All orders →
            </Link>
          </div>
          <div className="h-0.5 w-8 bg-chili mb-6" style={{ maskImage: 'linear-gradient(90deg, black 0%, transparent 100%)' }} />

          {orderStatus === 'loading' && (
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 py-8 text-center">
              Loading orders…
            </p>
          )}

          {orderStatus === 'succeeded' && recentOrders.length === 0 && (
            <div className="border border-clay/60 dark:border-border-dark rounded-sm px-6 py-10 text-center">
              <ShoppingBag size={28} className="text-ink/20 dark:text-text-dark/20 mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-body text-sm text-ink/50 dark:text-text-dark/50">No orders yet.</p>
              <Link to="/menu" className="font-body text-sm font-semibold text-chili hover:text-chili-dark mt-2 inline-block">
                Browse the menu →
              </Link>
            </div>
          )}

          {recentOrders.length > 0 && (
            <div className="space-y-3">
              {recentOrders.map((order) => {
                const s = STATUS_STYLE[order.status] || STATUS_STYLE.pending
                const itemSummary = order.items
                  ?.map((i) => `${i.product?.name || i.name} ×${i.quantity}`)
                  .join(', ')

                return (
                  <Link
                    to="/orders"
                    key={order._id}
                    className="group flex items-start gap-4 bg-clay-light/40 dark:bg-card-dark/50 border border-clay/60 dark:border-border-dark px-5 py-5 hover:border-chili/40 transition-colors rounded-sm"
                  >
                    <div className="w-9 h-9 rounded-sm bg-ink/5 dark:bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                      <ShoppingBag size={16} className="text-ink/40 dark:text-text-dark/40" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`font-body text-xs font-semibold flex items-center gap-1.5 ${s.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                          {s.label}
                        </span>
                      </div>
                      <p className="font-body text-sm text-ink/60 dark:text-text-dark/60 truncate">
                        {itemSummary}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="font-body text-sm font-semibold text-ink dark:text-text-dark">
                          Rs. {order.totalAmount?.toLocaleString('en-NP')}
                        </span>
                        <span className="font-body text-xs text-ink/40 dark:text-text-dark/40 flex items-center gap-1">
                          <Clock size={11} />
                          {new Date(order.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-ink/20 dark:text-text-dark/20 group-hover:text-chili transition-colors shrink-0 mt-1" />
                  </Link>
                )
              })}
            </div>
          )}

          {recentOrders.length > 0 && (
            <div className="mt-6 border-l-2 border-chili pl-5 py-1">
              <p className="font-body text-sm text-ink/60 dark:text-text-dark/60">
                Last order was{' '}
                <span className="text-ink dark:text-text-dark font-semibold">
                  {recentOrders[0]?.items?.[0]?.product?.name || recentOrders[0]?.items?.[0]?.name || 'your order'}
                </span>{' '}
                — want to go again?
              </p>
              <Link to="/menu" className="font-body text-sm font-semibold text-chili hover:text-chili-dark mt-1 inline-block">
                Back to menu →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Danger zone ── */}
      <section className="border-t border-clay dark:border-border-dark">
        <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-body text-xs font-semibold text-ink/40 dark:text-text-dark/40 uppercase tracking-widest mb-1">
              Account
            </p>
            <p className="font-body text-sm text-ink/60 dark:text-text-dark/50">
              Need to step away? You can log out or delete your account at any time.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={handleLogout}
              className="font-body text-sm font-semibold text-ink/60 dark:text-text-dark/60 hover:text-ink dark:hover:text-text-dark px-4 py-2.5 border border-clay dark:border-border-dark rounded-sm hover:border-ink/40 transition-colors"
            >
              Log out
            </button>
            <button className="font-body text-sm font-semibold text-chili/70 hover:text-chili px-4 py-2.5 border border-chili/20 rounded-sm hover:border-chili/50 transition-colors">
              Delete account
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile