import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // Null nếu là khách vãng lai
    sessionId: { type: String, default: null }, // Dành cho guest
    totalItems: { type: Number, default: 0 },
    subtotalAmount: { type: Number, default: 0 },
    couponApplied: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    expiresAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model('Cart', cartSchema);
