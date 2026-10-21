import * as chatbotService from '../services/chatbotService.js';
import { AI_Conversation } from '../models/AI_Conversation.js';

export const handleChat = async (req, res, next) => {
  try {
    const { sessionId, message } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nội dung tin nhắn không được để trống'
      });
    }

    const response = await chatbotService.handleChatMessage({
      sessionId: sessionId || 'default_session',
      userId,
      messageText: message
    });

    res.status(200).json({
      success: true,
      data: response
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const conversation = await AI_Conversation.findOne({ sessionId })
      .populate('messages.suggestedProducts');

    res.status(200).json({
      success: true,
      data: conversation ? conversation.messages : []
    });
  } catch (error) {
    next(error);
  }
};
