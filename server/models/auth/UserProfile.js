import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    birthDate: { type: Date },
    heightCm: { type: Number, min: 100, max: 250 },
    weightKg: { type: Number, min: 30, max: 200 },
    preferredSize: { type: String, enum: ['S', 'M', 'L', 'XL', '2XL', '3XL'] },
    preferredFit: { type: String, enum: ['Slimfit', 'Regular', 'Oversize'] },
    bio: { type: String, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('UserProfile', userProfileSchema);
