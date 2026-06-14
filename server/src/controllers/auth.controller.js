import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'
import generateOTP from '../utils/generateOTP.js'
import sendEmail from '../utils/sendEmail.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body

  const existingUser = await User.findOne({ email })
  if (existingUser) {
    throw new ApiError(400, 'Email already in use')
  }

  const user = await User.create({ name, email, password, phone })
  const token = generateToken(user._id)

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  })
})

// Login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(401, 'Invalid email or password')
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Account has been deactivated')
  }

  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password')
  }

  const token = generateToken(user._id)

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
  })
})

// Get current user
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.status(200).json({ success: true, user })
})

// Forgot Password — send OTP
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'No account with that email')
  }

  const otp = generateOTP()

  user.resetPasswordOTP = otp
  user.resetPasswordOTPExpiry = Date.now() + 10 * 60 * 1000 // 10 mins
  await user.save()

  await sendEmail({
    to: user.email,
    subject: 'Password Reset OTP',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  })

  res.status(200).json({
    success: true,
    message: 'OTP sent to your email',
  })
})

// Verify OTP
export const verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
    throw new ApiError(400, 'No OTP request found')
  }

  if (user.resetPasswordOTP !== otp) {
    throw new ApiError(400, 'Invalid OTP')
  }

  if (user.resetPasswordOTPExpiry < Date.now()) {
    throw new ApiError(400, 'OTP has expired')
  }

  res.status(200).json({
    success: true,
    message: 'OTP verified successfully',
  })
})

// Reset Password 
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body

  const user = await User.findOne({ email })
  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (
    !user.resetPasswordOTP ||
    user.resetPasswordOTP !== otp ||
    user.resetPasswordOTPExpiry < Date.now()
  ) {
    throw new ApiError(400, 'Invalid or expired OTP')
  }

  user.password = newPassword
  user.resetPasswordOTP = null
  user.resetPasswordOTPExpiry = null
  await user.save()

  res.status(200).json({
    success: true,
    message: 'Password reset successful. Please login.',
  })
})