import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant' },
    productName: { type: String, required: true },
    thumbnail: { type: String },
    color: { type: String },
    size: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    subtotal: { type: Number, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('OrderItem', orderItemSchema);
