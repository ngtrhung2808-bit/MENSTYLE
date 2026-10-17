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
  const category = product.category && typeof product.category === 'object'
    ? product.category.name || product.category.title
    : product.category;

  return {
    ...product,
    id: String(product._id || product.id || product.slug || ''),
    name: String(product.name || product.title || 'Sản phẩm MENSTYLE'),
    category: String(category || 'Khác'),
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
  const candidates = [responseData?.data, responseData?.products, responseData];
  const products = candidates.find(Array.isArray);
  if (!products) {
    throw new Error('API không trả về danh sách sản phẩm hợp lệ.');
  }
  return products.map(normalizeProduct);
};
