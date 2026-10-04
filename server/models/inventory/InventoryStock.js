import mongoose from 'mongoose';

const inventoryStockSchema = new mongoose.Schema(
  {
    variantId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductVariant', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'StoreBranch', default: null }, // Chi nhánh cửa hàng (nếu có)
    quantityOnHand: { type: Number, required: true, default: 0, min: 0 }, // Số lượng thực tế
    quantityReserved: { type: Number, default: 0, min: 0 }, // Đang giữ cho đơn hàng chờ thanh toán
    lowStockThreshold: { type: Number, default: 5 }, // Ngưỡng báo động sắp hết hàng
    lastRestockedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('InventoryStock', inventoryStockSchema);
