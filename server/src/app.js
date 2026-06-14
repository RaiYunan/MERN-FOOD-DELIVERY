import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from "path"
import { fileURLToPath } from 'url'

import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/product.routes.js'

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))
app.get('/', (req, res) => {
  res.json({ message: 'Food delivery API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

// serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')))


app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

export default app