import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

let io

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    pingTimeout: 20000,
    pingInterval: 25000,
  })

  
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token

      if (!token) {
        return next(new Error('Authentication required'))
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      const user = await User.findById(decoded.id).select('-password')

      if (!user) {
        return next(new Error('User not found'))
      }

      if (!user.isActive) {
        return next(new Error('Account deactivated'))
      }

      socket.user = user
      next()
    } catch (err) {
      next(new Error('Invalid or expired token'))
    }
  })

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.name} (${socket.user.role})`)

    
    socket.join(`user:${socket.user._id}`)

    
    if (socket.user.role === 'admin') {
      socket.join('admins')
    }

    
    socket.on('watchOrder', (orderId) => {
      socket.join(`order:${orderId}`)
    })

    socket.on('unwatchOrder', (orderId) => {
      socket.leave(`order:${orderId}`)
    })

    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.user.name} — ${reason}`)
    })

    socket.on('error', (err) => {
      console.error(`Socket error (${socket.user.name}):`, err.message)
    })
  })

  return io
}

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized — call initSocket first')
  }
  return io
}