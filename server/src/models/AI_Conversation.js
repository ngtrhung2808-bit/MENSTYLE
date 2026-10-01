import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
      enum: ['user', 'bot'],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    suggestedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      }
    ],
    metadata: {
      intent: { type: String, default: 'general' },
      extractedEntities: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const aiConversationSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    messages: [messageSchema],
    contextSummary: {
      type: String,
      default: ''
    },
    lastActiveAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

export const AI_Conversation = mongoose.model('AI_Conversation', aiConversationSchema);
