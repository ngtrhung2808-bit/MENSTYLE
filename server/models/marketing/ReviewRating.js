import mongoose from 'mongoose';

const reviewRatingSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    feedbackFit: { type: String, enum: ['Chật', 'Vừa vặn', 'Rộng'], default: 'Vừa vặn' },
    images: [{ type: String }],
    isVerifiedPurchase: { type: Boolean, default: true },
    likesCount: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'approved', 'hidden'], default: 'approved' }
  },
  { timestamps: true }
);

export default mongoose.model('ReviewRating', reviewRatingSchema);
