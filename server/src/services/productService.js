import { Product } from '../models/Product.js';
import { Variant } from '../models/Variant.js';

export const getProducts = async (queryParams) => {
  const {
    category,
    search,
    minPrice,
    maxPrice,
    size,
    color,
    sort,
    page = 1,
    limit = 20
  } = queryParams;

  const filter = { isActive: true };

  // Category filter
  if (category && category !== 'Tất cả') {
    filter.category = category;
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  // Size filter
  if (size) {
    filter.sizes = size;
  }

  // Color filter
  if (color) {
    filter['colors.name'] = color;
  }

  // Search keyword (Text index or regex)
  if (search && search.trim()) {
    const term = search.trim();
    filter.$or = [
      { name: { $regex: term, $options: 'i' } },
      { description: { $regex: term, $options: 'i' } },
      { category: { $regex: term, $options: 'i' } },
      { tags: { $in: [new RegExp(term, 'i')] } }
    ];
  }

  // Sorting
  let sortOption = { createdAt: -1 };
  if (sort === 'price-asc') sortOption = { price: 1 };
  if (sort === 'price-desc') sortOption = { price: -1 };
  if (sort === 'rating') sortOption = { rating: -1 };
  if (sort === 'popular') sortOption = { totalSold: -1, reviewCount: -1 };

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('variants')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter)
  ]);

  return {
    products,
    pagination: {
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit))
    }
  };
};

export const getProductByIdOrSlug = async (idOrSlug) => {
  let product = null;
  if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
    product = await Product.findById(idOrSlug).populate('variants');
  } else {
    product = await Product.findOne({ slug: idOrSlug }).populate('variants');
  }

  if (!product) throw new Error('Không tìm thấy sản phẩm');
  return product;
};
