import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ['guest', 'customer', 'staff', 'super_admin'],
      default: 'customer'
    },
    avatar: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    points: { type: Number, default: 0 },
    tier: {
      type: String,
      enum: ['Silver', 'Gold', 'Diamond'],
      default: 'Silver'
    }
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
