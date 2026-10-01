import * as orderService from '../services/orderService.js';

export const createOrder = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const order = await orderService.createOrder(req.body, userId);
    res.status(201).json({
      success: true,
      message: 'Đặt hàng thành công',
      data: order
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrdersByUserId(req.user._id);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminStats = async (req, res, next) => {
  try {
    const stats = await orderService.getAdminStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.status(200).json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      data: order
    });
  } catch (error) {
    next(error);
  }
};
