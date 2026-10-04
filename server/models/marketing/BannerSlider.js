import mongoose from 'mongoose';

const bannerSliderSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    imageUrl: { type: String, required: true },
    mobileImageUrl: { type: String },
    linkUrl: { type: String, default: '/collections' },
    position: {
      type: String,
      enum: ['home_hero', 'home_middle', 'category_top', 'flash_sale'],
      default: 'home_hero'
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model('BannerSlider', bannerSliderSchema);
