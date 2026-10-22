import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema } from '../validations/orderValidation.js';
import { updateOrderStatusSchema } from '../validations/orderStatusValidation.js';
import { protect, optionalProtect, authorize } from '../middlewares/auth.js';

const router = express.Router();

// Public / Guest or logged-in can create order
router.post('/', optionalProtect, validate(createOrderSchema), orderController.createOrder);

// Logged-in user view own orders
router.get('/my-orders', protect, orderController.getMyOrders);

// Admin routes
router.get('/admin/stats', orderController.getAdminStats);
router.get('/admin', orderController.getAdminOrders);
router.patch('/admin/:id/status', orderController.updateOrderStatus);

export default router;
