import express from 'express';
import * as chatController from '../controllers/chatController.js';

const router = express.Router();

router.post('/', chatController.handleChat);
router.get('/history/:sessionId', chatController.getHistory);

export default router;
