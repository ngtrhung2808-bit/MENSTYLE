import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema } from '../validations/orderValidation.js';
import { protect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public / Guest or logged-in can create order
router.post('/', validate(createOrderSchema), orderController.createOrder);

// Logged-in user view own orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin routes
router.get('/admin/stats', protect, authorize('admin'), orderController.getAdminStats);
router.patch('/admin/:id/status', protect, authorize('admin'), orderController.updateOrderStatus);

export default router;
