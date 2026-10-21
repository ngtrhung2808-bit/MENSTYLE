import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).messages({
    'string.empty': 'Vui lòng nhập họ và tên',
    'string.min': 'Họ tên ít nhất 2 ký tự'
  }),
  fullName: Joi.string().trim().min(2).max(100).messages({
    'string.empty': 'Vui lòng nhập họ và tên',
    'string.min': 'Họ tên ít nhất 2 ký tự'
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Vui lòng nhập email',
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu',
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'any.required': 'Mật khẩu là bắt buộc'
  }),
  phone: Joi.string().pattern(/^(0[3|5|7|8|9])[0-9]{8}$/).allow('').messages({
    'string.pattern.base': 'Số điện thoại không đúng định dạng 10 số của Việt Nam'
  })
}).or('name', 'fullName').messages({
  'object.missing': 'Vui lòng nhập họ và tên'
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().required().messages({
    'string.empty': 'Vui lòng nhập email hoặc tài khoản admin',
    'any.required': 'Email là bắt buộc'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Vui lòng nhập mật khẩu',
    'any.required': 'Mật khẩu là bắt buộc'
  })
});
