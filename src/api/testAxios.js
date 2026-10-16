
import axiosInstance from './axiosInstance';

// Kiểm tra request interceptor không cần backend
export async function testAxiosInterceptor() {
  const testToken = 'test-token-123';

  // Lưu token giả để kiểm tra
  const oldToken = localStorage.getItem('menstyle_token');
  localStorage.setItem('menstyle_token', testToken);

  try {
    const config = await axiosInstance.interceptors.request.handlers[0].fulfilled({
      headers: {},
      url: '/test',
      method: 'get',
    });

    console.log('Authorization:', config.headers.Authorization);

    if (config.headers.Authorization === `Bearer ${testToken}`) {
      console.log('TEST PASSED: Token đã được gắn thành công!');
    } else {
      console.error('TEST FAILED: Token chưa được gắn đúng!');
    }
  } finally {
    // Khôi phục token cũ
    if (oldToken === null) {
      localStorage.removeItem('menstyle_token');
    } else {
      localStorage.setItem('menstyle_token', oldToken);
    }
  }
}

export async function testAxiosWithoutToken() {
  const oldToken = localStorage.getItem('menstyle_token');

  try {
    localStorage.removeItem('menstyle_token');

    const config = await axiosInstance.interceptors.request.handlers[0].fulfilled({
      headers: {},
      url: '/test',
      method: 'get',
    });

    if (!config.headers.Authorization) {
      console.log('TEST PASSED: Không có token thì không gửi Authorization!');
    } else {
      console.error('TEST FAILED: Vẫn gửi Authorization khi không có token!');
    }
  } finally {
    if (oldToken === null) {
      localStorage.removeItem('menstyle_token');
    } else {
      localStorage.setItem('menstyle_token', oldToken);
    }
  }
}

export async function testAxios401() {
  const fakeError = {
    response: {
      status: 401,
      data: {
        message: 'Unauthorized'
      }
    }
  };

  try {
    await axiosInstance.interceptors.response.handlers[0].rejected(fakeError);
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('TEST PASSED: Axios xử lý lỗi 401 đúng!');
    } else {
      console.error('TEST FAILED: Xử lý lỗi 401 không đúng!');
    }
  }
}
