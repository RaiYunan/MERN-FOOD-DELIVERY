import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  fetchAllUsers,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '@/features/admin/adminSlice'
import { Trash2, ShieldCheck, ShieldOff, UserCog } from 'lucide-react'

const ROLES = ['customer', 'restaurant_owner', 'admin']
const ROLE_LABEL = { customer: 'Customer', restaurant_owner: 'Restaurant owner', admin: 'Admin' }
const ROLE_CLS = {
  customer: 'text-ink/60 dark:text-text-dark/60',
  restaurant_owner: 'text-cardamom',
  admin: 'text-chili',
}

function DeleteModal({ user, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-ink/50 dark:bg-ink/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-cream dark:bg-card-dark border border-clay dark:border-border-dark rounded-sm p-7 shadow-2xl">
        <h3 className="font-display text-xl font-bold text-ink dark:text-text-dark mb-1">
          Delete {user.name}?
        </h3>
        <p className="font-body text-sm text-ink/55 dark:text-text-dark/55 mb-6">
          This permanently removes their account and all associated data.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-chili hover:bg-chili-dark text-cream font-body font-semibold text-sm py-3 rounded-sm transition-colors"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-clay dark:border-border-dark text-ink/65 dark:text-text-dark/65 font-body font-semibold text-sm py-3 rounded-sm hover:border-ink/40 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

function RoleSelect({ userId, current }) {
  const dispatch = useAppDispatch()
  const [value, setValue] = useState(current)

  const handleChange = (e) => {
    const next = e.target.value
    setValue(next)
    dispatch(updateUserRole({ id: userId, role: next }))
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={`font-body text-sm bg-transparent border border-clay dark:border-border-dark px-3 py-2 rounded-sm outline-none focus:border-chili transition-colors cursor-pointer ${ROLE_CLS[value]}`}
    >
      {ROLES.map((r) => (
        <option key={r} value={r} className="text-ink dark:text-text-dark font-normal">
          {ROLE_LABEL[r]}
        </option>
      ))}
    </select>
  )
}

function UserRow({ user, currentUserId }) {
  const dispatch = useAppDispatch()
  const [pendingDelete, setPendingDelete] = useState(false)
  const isSelf = user._id === currentUserId

  return (
    <>
      <tr className="border-b border-clay/50 dark:border-border-dark hover:bg-clay-light/25 dark:hover:bg-card-dark/40 transition-colors">
        <td className="px-4 py-3.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-sm bg-ink/8 dark:bg-white/8 flex items-center justify-center shrink-0">
              <span className="font-body text-xs font-bold text-ink/50 dark:text-text-dark/50">
                {user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="font-body text-sm font-semibold text-ink dark:text-text-dark truncate">
                {user.name}
                {isSelf && (
                  <span className="ml-2 font-body text-xs text-ink/35 dark:text-text-dark/35 font-normal">
                    (you)
                  </span>
                )}
              </p>
              <p className="font-body text-xs text-ink/45 dark:text-text-dark/45 truncate">{user.email}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3.5 font-body text-sm text-ink/60 dark:text-text-dark/60 whitespace-nowrap">
          {user.phone || '—'}
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <RoleSelect userId={user._id} current={user.role} />
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap">
          <span className={`inline-flex items-center gap-1.5 font-body text-xs font-semibold ${
            user.isActive ? 'text-cardamom' : 'text-chili'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-cardamom' : 'bg-chili'}`} />
            {user.isActive ? 'Active' : 'Banned'}
          </span>
        </td>
        <td className="px-4 py-3.5 font-body text-xs text-ink/40 dark:text-text-dark/40 whitespace-nowrap">
          {new Date(user.createdAt).toLocaleDateString('en-NP', { day: 'numeric', month: 'short', year: 'numeric' })}
        </td>
        <td className="px-4 py-3.5 whitespace-nowrap">
          <div className="flex items-center gap-1">
            <button
              disabled={isSelf}
              onClick={() => dispatch(toggleUserStatus(user._id))}
              title={user.isActive ? 'Ban user' : 'Unban user'}
              className="p-2 rounded-sm text-ink/40 dark:text-text-dark/40 hover:text-turmeric hover:bg-turmeric/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              {user.isActive ? <ShieldOff size={15} /> : <ShieldCheck size={15} />}
            </button>
            <button
              disabled={isSelf}
              onClick={() => setPendingDelete(true)}
              title="Delete user"
              className="p-2 rounded-sm text-ink/40 dark:text-text-dark/40 hover:text-chili hover:bg-chili/10 disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </td>
      </tr>

      {pendingDelete && (
        <DeleteModal
          user={user}
          onClose={() => setPendingDelete(false)}
          onConfirm={() => {
            dispatch(deleteUser(user._id))
            setPendingDelete(false)
          }}
        />
      )}
    </>
  )
}

export default function AdminUsers() {
  const dispatch = useAppDispatch()
  const { users, usersStatus } = useAppSelector((s) => s.admin)
  const { user: currentUser } = useAppSelector((s) => s.auth)
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = roleFilter ? u.role === roleFilter : true
    return matchSearch && matchRole
  })

  return (
    <div className="p-6 md:p-8">
      <div className="mb-6">
        <p className="font-body text-xs tracking-[0.2em] uppercase text-chili font-semibold mb-1">
          Manage
        </p>
        <div className="flex items-end justify-between gap-4">
          <h1 className="font-display text-4xl font-bold text-ink dark:text-text-dark">Users</h1>
          {usersStatus === 'succeeded' && (
            <p className="font-body text-sm text-ink/40 dark:text-text-dark/40 mb-1">
              {users.length} total
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 bg-cream dark:bg-card-dark border border-clay dark:border-border-dark px-4 py-2 font-body text-sm text-ink dark:text-text-dark placeholder:text-ink/30 dark:placeholder:text-text-dark/30 outline-none focus:border-chili rounded-sm transition-colors"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-cream dark:bg-card-dark border border-clay dark:border-border-dark px-4 py-2 font-body text-sm text-ink dark:text-text-dark outline-none focus:border-chili rounded-sm transition-colors cursor-pointer"
        >
          <option value="">All roles</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>{ROLE_LABEL[r]}</option>
          ))}
        </select>
      </div>

      {usersStatus === 'loading' && (
        <div className="flex items-center gap-3 py-16">
          <div className="w-5 h-5 border-2 border-chili border-t-transparent rounded-full animate-spin" />
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">Loading users…</p>
        </div>
      )}

      {usersStatus === 'succeeded' && filtered.length === 0 && (
        <div className="py-20 text-center border border-clay/50 dark:border-border-dark rounded-sm">
          <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">No users found.</p>
        </div>
      )}

      {filtered.length > 0 && (
        <div className="border border-clay dark:border-border-dark rounded-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-clay dark:border-border-dark bg-clay-light/50 dark:bg-surface-dark">
                  {['User', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
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
                {filtered.map((user) => (
                  <UserRow key={user._id} user={user} currentUserId={currentUser?._id} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}