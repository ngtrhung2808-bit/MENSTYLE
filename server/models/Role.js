import mongoose from 'mongoose';

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      enum: ['guest', 'customer', 'staff', 'super_admin']
    },
    displayName: { type: String, required: true },
    description: { type: String },
    permissions: [{ type: String }] // ['products.read', 'products.write', 'orders.manage', 'users.manage']
  },
  { timestamps: true }
);

export default mongoose.model('Role', roleSchema);
