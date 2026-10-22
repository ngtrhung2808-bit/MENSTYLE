export const ORDER_STATUSES = [
  { 
    id: 'pending', 
    label: 'Chờ xác nhận', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    desc: 'Đơn hàng mới tạo, đang chờ shop duyệt' 
  },
  { 
    id: 'paid', 
    label: 'Đã thanh toán (ONLINE)', 
    color: 'bg-blue-50 text-blue-700 border-blue-200', 
    desc: 'Đã nhận khoản thanh toán chuyển khoản/ví điện tử' 
  },
  { 
    id: 'handed_over', 
    label: 'Đã giao hàng cho ĐVVC', 
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200', 
    desc: 'Đã bàn giao kiện hàng cho bưu tá / đơn vị vận chuyển' 
  },
  { 
    id: 'delivering', 
    label: 'Đang giao', 
    color: 'bg-sky-50 text-sky-700 border-sky-200', 
    desc: 'Shipper đang trên đường giao hàng đến địa chỉ quý khách' 
  },
  { 
    id: 'completed', 
    label: 'Hoàn thành', 
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200', 
    desc: 'Khách hàng đã nhận hàng và hoàn tất đơn' 
  },
  { 
    id: 'cancelled', 
    label: 'Hủy đơn', 
    color: 'bg-rose-50 text-rose-700 border-rose-200', 
    desc: 'Chưa nhận được thanh toán online hoặc sản phẩm hết hàng' 
  },
  { 
    id: 'returned', 
    label: 'Hoàn hàng', 
    color: 'bg-purple-50 text-purple-700 border-purple-200', 
    desc: 'Khách trả lại hàng theo chính sách đổi trả' 
  },
  { 
    id: 'exchanged', 
    label: 'Đổi hàng', 
    color: 'bg-teal-50 text-teal-700 border-teal-200', 
    desc: 'Hỗ trợ đổi kích cỡ hoặc đổi mẫu mã mới cho khách' 
  }
];

export function getOrderStatusInfo(statusId) {
  const match = ORDER_STATUSES.find(s => s.id === statusId);
  if (match) return match;
  return { 
    id: statusId || 'pending', 
    label: 'Chờ xác nhận', 
    color: 'bg-amber-50 text-amber-700 border-amber-200', 
    desc: '' 
  };
}
