import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    district: { type: String, trim: true, default: '' },
    province: { type: String, required: true, trim: true, default: 'Hà Nội' },
    isDefault: { type: Boolean, default: false }
  },
  { _id: true }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên người dùng là bắt buộc'],
      trim: true,
      maxlength: [100, 'Tên không được vượt quá 100 ký tự']
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không đúng định dạng']
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false
    },
    phone: {
      type: String,
      trim: true,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'admin'],
        message: 'Role chỉ cho phép: customer hoặc admin'
      },
      default: 'customer',
      index: true
    },
    memberLevel: {
      type: String,
      enum: ['Thành Viên Đồng', 'Thành Viên Bạc', 'Thành Viên Vàng', 'Thành Viên Kim Cương'],
      default: 'Thành Viên Bạc'
    },
    points: {
      type: Number,
      default: 100,
      min: [0, 'Điểm tích lũy không thể âm']
    },
    addresses: [addressSchema],
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
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

// Virtual & Sync fullName for backwards compatibility
userSchema.virtual('fullName')
  .get(function () {
    return this.name;
  })
  .set(function (v) {
    this.name = v;
  });

userSchema.pre('validate', function () {
  if (!this.name && this.get('fullName')) {
    this.name = this.get('fullName');
  }
});

// Pre-save hook to hash password with bcrypt (async/await modern Mongoose)
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare candidate password with hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model('User', userSchema);
