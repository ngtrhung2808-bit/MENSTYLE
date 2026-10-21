import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Mã voucher là bắt buộc'],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed_amount'],
      default: 'percentage'
    },
    discountValue: {
      type: Number,
      required: [true, 'Giá trị giảm giá là bắt buộc'],
      min: [0, 'Giá trị giảm không thể âm']
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: [0, 'Giá trị đơn tối thiểu không thể âm']
    },
    maxDiscountAmount: {
      type: Number,
      default: null
    },
    usageLimit: {
      type: Number,
      default: 1000,
      min: 0
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    endDate: {
      type: Date,
      required: [true, 'Ngày hết hạn voucher là bắt buộc']
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
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

couponSchema.methods.calculateDiscount = function (subTotal) {
  if (!this.isActive) throw new Error('Mã giảm giá hiện đang bị vô hiệu');
  const now = new Date();
  if (now < this.startDate || now > this.endDate) throw new Error('Mã giảm giá đã hết hạn hoặc chưa kích hoạt');
  if (this.usedCount >= this.usageLimit) throw new Error('Mã giảm giá đã hết lượt sử dụng');
  if (subTotal < this.minOrderValue) {
    throw new Error(`Đơn hàng phải đạt tối thiểu ${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(this.minOrderValue)}`);
  }

  let discount = 0;
  if (this.discountType === 'percentage') {
    discount = Math.round((subTotal * this.discountValue) / 100);
    if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
      discount = this.maxDiscountAmount;
    }
  } else {
    discount = this.discountValue;
  }
  return Math.min(discount, subTotal);
};

export const Coupon = mongoose.model('Coupon', couponSchema);
