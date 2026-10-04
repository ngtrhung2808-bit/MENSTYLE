import mongoose from 'mongoose';

const couponPromotionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    title: { type: String, required: true },
    description: { type: String },
    discountType: { type: String, enum: ['percentage', 'fixed_amount'], default: 'percentage' },
    discountValue: { type: Number, required: true, min: 0 },
    minOrderValue: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number, default: null }, // Áp dụng cho loại %
    usageLimitTotal: { type: Number, default: 100 },
    usageCount: { type: Number, default: 0 },
    usageLimitPerUser: { type: Number, default: 1 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('CouponPromotion', couponPromotionSchema);
