import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { verifyOTP, forgotPassword } from '@/features/auth/authSlice'
import toast from 'react-hot-toast'

function VerifyOTP() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { status } = useAppSelector((s) => s.auth)

  const email = location.state?.email || ''
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [resending, setResending] = useState(false)
  const [cooldown, setCooldown] = useState(0)
  const refs = useRef([])
  const isLoading = status === 'loading'

  useEffect(() => {
    if (!email) navigate('/forgot-password')
  }, [email, navigate])

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  const handleDigit = (idx, val) => {
    if (!/^\d?$/.test(val)) return
    const next = [...digits]
    next[idx] = val
    setDigits(next)
    if (val && idx < 5) refs.current[idx + 1]?.focus()
  }

  const handleKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      refs.current[idx - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    const next = pasted.split('').concat(Array(6).fill('')).slice(0, 6)
    setDigits(next)
    refs.current[Math.min(pasted.length, 5)]?.focus()
    e.preventDefault()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otp = digits.join('')
    if (otp.length < 6) return
    const result = await dispatch(verifyOTP({ email, otp }))
    if (verifyOTP.fulfilled.match(result)) {
      toast.success('OTP verified')
      navigate('/reset-password', { state: { email, otp } })
    } else {
      toast.error(result.payload || 'Invalid OTP')
      setDigits(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    }
  }

  const handleResend = async () => {
    setResending(true)
    const result = await dispatch(forgotPassword(email))
    setResending(false)
    if (forgotPassword.fulfilled.match(result)) {
      toast.success('New OTP sent')
      setCooldown(60)
      setDigits(['', '', '', '', '', ''])
      refs.current[0]?.focus()
    } else {
      toast.error('Failed to resend OTP')
    }
  }

  const otp = digits.join('')

  return (
    <div className="min-h-screen bg-cream dark:bg-surface-dark flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 border border-ink/10 dark:border-border-dark rounded-sm overflow-hidden shadow-[0_1px_0_0_rgba(26,20,16,0.05)]">
        <div className="hidden md:flex flex-col justify-between bg-ink dark:bg-card-dark text-cream p-10 relative overflow-hidden">
          <div className="relative z-10">
            <Link to="/" className="font-display text-xl font-bold">Khaja.</Link>
          </div>
          <div className="relative z-10">
            <p className="font-body text-sm uppercase tracking-[0.2em] text-cream/60 mb-4">
              Verification
            </p>
            <h2 className="font-display text-4xl font-bold leading-[1.05]">
              Check your inbox — the code is waiting.
            </h2>
          </div>
          <div className="relative z-10 font-body text-cream/50 text-sm">
            Sent to {email}
          </div>
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full border-20 border-cream/5" />
        </div>

        <div className="bg-cream dark:bg-surface-dark p-8 md:p-10 flex flex-col justify-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center gap-1.5 font-body text-sm text-ink/50 dark:text-text-dark/50 hover:text-chili mb-8 w-fit"
          >
            <ArrowLeft size={15} /> Back
          </Link>

          <h1 className="font-display text-3xl font-bold text-ink dark:text-text-dark mb-1">
            Enter the code
          </h1>
          <p className="font-body text-ink/50 dark:text-text-dark/50 mb-8">
            We sent a 6-digit code to{' '}
            <span className="text-ink dark:text-text-dark font-medium">{email}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="flex gap-2 justify-between" onPaste={handlePaste}>
              {digits.map((d, idx) => (
                <input
                  key={idx}
                  ref={(el) => (refs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleDigit(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-full aspect-square text-center font-display text-2xl font-bold text-ink dark:text-text-dark bg-cream dark:bg-surface-dark border border-ink/15 dark:border-border-dark rounded-sm focus:outline-none focus:border-chili transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full bg-ink dark:bg-chili text-cream font-body font-semibold py-3.5 rounded-sm hover:bg-chili dark:hover:bg-chili-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              Verify code
            </button>
          </form>

          <div className="mt-6 text-center">
            {cooldown > 0 ? (
              <p className="font-body text-sm text-ink/40 dark:text-text-dark/40">
                Resend in {cooldown}s
              </p>
            ) : (
              <button
                onClick={handleResend}
                disabled={resending}
                className="font-body text-sm text-ink/50 dark:text-text-dark/50 hover:text-chili transition-colors disabled:opacity-50"
              >
                {resending ? 'Sending…' : "Didn't get it? Resend"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyOTP