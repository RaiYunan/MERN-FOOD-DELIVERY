import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { forgotPassword } from '@/features/auth/authSlice'
import toast from 'react-hot-toast'

function ForgotPassword() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { status } = useAppSelector((s) => s.auth)
  const [email, setEmail] = useState('')
  const isLoading = status === 'loading'

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    const result = await dispatch(forgotPassword(email))
    if (forgotPassword.fulfilled.match(result)) {
      toast.success('OTP sent — check your inbox')
      navigate('/verify-otp', { state: { email } })
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
              Password reset
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.05]">
              Happens to everyone. Let's get you back in.
            </h2>
          </div>
          <div className="relative z-10 font-body text-cream/50 text-sm">
            We'll send a one-time code to your email.
          </div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full border-20 border-cream/5" />
        </div>

        <div className="bg-cream dark:bg-surface-dark p-8 md:p-10 flex flex-col justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 font-body text-sm text-ink/50 dark:text-text-dark/50 hover:text-chili mb-8 w-fit"
          >
            <ArrowLeft size={15} /> Back to login
          </Link>

          <h1 className="font-display text-3xl font-bold text-ink dark:text-text-dark mb-1">
            Forgot password?
          </h1>
          <p className="font-body text-ink/50 dark:text-text-dark/50 mb-8">
            Enter your email and we'll send a 6-digit code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="font-body text-sm font-medium text-ink/70 dark:text-text-dark/70 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full font-body bg-cream dark:bg-surface-dark border border-ink/15 dark:border-border-dark rounded-sm px-4 py-3 text-ink dark:text-text-dark placeholder:text-ink/30 focus:outline-none focus:border-chili transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !email}
              className="w-full bg-ink dark:bg-chili text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword