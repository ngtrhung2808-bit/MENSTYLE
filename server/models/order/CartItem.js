import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    quantity: { type: Number, required: true, min: 1, default: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('CartItem', cartItemSchema);
