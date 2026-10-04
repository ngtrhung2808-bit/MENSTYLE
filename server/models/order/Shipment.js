import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true },
    trackingNumber: { type: String, required: true, unique: true },
    carrier: { type: String, enum: ['GHN', 'GHTK', 'ViettelPost', 'ShopeeXpress'], default: 'GHN' },
    shippingStatus: {
      type: String,
      enum: ['ready_to_pick', 'picking', 'picked', 'delivering', 'delivered', 'returned'],
      default: 'ready_to_pick'
    },
    estimatedDeliveryDate: { type: Date },
    actualDeliveredDate: { type: Date },
    senderAddress: { type: String, default: 'Tổng kho MenStyle - Hà Nội' },
    receiverAddress: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Shipment', shipmentSchema);
