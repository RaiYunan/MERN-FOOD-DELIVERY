import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'

// Create Product (Admin only)
export const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: req.file ? `/uploads/products/${req.file.filename}` : '',
    createdBy: req.user._id,
  })

  res.status(201).json({
    success: true,
    product,
  })
}

// Get All Products (Public)
export const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isAvailable: true })

  res.status(200).json({
    success: true,
    count: products.length,
    products,
  })
})

// Get Single Product
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  res.status(200).json({ success: true, product })
})

// Update Product (Admin only) 
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  res.status(200).json({ success: true, product })
})

// Delete Product (Admin only) 
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  res.status(200).json({ success: true, message: 'Product deleted' })
})