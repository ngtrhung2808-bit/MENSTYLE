import mongoose from 'mongoose';

const paymentTransactionSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    transactionCode: { type: String, required: true, unique: true },
    provider: { type: String, enum: ['COD', 'VNPAY', 'MOMO', 'BANKING'], required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'VND' },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending' },
    payloadResponse: { type: Object } // Raw data from VNPay/MoMo IPN callback
  },
  { timestamps: true }
);

export default mongoose.model('PaymentTransaction', paymentTransactionSchema);
