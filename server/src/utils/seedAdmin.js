import 'dotenv/config'
import mongoose from 'mongoose'
import connectDB from '../config/db.js'
import User from '../models/user.model.js'

const seedAdmin = async () => {
  await connectDB()

  const existing = await User.findOne({ email: 'yunanrai433@gmail.com' })
  if (existing) {
    console.log('Admin already exists')
    process.exit()
  }

  await User.create({
    name: 'Admin',
    email: 'admin@fooddelivery.com',
    password: 'admin123456',
    role: 'admin',
  })

  console.log('Admin created')
  process.exit()
}

seedAdmin()