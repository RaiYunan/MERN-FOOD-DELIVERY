import User from '../models/user.model.js'
import generateToken from '../utils/generateToken.js'

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