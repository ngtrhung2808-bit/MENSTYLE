// Dữ liệu cài đặt phân quyền và nhật ký thao tác
export const INITIAL_STAFF_USERS = [
  {
    id: 'staff-1',
    name: 'Quản Trị Viên (Super Admin)',
    email: 'admin@menstyle.vn',
    role: 'super_admin',
    roleTitle: 'Quản Trị Viên Tối Cao',
    status: 'active',
    lastActive: 'Vừa xong',
    permissions: {
      canViewRevenue: true,
      canEditProducts: true,
      canProcessOrders: true,
      canManageReviews: true,
      canManageVouchers: true,
      canEditStorefront: true,
      canManageUsers: true
    }
  },
  {
    id: 'staff-2',
    name: 'Nguyễn Văn Kho',
    email: 'kho.hang@menstyle.vn',
    role: 'warehouse_staff',
    roleTitle: 'Nhân Viên Thủ Kho',
    status: 'active',
    lastActive: '10 phút trước',
    permissions: {
      canViewRevenue: false,
      canEditProducts: true,
      canProcessOrders: true,
      canManageReviews: false,
      canManageVouchers: false,
      canEditStorefront: false,
      canManageUsers: false
    }
  },
  {
    id: 'staff-3',
    name: 'Lê Thu Thảo',
    email: 'cskh.thao@menstyle.vn',
    role: 'cskh_staff',
    roleTitle: 'Nhân Viên CSKH & Đổi Trả',
    status: 'active',
    lastActive: '25 phút trước',
    permissions: {
      canViewRevenue: false,
      canEditProducts: false,
      canProcessOrders: true,
      canManageReviews: true,
      canManageVouchers: true,
      canEditStorefront: false,
      canManageUsers: false
    }
  },
  {
    id: 'staff-4',
    name: 'Trần Marketing',
    email: 'marketing@menstyle.vn',
    role: 'marketing_staff',
    roleTitle: 'Chuyên Viên Nội Dung & Banner',
    status: 'active',
    lastActive: '1 giờ trước',
    permissions: {
      canViewRevenue: false,
      canEditProducts: true,
      canProcessOrders: false,
      canManageReviews: true,
      canManageVouchers: true,
      canEditStorefront: true,
      canManageUsers: false
    }
  }
];

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'log-1',
    userName: 'Admin',
    userRole: 'super_admin',
    action: 'Cập nhật giá sản phẩm',
    target: 'Áo Blazer Nam Italian Wool (Giảm 20%)',
    time: '2026-10-22 16:45:10',
    type: 'warning'
  },
  {
    id: 'log-2',
    userName: 'Admin',
    userRole: 'super_admin',
    action: 'Duyệt trạng thái đơn hàng',
    target: 'Đơn hàng #MS-839201 -> Đã giao hàng cho ĐVVC',
    time: '2026-10-22 16:30:25',
    type: 'success'
  },
  {
    id: 'log-3',
    userName: 'Lê Thu Thảo',
    userRole: 'cskh_staff',
    action: 'Phản hồi đánh giá',
    target: 'Phản hồi bình luận khách hàng Hoàng Minh Tuấn',
    time: '2026-10-22 15:10:44',
    type: 'info'
  },
  {
    id: 'log-4',
    userName: 'Admin',
    userRole: 'super_admin',
    action: 'Phát hành mã khuyến mãi',
    target: 'Mã VIPMEN (Giảm 150.000₫)',
    time: '2026-10-22 14:05:00',
    type: 'primary'
  }
];

export function getStoredStaff() {
  try {
    const raw = localStorage.getItem('menstyle_staff_users');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('menstyle_staff_users', JSON.stringify(INITIAL_STAFF_USERS));
  return INITIAL_STAFF_USERS;
}

export function saveStoredStaff(staff) {
  try {
    localStorage.setItem('menstyle_staff_users', JSON.stringify(staff));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredAuditLogs() {
  try {
    const raw = localStorage.getItem('menstyle_audit_logs');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  localStorage.setItem('menstyle_audit_logs', JSON.stringify(INITIAL_AUDIT_LOGS));
  return INITIAL_AUDIT_LOGS;
}

export function logAdminAction(userName, action, target, type = 'info') {
  try {
    const logs = getStoredAuditLogs();
    const newLog = {
      id: 'log-' + Date.now(),
      userName,
      action,
      target,
      time: new Date().toLocaleString('vi-VN'),
      type
    };
    const updated = [newLog, ...logs].slice(0, 50); // Lưu 50 log gần nhất
    localStorage.setItem('menstyle_audit_logs', JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }
}
