import mongoose from 'mongoose';

const orderStatusHistorySchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    previousStatus: { type: String },
    newStatus: { type: String, required: true },
    changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Staff or Admin
    note: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('OrderStatusHistory', orderStatusHistorySchema);
