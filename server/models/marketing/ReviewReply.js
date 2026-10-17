import mongoose from 'mongoose';

const reviewReplySchema = new mongoose.Schema(
  {
    reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReviewRating', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Staff / Admin
    replyContent: { type: String, required: true, trim: true }
  },
  { timestamps: true }
);

export default mongoose.model('ReviewReply', reviewReplySchema);
