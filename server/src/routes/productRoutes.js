import express from 'express';
import * as productController from '../controllers/productController.js';

const router = express.Router();

router.get('/categories', productController.getCategories);
router.get('/', productController.getAllProducts);
router.get('/:idOrSlug', productController.getProductById);

export default router;
