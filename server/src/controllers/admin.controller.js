import User from '../models/user.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 })

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  })
})

// Get single user
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  res.status(200).json({ success: true, user })
})

// Update user role
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body

  const allowedRoles = ['customer', 'restaurant_owner', 'admin']
  if (!allowedRoles.includes(role)) {
    throw new ApiError(400, `Role must be one of: ${allowedRoles.join(', ')}`)
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  // prevent admin from demoting themselves
  if (user._id.toString() === req.user._id.toString() && role !== 'admin') {
    throw new ApiError(400, 'You cannot change your own admin role')
  }

  user.role = role
  await user.save()

  res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  })
})

// Toggle user active status (ban/unban)
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot deactivate your own account')
  }

  user.isActive = !user.isActive
  await user.save()

  res.status(200).json({
    success: true,
    message: `User is now ${user.isActive ? 'active' : 'deactivated'}`,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
    },
  })
})

// Delete user
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    throw new ApiError(404, 'User not found')
  }

  if (user._id.toString() === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account')
  }

  await user.deleteOne()

  res.status(200).json({
    success: true,
    message: 'User deleted successfully',
  })
})