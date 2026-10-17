import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    orderCode: { type: String, required: true, unique: true, uppercase: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestInfo: {
      fullName: String,
      phone: String,
      email: String,
      address: String,
      note: String
    },
    totalAmount: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ['COD', 'VNPAY', 'MOMO', 'BANKING'],
      default: 'COD'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipping', 'delivered', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Order', orderSchema);
