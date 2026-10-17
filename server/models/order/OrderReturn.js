import mongoose from 'mongoose';

const orderReturnSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true }, // 'Kích cỡ không vừa', 'Hàng lỗi đường may', 'Giao sai màu'
    evidenceImages: [{ type: String }],
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'items_received', 'refunded'],
      default: 'requested'
    },
    refundAmount: { type: Number, default: 0 },
    staffNote: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('OrderReturn', orderReturnSchema);
