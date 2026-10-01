import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
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
    image: { type: String, default: '' },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Số lượng tối thiểu là 1'],
      default: 1
    }
  },
  { _id: true }
);

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    sessionId: {
      type: String,
      default: null,
      index: true
    },
    items: [cartItemSchema],
    totalAmount: {
      type: Number,
      default: 0,
      min: 0
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

// Pre-save hook to calculate totalAmount
cartSchema.pre('save', function (next) {
  this.totalAmount = this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  next();
});

export const Cart = mongoose.model('Cart', cartSchema);
