import Product from '../models/product.model.js'
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/ApiError.js'
import removeFile from '../utils/removeFile.js'

// Create Product (Admin only)
export const createProduct = async (req, res) => {
  const { name, description, price, category } = req.body

  const product = await Product.create({
    name,
    description,
    price,
    category,
    image: req.file ? req.file.path : '',
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

// Get All Products including unavailable (Admin)
export const getAllProductsAdmin = asyncHandler(async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 })

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
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  if (req.file) {
    if (product.image) removeFile(product.image)
    req.body.image = req.file.path
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({ success: true, product: updatedProduct })
})

// Delete Product (Admin only) 
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  if (product.image && !product.image.startsWith('http')) {
    removeFile(product.image)
  }

  await product.deleteOne()

  res.status(200).json({ success: true, message: 'Product deleted' })
})

// Toggle Product Status (Admin only)
export const toggleProductStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    throw new ApiError(404, 'Product not found')
  }

  product.isAvailable = !product.isAvailable
  await product.save()

  res.status(200).json({
    success: true,
    message: `Product is now ${product.isAvailable ? 'available' : 'unavailable'}`,
    product,
  })
})