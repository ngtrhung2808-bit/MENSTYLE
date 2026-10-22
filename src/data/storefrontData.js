// Dữ liệu quản lý giao diện cửa hàng (Banners, Marquee, Danh mục hiển thị)
export const INITIAL_BANNERS = [
  {
    id: 1,
    title: 'BỘ SƯU TẬP THU ĐÔNG 2026',
    subtitle: 'URBAN ELEGANCE • ĐẲNG CẤP PHÁI MẠNH',
    desc: 'Thiết kế Áo Khoác Gió 2 lớp Wind Light & Măng tô len Ý may đo phom chuẩn quý ông hiện đại.',
    image: '/banners/banner_fall_winter.jpg',
    category: 'Áo Khoác & Blazer',
    ctaText: 'Khám Phá BST',
    isActive: true,
    displayOrder: 1
  },
  {
    id: 2,
    title: 'POLO SILK TOUCH CO GIÃN',
    subtitle: 'THOÁNG MÁT TỐI ĐA • ĐỨNG FORM CẢ NGÀY',
    desc: 'Chất liệu dệt tổ ong DiamondAir kháng khuẩn, giải pháp trang phục hàng ngày thanh lịch.',
    image: '/banners/banner_polo_silk.jpg',
    category: 'Áo Polo',
    ctaText: 'Mua Ngay',
    isActive: true,
    displayOrder: 2
  },
  {
    id: 3,
    title: 'SMART CASUAL OFFICE COMBO',
    subtitle: 'SƠ MI MODAL SILK & QUẦN ÂU CO GIÃN 4 CHIỀU',
    desc: 'Giải pháp trang phục công sở cả tuần không cần ủi, tôn trọn vóc dáng nam tính.',
    image: '/banners/banner_smart_casual.jpg',
    category: 'Áo Sơ Mi',
    ctaText: 'Xem Bộ Sưu Tập',
    isActive: true,
    displayOrder: 3
  }
];

export const INITIAL_STOREFRONT_CONFIG = {
  announcementText: '🔥 Voucher lớn - Sale giá độc quyền đến 50% • 🚚 Freeship mọi đơn hàng từ 500k • 🔥 Đổi hàng trong 30 ngày tận nơi miễn phí • 🎁 Giảm ngay 100k cho đơn đầu tiên',
  isAnnouncementActive: true,
  featuredCampaignTitle: 'Đặc Quyền Mua Sắm Fall Winter',
  hotCategories: ['Áo Sơ Mi', 'Áo Polo', 'Blazer & Suit', 'Quần Âu & Jean', 'Phụ Kiện']
};

export function getStoredBanners() {
  try {
    const raw = localStorage.getItem('menstyle_banners');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('menstyle_banners', JSON.stringify(INITIAL_BANNERS));
  return INITIAL_BANNERS;
}

export function saveStoredBanners(banners) {
  try {
    localStorage.setItem('menstyle_banners', JSON.stringify(banners));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredStorefrontConfig() {
  try {
    const raw = localStorage.getItem('menstyle_storefront_config');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('menstyle_storefront_config', JSON.stringify(INITIAL_STOREFRONT_CONFIG));
  return INITIAL_STOREFRONT_CONFIG;
}

export function saveStoredStorefrontConfig(cfg) {
  try {
    localStorage.setItem('menstyle_storefront_config', JSON.stringify(cfg));
  } catch (e) {
    console.error(e);
  }
}
