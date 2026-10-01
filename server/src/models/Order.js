import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Variant',
      default: null
    },
    name: { type: String, required: true },
    selectedSize: { type: String, required: true },
    selectedColor: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    image: { type: String, default: '' }
  },
  { _id: true }
);

const customerInfoSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: '' },
    province: { type: String, required: true, trim: true, default: 'Hà Nội' },
    note: { type: String, trim: true, default: '' }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    customerInfo: {
      type: customerInfoSchema,
      required: true
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Đơn hàng phải có ít nhất 1 sản phẩm'
      }
    },
    subTotal: {
      type: Number,
      required: true,
      min: 0
    },
    shippingFee: {
      type: Number,
      default: 0,
      min: 0
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0
    },
    couponCode: {
      type: String,
      trim: true,
      default: ''
    },
    grandTotal: {
      type: Number,
      required: true,
      min: 0
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'vnpay', 'momo', 'banking'],
      default: 'cod'
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'delivering', 'completed', 'cancelled'],
      default: 'pending',
      index: true
    },
    cancelReason: {
      type: String,
      default: ''
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

// Method to generate human-readable order code: MS-XXXXXX
orderSchema.statics.generateOrderCode = function () {
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `MS-${randomSuffix}`;
};

export const Order = mongoose.model('Order', orderSchema);
