import Joi from 'joi';

export const createOrderSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    'string.empty': 'Vui lòng nhập họ tên nhận hàng',
    'any.required': 'Họ tên người nhận là bắt buộc'
  }),
  phone: Joi.string().trim().pattern(/^(0[3|5|7|8|9])[0-9]{8}$/).required().messages({
    'string.empty': 'Vui lòng nhập số điện thoại',
    'string.pattern.base': 'Số điện thoại phải gồm 10 số hợp lệ tại Việt Nam',
    'any.required': 'Số điện thoại là bắt buộc'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Vui lòng nhập email nhận đơn',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': 'Vui lòng nhập địa chỉ nhận hàng',
    'any.required': 'Địa chỉ là bắt buộc'
  }),
  province: Joi.string().trim().default('Hà Nội'),
  district: Joi.string().trim().allow(''),
  note: Joi.string().trim().allow(''),
  paymentMethod: Joi.string().valid('cod', 'vnpay', 'momo', 'banking').default('cod'),
  couponCode: Joi.string().trim().allow(''),
  items: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      variantId: Joi.string().allow(null, ''),
      name: Joi.string().required(),
      selectedSize: Joi.string().required(),
      selectedColor: Joi.string().required(),
      price: Joi.number().min(0).required(),
      quantity: Joi.number().integer().min(1).required(),
      image: Joi.string().allow('')
    })
  ).min(1).required().messages({
    'array.min': 'Giỏ hàng phải có ít nhất 1 sản phẩm'
  })
});
