import Order from '../models/order.model.js'
import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import { getIO } from '../socket/index.js'

// Place order from cart 
export const placeOrder = asyncHandler(async (req, res) => {
  const { deliveryAddress, paymentMethod, note } = req.body

  const { street, city, phone } = deliveryAddress ?? {}
  if (!street || !city || !phone) {
    throw new ApiError(400, 'Delivery address (street, city, phone) is required')
  }

  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name image price isAvailable'
  )

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty')
  }

  const unavailable = cart.items.filter((item) => !item.product.isAvailable)
  if (unavailable.length > 0) {
    const names = unavailable.map((i) => i.product.name).join(', ')
    throw new ApiError(400, `These items are no longer available: ${names}`)
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    name: item.product.name,
    image: item.product.image,
    price: item.price,
    quantity: item.quantity,
  }))

  const order = await Order.create({
    user: req.user._id,
    items: orderItems,
    totalAmount: cart.totalAmount,
    deliveryAddress: { street, city, phone },
    paymentMethod: paymentMethod || 'cash',
    note: note || '',
  })

  cart.items = []
  await cart.save()

  await order.populate('user', 'name email phone')

  getIO().to('admins').emit('newOrder', {
    orderId: order._id,
    customerName: order.user.name,
    totalAmount: order.totalAmount,
    itemCount: order.items.length,
    createdAt: order.createdAt,
  })

  res.status(201).json({ success: true, order })
})

// Get my orders 
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({
    createdAt: -1,
  })

  res.status(200).json({
    success: true,
    count: orders.length,
    orders,
  })
})

// Get single order (only user can see own)
export const getMyOrder = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  })

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  res.status(200).json({ success: true, order })
})

// Cancel my order
export const cancelMyOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body

  const order = await Order.findOne({
    _id: req.params.id,
    user: req.user._id,
  })

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  const cancellableStatuses = ['pending', 'confirmed']
  if (!cancellableStatuses.includes(order.status)) {
    throw new ApiError(
      400,
      `Order cannot be cancelled once it is ${order.status}`
    )
  }

  order.status = 'cancelled'
  order.cancelledAt = Date.now()
  order.cancelReason = reason || 'Cancelled by user'

  await order.save()

  getIO().to('admins').emit('orderCancelled', {
    orderId: order._id,
    reason: order.cancelReason,
  })

  res.status(200).json({
    success: true,
    message: 'Order cancelled successfully',
    order,
  })
})

//  Admin — get all orders
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query

  const filter = {}
  if (status) filter.status = status

  const skip = (page - 1) * limit

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Order.countDocuments(filter),
  ])

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    totalPages: Math.ceil(total / limit),
    count: orders.length,
    orders,
  })
})

// Admin — get single order
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email phone address'
  )

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  res.status(200).json({ success: true, order })
})

// Admin — update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body

  const validStatuses = [
    'pending',
    'confirmed',
    'preparing',
    'out_for_delivery',
    'delivered',
    'cancelled',
  ]

  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`)
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  if (order.status === 'cancelled') {
    throw new ApiError(400, 'Cannot update a cancelled order')
  }

  if (order.status === 'delivered') {
    throw new ApiError(400, 'Cannot update a delivered order')
  }

  order.status = status

  if (status === 'delivered') {
    order.deliveredAt = Date.now()
    order.paymentStatus = 'paid'
  }

  if (status === 'cancelled') {
    order.cancelledAt = Date.now()
    order.cancelReason = req.body.cancelReason || 'Cancelled by admin'
  }

  await order.save()

  getIO().to(`user:${order.user}`).emit('orderStatusUpdate', {
    orderId: order._id,
    status: order.status,
    deliveredAt: order.deliveredAt,
  })

  getIO().to(`order:${order._id}`).emit('orderStatusUpdate', {
    orderId: order._id,
    status: order.status,
    deliveredAt: order.deliveredAt,
  })

  res.status(200).json({
    success: true,
    message: `Order status updated to ${status}`,
    order,
  })
})

// Admin — update payment status
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const { paymentStatus } = req.body

  const validStatuses = ['pending', 'paid', 'failed']
  if (!validStatuses.includes(paymentStatus)) {
    throw new ApiError(400, `Invalid payment status. Must be one of: ${validStatuses.join(', ')}`)
  }

  const order = await Order.findById(req.params.id)
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  order.paymentStatus = paymentStatus
  await order.save()

  res.status(200).json({
    success: true,
    message: `Payment status updated to ${paymentStatus}`,
    order,
  })
})

// Admin — dashboard stats
export const getOrderStats = asyncHandler(async (req, res) => {
  const [statusStats, revenueStats, totalOrders] = await Promise.all([
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
    ]),
    Order.countDocuments(),
  ])

  const stats = {
    totalOrders,
    totalRevenue: revenueStats[0]?.totalRevenue || 0,
    byStatus: statusStats.reduce((acc, cur) => {
      acc[cur._id] = cur.count
      return acc
    }, {}),
  }

  res.status(200).json({ success: true, stats })
})