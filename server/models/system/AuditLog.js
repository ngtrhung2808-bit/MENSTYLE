import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userEmail: { type: String },
    action: { type: String, required: true }, // 'CREATE_PRODUCT', 'UPDATE_ORDER_STATUS', 'DELETE_USER'
    collectionName: { type: String, required: true },
    documentId: { type: String },
    details: { type: Object },
    ipAddress: { type: String },
    userAgent: { type: String }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model('AuditLog', auditLogSchema);
