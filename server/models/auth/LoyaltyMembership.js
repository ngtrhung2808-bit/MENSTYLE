import mongoose from 'mongoose';

const loyaltyMembershipSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    tierName: { type: String, enum: ['Silver', 'Gold', 'Diamond'], default: 'Silver' },
    currentPoints: { type: Number, default: 0, min: 0 },
    accumulatedSpent: { type: Number, default: 0, min: 0 },
    discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    pointHistory: [
      {
        pointsChanged: { type: Number, required: true },
        reason: { type: String, required: true },
        orderCode: { type: String },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('LoyaltyMembership', loyaltyMembershipSchema);
