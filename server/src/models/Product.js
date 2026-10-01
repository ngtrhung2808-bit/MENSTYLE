import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    hex: { type: String, required: true, trim: true }
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true,
      maxlength: [200, 'Tên sản phẩm không quá 200 ký tự'],
      index: true
    },
    slug: {
      type: String,
      required: [true, 'Slug là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      required: [true, 'Tên phân loại là bắt buộc'],
      trim: true,
      index: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null,
      index: true
    },
    price: {
      type: Number,
      required: [true, 'Giá bán là bắt buộc'],
      min: [0, 'Giá bán không thể âm'],
      index: true
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: [0, 'Giá gốc không thể âm']
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, 'Giảm giá tối thiểu 0%'],
      max: [100, 'Giảm giá tối đa 100%']
    },
    rating: {
      type: Number,
      default: 5.0,
      min: [1, 'Đánh giá tối thiểu 1 sao'],
      max: [5, 'Đánh giá tối đa 5 sao']
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Cần ít nhất 1 hình ảnh cho sản phẩm'
      }
    },
    isNewProduct: {
      type: Boolean,
      default: false
    },
    colors: [colorSchema],
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL']
    },
    description: {
      type: String,
      default: ''
    },
    brand: {
      type: String,
      default: 'MENSTYLE',
      trim: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    totalSold: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id;
        ret.isNew = ret.isNewProduct; // Map to frontend property
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual for variants
productSchema.virtual('variants', {
  ref: 'Variant',
  localField: '_id',
  foreignField: 'productId'
});

// Full-text search index for AI search and general search
productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' });

export const Product = mongoose.model('Product', productSchema);
