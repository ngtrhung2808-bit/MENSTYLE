import mongoose from 'mongoose';

const storeBranchSchema = new mongoose.Schema(
  {
    branchName: { type: String, required: true, trim: true },
    branchCode: { type: String, required: true, unique: true, uppercase: true },
    phoneNumber: { type: String, required: true },
    provinceCity: { type: String, required: true },
    district: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: String, default: '08:30 - 22:00 Hàng ngày' },
    latitude: { type: Number },
    longitude: { type: Number },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('StoreBranch', storeBranchSchema);
