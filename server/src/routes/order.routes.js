import express from 'express'
import {
  placeOrder,
  getMyOrders,
  getMyOrder,
  cancelMyOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
} from '../controllers/order.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = express.Router()

// user routes
router.post('/place', protect, placeOrder)
router.get('/my-orders', protect, getMyOrders)
router.get('/my-orders/:id', protect, getMyOrder)
router.patch('/my-orders/:id/cancel', protect, cancelMyOrder)

// admin routes
router.get('/stats', protect, authorize('admin'), getOrderStats)
router.get('/', protect, authorize('admin'), getAllOrders)
router.get('/:id', protect, authorize('admin'), getOrderById)
router.patch('/:id/status', protect, authorize('admin'), updateOrderStatus)
router.patch('/:id/payment', protect, authorize('admin'), updatePaymentStatus)

export default router