import express from 'express'
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  khaltiWebhook,
} from '../controllers/payment.controller.js'
import { protect } from '../middlewares/auth.middleware.js'

const router = express.Router()

router.post('/khalti/initiate', protect, initiateKhaltiPayment)
router.post('/khalti/verify', protect, verifyKhaltiPayment)

// webhook — no auth, called by Khalti server
router.post('/khalti/webhook', khaltiWebhook)

export default router