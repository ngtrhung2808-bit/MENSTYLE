import mongoose from 'mongoose';

const sizeGuideSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    title: { type: String, required: true },
    sizeTable: [
      {
        size: { type: String, required: true }, // 'M', 'L', 'XL'
        heightRangeCm: { min: Number, max: Number }, // 165 - 170
        weightRangeKg: { min: Number, max: Number }, // 55 - 65
        chestCm: { type: Number },
        shoulderCm: { type: Number },
        lengthCm: { type: Number }
      }
    ],
    guideImage: { type: String, default: '' },
    description: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('SizeGuide', sizeGuideSchema);
