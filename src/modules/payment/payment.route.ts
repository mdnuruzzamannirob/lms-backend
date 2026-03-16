import { Router } from 'express'
import auth from '../../middleware/auth'
import validateRequest from '../../middleware/validate'
import { PaymentController } from './payment.controller'
import { PaymentValidation } from './payment.validation'

const router = Router()

// Stripe webhook — raw body already applied at app level for this path
router.post('/webhook', PaymentController.stripeWebhook)

// User's own payments
router.get('/me', auth('user', 'admin'), PaymentController.getMyPayments)

// Create Stripe payment intent
router.post(
  '/stripe',
  auth('user', 'admin'),
  validateRequest(PaymentValidation.createStripePayment),
  PaymentController.createStripePayment,
)

// Admin: record manual payment
router.post(
  '/manual',
  auth('admin'),
  validateRequest(PaymentValidation.recordManualPayment),
  PaymentController.recordManualPayment,
)

// Admin: list all payments
router.get('/', auth('admin'), PaymentController.getAllPayments)

export const PaymentRoutes = router
