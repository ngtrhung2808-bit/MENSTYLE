const orderError = (message, statusCode) => Object.assign(new Error(message), { statusCode });

export const resolveOrderItem = ({ input, product, variant, productHasVariants }) => {
  if (!product || product.isActive === false) {
    throw orderError('Sản phẩm không tồn tại hoặc đã ngừng kinh doanh', 404);
  }

  if ((input.variantId || productHasVariants) && !variant) {
    throw orderError('Không tìm thấy biến thể sản phẩm phù hợp với kích cỡ và màu đã chọn', 409);
  }

  if (variant) {
    const variantProductId = String(variant.productId?._id || variant.productId);
    if (variantProductId !== String(product._id)) {
      throw orderError('Biến thể không thuộc sản phẩm đã chọn', 400);
    }
    if (variant.isActive === false) {
      throw orderError('Biến thể sản phẩm đã ngừng kinh doanh', 409);
    }
    if (String(variant.size) !== String(input.selectedSize)
      || String(variant.color?.name || variant.colorName || '') !== String(input.selectedColor)) {
      throw orderError('Kích cỡ hoặc màu sắc không khớp với biến thể sản phẩm', 400);
    }
  }

  return {
    productId: product._id,
    variantId: variant?._id || null,
    name: product.name,
    selectedSize: String(input.selectedSize),
    selectedColor: String(input.selectedColor),
    price: Number(variant?.price ?? product.price),
    quantity: Number(input.quantity),
    image: variant?.image || product.images?.[0] || ''
  };
};
