import mongoose from 'mongoose';

const couponUsageSchema = new mongoose.Schema(
  {
    couponId: { type: mongoose.Schema.Types.ObjectId, ref: 'CouponPromotion', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    discountApplied: { type: Number, required: true },
    usedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

couponUsageSchema.index({ couponId: 1, userId: 1, orderId: 1 }, { unique: true });

export default mongoose.model('CouponUsage', couponUsageSchema);
