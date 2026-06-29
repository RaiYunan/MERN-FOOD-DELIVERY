import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { resetPassword } from '@/features/auth/authSlice'
import toast from 'react-hot-toast'

function ResetPassword() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useAppSelector((s) => s.auth)

  const email = location.state?.email || ''
  const otp   = location.state?.otp   || ''

  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [showConf, setShowConf]   = useState(false)
  const isLoading = status === 'loading'

  const passwordError = password && password.length < 6
    ? 'At least 6 characters'
    : null
  const confirmError = confirm && confirm !== password
    ? 'Passwords do not match'
    : null
  const canSubmit = password.length >= 6 && password === confirm && !isLoading

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!canSubmit) return
    const result = await dispatch(resetPassword({ email, otp, newPassword: password }))
    if (resetPassword.fulfilled.match(result)) {
      toast.success('Password reset — please log in')
      navigate('/login')
    } else {
      toast.error(result.payload || 'Something went wrong')
    }
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 border border-ink/10 dark:border-border-dark rounded-sm overflow-hidden shadow-[0_1px_0_0_rgba(26,20,16,0.05)]">
        <div className="hidden md:flex flex-col justify-between bg-ink dark:bg-card-dark text-cream p-10 relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="font-display text-xl font-bold">Khaja.</Link>
          </div>
          <div className="relative z-10">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-cream/60 mb-4">
              Almost there
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.05]">
              Set a new password and you're done.
            </h2>
          </div>
          <div className="relative z-10 font-body text-cream/50 text-sm">
            Make it something you'll remember.
          </div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full border-20 border-cream/5" />
        </div>

        <div className="bg-cream dark:bg-surface-dark p-8 md:p-10 flex flex-col justify-center">
          <Link
            to="/verify-otp"
            className="inline-flex items-center gap-1.5 font-body text-sm text-ink/50 dark:text-text-dark/50 hover:text-chili mb-8 w-fit"
          >
            <ArrowLeft size={15} /> Back
          </Link>

          <h1 className="font-display text-3xl font-bold text-ink dark:text-text-dark mb-1">
            New password
          </h1>
          <p className="font-body text-ink/50 dark:text-text-dark/50 mb-8">
            Must be at least 6 characters.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 mb-1.5 block">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full font-body bg-cream dark:bg-surface-dark border ${
                    passwordError ? 'border-chili' : 'border-ink/15 dark:border-border-dark'
                  } rounded-sm px-4 py-3 pr-11 text-ink dark:text-text-dark placeholder:text-ink/30 focus:outline-none focus:border-chili transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passwordError && (
                <p className="font-body text-xs text-chili mt-1.5">{passwordError}</p>
              )}
            </div>

            <div>
              <label className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 mb-1.5 block">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showConf ? 'text' : 'password'}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full font-body bg-cream dark:bg-surface-dark border ${
                    confirmError ? 'border-chili' : 'border-ink/15 dark:border-border-dark'
                  } rounded-sm px-4 py-3 pr-11 text-ink dark:text-text-dark placeholder:text-ink/30 focus:outline-none focus:border-chili transition-colors`}
                />
                <button
                  type="button"
                  onClick={() => setShowConf((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
                  tabIndex={-1}
                >
                  {showConf ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {confirmError && (
                <p className="font-body text-xs text-chili mt-1.5">{confirmError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full bg-ink dark:bg-chili text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Reset password
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword