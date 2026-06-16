import express from 'express'
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cart.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect)

router.get('/', getCart)
router.post('/add', addToCart)
router.put('/item/:productId', updateCartItem)
router.delete('/item/:productId', removeFromCart)
router.delete('/clear', clearCart)

export default router