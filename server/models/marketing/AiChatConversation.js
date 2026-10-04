import mongoose from 'mongoose';

const aiChatConversationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    sessionId: { type: String, required: true },
    messages: [
      {
        sender: { type: String, enum: ['user', 'assistant'], required: true },
        text: { type: String, required: true },
        suggestedProductIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
        timestamp: { type: Date, default: Date.now }
      }
    ],
    lastInteractionAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('AiChatConversation', aiChatConversationSchema);
