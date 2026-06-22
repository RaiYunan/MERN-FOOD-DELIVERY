import Cart from '../models/cart.model.js'
import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Get my cart
export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    'items.product',
    'name image price isAvailable'
  )

  if (!cart) {
    return res.status(200).json({
      success: true,
      cart: { items: [], totalAmount: 0 },
    })
  }

  res.status(200).json({ success: true, cart })
})

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body

  if (quantity < 1) throw new ApiError(400, 'Quantity must be at least 1')

  const product = await Product.findById(productId)
  if (!product) throw new ApiError(404, 'Product not found')
  if (!product.isAvailable) throw new ApiError(400, 'Product is currently unavailable')

  let cart = await Cart.findOne({ user: req.user._id })

  if (!cart) {
    cart = new Cart({
      user: req.user._id,
      items: [],
    })
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  )

  if (existingItem) {
    existingItem.quantity += quantity
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    })
  }

  await cart.save()
  await cart.populate('items.product', 'name image price isAvailable')

  res.status(200).json({ success: true, cart })
})

// Update item quantity
export const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body
  const { productId } = req.params

  if (quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1')
  }

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  const item = cart.items.find(
    (item) => item.product.toString() === productId
  )
  if (!item) {
    throw new ApiError(404, 'Item not found in cart')
  }

  item.quantity = quantity
  await cart.save()

  await cart.populate('items.product', 'name image price isAvailable')

  res.status(200).json({ success: true, cart })
})

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params

  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  const itemExists = cart.items.find(
    (item) => item.product.toString() === productId
  )
  if (!itemExists) {
    throw new ApiError(404, 'Item not found in cart')
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  )
  await cart.save()

  await cart.populate('items.product', 'name image price isAvailable')

  res.status(200).json({ success: true, cart })
})

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id })
  if (!cart) {
    throw new ApiError(404, 'Cart not found')
  }

  cart.items = []
  await cart.save()

  res.status(200).json({
    success: true,
    message: 'Cart cleared',
    cart: { items: [], totalAmount: 0 },
  })
})