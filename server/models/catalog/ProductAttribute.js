import mongoose from 'mongoose';

const productAttributeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // 'Chất liệu', 'Kiểu dáng', 'Họa tiết'
    code: { type: String, required: true, unique: true, lowercase: true, trim: true },
    values: [
      {
        value: { type: String, required: true }, // 'Pima Cotton', 'Slim Fit', 'Kẻ caro'
        description: { type: String }
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('ProductAttribute', productAttributeSchema);
