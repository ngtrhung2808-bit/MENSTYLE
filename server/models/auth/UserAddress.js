import mongoose from 'mongoose';

const userAddressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipientName: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    provinceCity: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    specificAddress: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
    addressType: { type: String, enum: ['home', 'office'], default: 'home' }
  },
  { timestamps: true }
);

export default mongoose.model('UserAddress', userAddressSchema);
