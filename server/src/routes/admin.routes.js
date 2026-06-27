import express from 'express'
import {
  getAllUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/admin.controller.js'
import {
  getAllProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../controllers/product.controller.js'
import {
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  getOrderStats,
} from '../controllers/order.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'
import { uploadProduct } from '../middlewares/upload.middleware.js'

const router = express.Router()

router.use(protect, authorize('admin'))

router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.patch('/users/:id/role', updateUserRole)
router.patch('/users/:id/status', toggleUserStatus)
router.delete('/users/:id', deleteUser)

router.get('/products', getAllProductsAdmin)
router.post('/products', uploadProduct.single('image'), createProduct)
router.put('/products/:id', uploadProduct.single('image'), updateProduct)
router.patch('/products/:id/status', toggleProductStatus)
router.delete('/products/:id', deleteProduct)

router.get('/orders', getAllOrders)
router.patch('/orders/:id/status', updateOrderStatus)
router.patch('/orders/:id/payment', updatePaymentStatus)
router.get('/stats', getOrderStats)

export default router