import mongoose from 'mongoose';

const productVariantSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    color: { type: String, required: true },
    colorCode: { type: String, default: '#000000' },
    size: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    priceOverride: { type: Number, default: null },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('ProductVariant', productVariantSchema);
