import express from 'express'
import {
  getAllUsers,
  getUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
} from '../controllers/admin.controller.js'
import { protect, authorize } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.use(protect, authorize('admin'))

router.get('/users', getAllUsers)
router.get('/users/:id', getUser)
router.patch('/users/:id/role', updateUserRole)
router.patch('/users/:id/status', toggleUserStatus)
router.delete('/users/:id', deleteUser)

export default router