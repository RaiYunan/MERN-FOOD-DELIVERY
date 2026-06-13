import Product from '../models/product.model.js'

// Create Product (Admin only)
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image } = req.body

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
      createdBy: req.user._id,
    })

    res.status(201).json({
      success: true,
      product,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get All Products (Public)
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({ isAvailable: true })
    res.status(200).json({
      success: true,
      count: products.length,
      products,
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Get Single Product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ success: true, product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Update Product (Admin only) 
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ success: true, product })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

// Delete Product (Admin only) 
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.status(200).json({ success: true, message: 'Product deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}