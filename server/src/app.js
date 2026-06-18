import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'
import adminRoutes from './routes/admin.routes.js'
import reviewRoutes from './routes/review.routes.js'
import profileRoutes from './routes/profile.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import paymentRoutes from './routes/payment.routes.js'


import errorHandler from './middlewares/error.middleware.js'
import ApiError from './utils/ApiError.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))

app.get('/', (req, res) => {
  res.json({ message: 'Food delivery API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/reviews', reviewRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payment', paymentRoutes)

app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`))
})


app.use(errorHandler)

export default app