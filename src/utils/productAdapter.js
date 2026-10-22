const asArray = (value) => (Array.isArray(value) ? value : []);

const getColor = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return { name: value, hex: '#d4d4d4' };
  }

  const name = value.name || value.colorName || value.title;
  if (!name) return null;

  return {
    name: String(name),
    hex: value.hex || value.colorHex || value.code || '#d4d4d4',
  };
};

const getImageUrl = (image) => {
  if (typeof image === 'string') return image.trim();
  if (image && typeof image === 'object') {
    return String(image.url || image.src || image.image || '').trim();
  }
  return '';
};

const CATEGORY_MAP = {
  '6ad2fb1e8fcbd7a1d5310c5f': 'Áo Polo',
  '6ad2fb1e8fcbd7a1d5310c60': 'Áo Sơ Mi',
  '6ad2fb1e8fcbd7a1d5310c61': 'Quần Âu Công Sở',
  '6ad2fb1e8fcbd7a1d5310c62': 'Áo Khoác & Blazer'
};

const normalizeCategoryName = (rawCat, productName = '') => {
  if (!rawCat && !productName) return 'Khác';
  
  if (typeof rawCat === 'object' && rawCat !== null) {
    rawCat = rawCat.name || rawCat.title || rawCat._id || '';
  }

  const strCat = String(rawCat || '').trim();
  if (CATEGORY_MAP[strCat]) {
    return CATEGORY_MAP[strCat];
  }

  // Nếu chuỗi danh mục đã chuẩn thì giữ nguyên
  const validCats = [
    'Áo Polo',
    'Áo Sơ Mi',
    'Áo Khoác & Blazer',
    'Quần Âu Công Sở',
    'Quần Jeans & Khaki',
    'Quần Short',
    'Phụ Kiện'
  ];
  const exact = validCats.find(c => c.toLowerCase() === strCat.toLowerCase());
  if (exact) return exact;

  const lowerCat = strCat.toLowerCase();
  const lowerName = String(productName || '').toLowerCase();

  if (lowerCat.includes('polo') || lowerName.includes('polo')) return 'Áo Polo';
  if (lowerCat.includes('sơ mi') || lowerCat.includes('so mi') || lowerName.includes('sơ mi') || lowerName.includes('so mi')) return 'Áo Sơ Mi';
  if (lowerCat.includes('khoác') || lowerCat.includes('khoac') || lowerCat.includes('blazer') || lowerName.includes('khoác') || lowerName.includes('khoac') || lowerName.includes('blazer') || lowerName.includes('jacket')) return 'Áo Khoác & Blazer';
  if (lowerCat.includes('jeans') || lowerCat.includes('khaki') || lowerName.includes('jean') || lowerName.includes('khaki')) return 'Quần Jeans & Khaki';
  if (lowerCat.includes('âu') || lowerCat.includes('au') || lowerCat.includes('tây') || lowerCat.includes('tay') || lowerName.includes('âu') || lowerName.includes('au') || lowerName.includes('tây')) return 'Quần Âu Công Sở';
  if (lowerCat.includes('short') || lowerName.includes('short')) return 'Quần Short';
  if (lowerCat.includes('quần') || lowerCat.includes('quan') || lowerCat.includes('jogger') || lowerName.includes('quần') || lowerName.includes('quan') || lowerName.includes('jogger')) return 'Quần Âu Công Sở';
  if (lowerCat.includes('phụ kiện') || lowerCat.includes('phu kien') || lowerName.includes('thắt lưng') || lowerName.includes('that lung') || lowerName.includes('ví') || lowerName.includes('cà vạt')) return 'Phụ Kiện';

  return strCat || 'Khác';
};

export const normalizeProduct = (source) => {
  const product = source && typeof source === 'object' ? source : {};
  const variants = asArray(product.variants);
  const images = [
    ...asArray(product.images).map(getImageUrl),
    getImageUrl(product.thumbnail),
    getImageUrl(product.image),
    ...variants.map((variant) => getImageUrl(variant.image)),
  ].filter((image, index, allImages) => image && allImages.indexOf(image) === index);

  const colors = [
    ...asArray(product.colors).map(getColor),
    ...variants.map((variant) => getColor(variant.color || variant)),
  ].filter(Boolean).filter((color, index, allColors) =>
    allColors.findIndex((candidate) => candidate.name.toLowerCase() === color.name.toLowerCase()) === index
  );

  const sizes = [
    ...asArray(product.sizes).map((size) => (typeof size === 'object' ? size.name || size.size : size)),
    ...variants.map((variant) => variant.size),
  ].filter((size, index, allSizes) => size && allSizes.indexOf(size) === index).map(String);

  const price = Number(product.price ?? product.salePrice ?? product.basePrice ?? 0);
  const originalPrice = Number(product.originalPrice ?? product.compareAtPrice ?? 0);
  const discount = Number(product.discount ?? (
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0
  ));
  
  const categoryName = normalizeCategoryName(product.category, product.name);

  return {
    ...product,
    id: String(product._id || product.id || product.slug || ''),
    name: String(product.name || product.title || 'Sản phẩm MENSTYLE'),
    category: categoryName,
    price,
    originalPrice,
    discount,
    rating: Number(product.rating ?? product.ratingAverage ?? 0),
    reviewCount: Number(product.reviewCount ?? 0),
    images,
    image: images[0] || '',
    colors,
    sizes,
    description: product.description || '',
    isNew: Boolean(product.isNew ?? product.isNewProduct),
    variants,
  };
};

export const extractProducts = (responseData) => {
  const possibleArrays = [];
  if (Array.isArray(responseData)) {
    possibleArrays.push(responseData);
  }
  if (Array.isArray(responseData?.data)) {
    possibleArrays.push(responseData.data);
  }
  if (Array.isArray(responseData?.data?.data)) {
    possibleArrays.push(responseData.data.data);
  }
  if (Array.isArray(responseData?.products)) {
    possibleArrays.push(responseData.products);
  }
  const products = possibleArrays.find(Boolean);
  if (!products) {
    throw new Error('API không trả về danh sách sản phẩm hợp lệ.');
  }
  return products.map(normalizeProduct);
};
