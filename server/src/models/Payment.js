import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: [true, 'Order ID là bắt buộc'],
      index: true
    },
    orderCode: {
      type: String,
      required: [true, 'Mã đơn hàng là bắt buộc'],
      index: true
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'vnpay', 'momo', 'banking'],
      required: [true, 'Phương thức thanh toán là bắt buộc']
    },
    transactionId: {
      type: String,
      default: null,
      trim: true
    },
    amount: {
      type: Number,
      required: [true, 'Số tiền thanh toán là bắt buộc'],
      min: [0, 'Số tiền thanh toán không thể âm']
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

export const Payment = mongoose.model('Payment', paymentSchema);
