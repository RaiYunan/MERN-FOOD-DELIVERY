import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

function ProtectedRoute({ adminOnly = false }) {
  const { isAuthenticated, user, status } = useAppSelector((state) => state.auth)

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream dark:bg-surface-dark">
        <p className="font-body text-ink/50 dark:text-text-dark/50">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute