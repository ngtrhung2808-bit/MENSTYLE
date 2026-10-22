import Joi from 'joi';

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'processing', 'delivering', 'completed', 'cancelled')
    .required()
});
