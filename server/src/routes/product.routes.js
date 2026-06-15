import express from 'express'
import {
  createProduct,
  getProducts,
  getAllProductsAdmin,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus,
} from '../controllers/product.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'
import upload from '../middlewares/upload.middleware.js'

const router = express.Router()

// Public routes
router.get('/', getProducts)
router.get('/:id', getProduct)

// Admin only routes
router.get('/admin/all', protect, authorize('admin'), getAllProductsAdmin)
router.post('/', protect, authorize('admin'), upload.single('image'), createProduct)
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateProduct)
router.patch('/:id/status', protect, authorize('admin'), toggleProductStatus)
router.delete('/:id', protect, authorize('admin'), deleteProduct)

export default router