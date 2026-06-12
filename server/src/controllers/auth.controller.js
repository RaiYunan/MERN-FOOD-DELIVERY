import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'
import generateOTP from '../utils/generateOTP.js'
import sendEmail from '../utils/sendEmail.js'
import bcrypt from 'bcryptjs'

export const register = async (req, res,next) => {
  try {
    const { name, email, password, phone } = req.body

    // check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' })
    }

    // create user
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
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account has been deactivated' })
    }

    // verify password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' })
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
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}


export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({ success: true, user })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//Forgot Password send OTP
export const forgotPassword = async (req, res,next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'No account with that email' })
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
  } catch (err) {
    next(err);
    res.status(500).json({ message: err.message })
  }
}

//Verify OTP
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (!user.resetPasswordOTP || !user.resetPasswordOTPExpiry) {
      return res.status(400).json({ message: 'No OTP request found' })
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' })
    }

    if (user.resetPasswordOTPExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' })
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

//Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    if (
      !user.resetPasswordOTP ||
      user.resetPasswordOTP !== otp ||
      user.resetPasswordOTPExpiry < Date.now()
    ) {
      return res.status(400).json({ message: 'Invalid or expired OTP' })
    }

    user.password = newPassword
    user.resetPasswordOTP = null
    user.resetPasswordOTPExpiry = null
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login.',
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}