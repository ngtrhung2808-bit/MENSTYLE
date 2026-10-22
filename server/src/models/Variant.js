import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product ID là bắt buộc'],
      index: true
    },
    sku: {
      type: String,
      required: [true, 'SKU là bắt buộc'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    size: {
      type: String,
      required: [true, 'Size là bắt buộc'],
      trim: true
    },
    color: {
      name: { type: String, required: true, trim: true },
      hex: { type: String, required: true, trim: true }
    },
    price: {
      type: Number,
      required: [true, 'Giá biến thể là bắt buộc'],
      min: [0, 'Giá biến thể không thể âm']
    },
    stockQuantity: {
      type: Number,
      required: [true, 'Số lượng tồn kho là bắt buộc'],
      default: 50,
      min: [0, 'Số lượng tồn kho không thể âm']
    },
    image: {
      type: String,
      default: ''
    },
    isActive: {
      type: Boolean,
      default: true
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

// Compound index on productId, size, color.name to prevent duplicate SKUs for the same product configuration
variantSchema.index({ productId: 1, size: 1, 'color.name': 1 }, { unique: true });

export const Variant = mongoose.model('Variant', variantSchema);
