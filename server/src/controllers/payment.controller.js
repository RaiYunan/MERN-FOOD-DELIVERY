import Order from '../models/order.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import khaltiApi from '../utils/khalti.js'

// Initiate Khalti payment
export const initiateKhaltiPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.body

  const order = await Order.findOne({
    _id: orderId,
    user: req.user._id,
  })

  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  if (order.paymentStatus === 'paid') {
    throw new ApiError(400, 'Order is already paid')
  }

  if (order.status === 'cancelled') {
    throw new ApiError(400, 'Cannot pay for a cancelled order')
  }

  if (order.paymentMethod !== 'khalti') {
    throw new ApiError(400, 'Payment method for this order is not Khalti')
  }

  // Khalti requires amount in paisa (1 NPR = 100 paisa)
  const amountInPaisa = order.totalAmount * 100

  const payload = {
    return_url: `${process.env.CLIENT_URL}/payment/verify`,
    website_url: process.env.CLIENT_URL,
    amount: amountInPaisa,
    purchase_order_id: order._id.toString(),
    purchase_order_name: `Food Order #${order._id.toString().slice(-6).toUpperCase()}`,
    customer_info: {
      name: req.user.name,
      email: req.user.email,
      phone: order.deliveryAddress.phone,
    },
    amount_breakdown: order.items.map((item) => ({
      label: item.name,
      amount: item.price * item.quantity * 100,
    })),
    product_details: order.items.map((item) => ({
      identity: item.product.toString(),
      name: item.name,
      total_price: item.price * item.quantity * 100,
      quantity: item.quantity,
      unit_price: item.price * 100,
    })),
  }

  const response = await khaltiApi.post('/epayment/initiate/', payload)

  // save pidx to order for later verification
  order.khaltiPidx = response.data.pidx
  await order.save()

  res.status(200).json({
    success: true,
    pidx: response.data.pidx,
    paymentUrl: response.data.payment_url,
    message: 'Redirect user to paymentUrl',
  })
})

// Verify Khalti payment
export const verifyKhaltiPayment = asyncHandler(async (req, res) => {
  const { pidx } = req.body

  if (!pidx) {
    throw new ApiError(400, 'pidx is required')
  }

  // verify with Khalti
  const response = await khaltiApi.post('/epayment/lookup/', { pidx })

  const {
    status,
    transaction_id,
    total_amount,
    purchase_order_id,
  } = response.data

  if (status !== 'Completed') {
    throw new ApiError(400, `Payment not completed. Status: ${status}`)
  }

  // find order
  const order = await Order.findById(purchase_order_id)
  if (!order) {
    throw new ApiError(404, 'Order not found')
  }

  // verify amount matches (in paisa)
  if (total_amount !== order.totalAmount * 100) {
    throw new ApiError(400, 'Payment amount mismatch')
  }

  if (order.paymentStatus === 'paid') {
    return res.status(200).json({
      success: true,
      message: 'Order already marked as paid',
      order,
    })
  }

  // mark order as paid
  order.paymentStatus = 'paid'
  order.khaltiTransactionId = transaction_id
  order.paidAt = Date.now()
  if (order.status === 'pending') {
    order.status = 'confirmed'
  }
  await order.save()

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
    order,
  })
})

// Khalti webhook (optional but recommended)
export const khaltiWebhook = asyncHandler(async (req, res) => {
  const { pidx, status, transaction_id, purchase_order_id, total_amount } =
    req.body

  if (status !== 'Completed') {
    return res.status(200).json({ message: 'Payment not completed, ignored' })
  }

  const order = await Order.findById(purchase_order_id)
  if (!order || order.paymentStatus === 'paid') {
    return res.status(200).json({ message: 'Order not found or already paid' })
  }

  if (total_amount !== order.totalAmount * 100) {
    return res.status(400).json({ message: 'Amount mismatch' })
  }

  order.paymentStatus = 'paid'
  order.khaltiTransactionId = transaction_id
  order.khaltiPidx = pidx
  order.paidAt = Date.now()
  if (order.status === 'pending') {
    order.status = 'confirmed'
  }
  await order.save()

  res.status(200).json({ message: 'Webhook processed' })
})