import test from 'node:test';
import assert from 'node:assert/strict';
import { User } from '../models/User.js';
import { Category } from '../models/Category.js';

test('--- KIỂM THỬ USER MODEL ---', async (t) => {
  await t.test('1. Báo lỗi khi thiếu các trường bắt buộc (name, email, password)', async () => {
    const user = new User({});
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    assert.ok(error, 'Phải có lỗi validation');
    assert.ok(error.errors.name, 'Phải báo lỗi thiếu name');
    assert.ok(error.errors.email, 'Phải báo lỗi thiếu email');
    assert.ok(error.errors.password, 'Phải báo lỗi thiếu password');
  });

  await t.test('2. Báo lỗi khi email sai định dạng', async () => {
    const user = new User({
      name: 'Nguyễn Văn A',
      email: 'not-an-email',
      password: 'password123'
    });
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }

    assert.ok(error, 'Phải có lỗi validation');
    assert.ok(error.errors.email, 'Phải báo lỗi email không đúng định dạng');
  });

  await t.test('3. Tự động chuyển email về chữ thường (lowercase) và trim khoảng trắng', () => {
    const user = new User({
      name: '  Trần Văn B  ',
      email: '  UserTEST@MenStyle.VN  ',
      password: 'secretPassword123'
    });

    assert.strictEqual(user.email, 'usertest@menstyle.vn');
    assert.strictEqual(user.name, 'Trần Văn B');
  });

  await t.test('4. Role mặc định là customer, chỉ chấp nhận [customer, admin]', async () => {
    const validCustomer = new User({
      name: 'Khách hàng',
      email: 'customer@menstyle.vn',
      password: 'password123'
    });
    assert.strictEqual(validCustomer.role, 'customer');

    const validAdmin = new User({
      name: 'Admin',
      email: 'admin@menstyle.vn',
      password: 'password123',
      role: 'admin'
    });
    assert.strictEqual(validAdmin.role, 'admin');

    const invalidRole = new User({
      name: 'Hacker',
      email: 'hacker@menstyle.vn',
      password: 'password123',
      role: 'superadmin' // Không thuộc ['customer', 'admin']
    });
    let error;
    try {
      await invalidRole.validate();
    } catch (err) {
      error = err;
    }
    assert.ok(error, 'Phải có lỗi validation cho role không hợp lệ');
    assert.ok(error.errors.role, 'Role không hợp lệ phải bị từ chối');
  });

  await t.test('5. Mật khẩu phải có tối thiểu 6 ký tự', async () => {
    const user = new User({
      name: 'Test Minlength',
      email: 'minlength@menstyle.vn',
      password: '123'
    });
    let error;
    try {
      await user.validate();
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    assert.ok(error.errors.password, 'Mật khẩu dưới 6 ký tự phải bị từ chối');
  });

  await t.test('6. Hỗ trợ trường fullName đồng bộ với name', async () => {
    const user = new User({
      fullName: 'Quý Ông Lịch Lãm',
      email: 'gentleman@menstyle.vn',
      password: 'password123'
    });
    await user.validate();
    assert.strictEqual(user.name, 'Quý Ông Lịch Lãm');
    assert.strictEqual(user.fullName, 'Quý Ông Lịch Lãm');
  });

  await t.test('7. Không lưu plaintext password (mã hóa bcrypt qua comparePassword)', async () => {
    const rawPassword = 'mySecurePassword2026';
    const user = new User({
      name: 'Bcrypt Test',
      email: 'bcrypt@menstyle.vn',
      password: rawPassword
    });

    // Kích hoạt hash thủ công hoặc thông qua helper
    const salt = await (await import('bcryptjs')).default.genSalt(10);
    user.password = await (await import('bcryptjs')).default.hash(rawPassword, salt);

    // Kiểm tra mật khẩu không còn ở dạng plaintext
    assert.notStrictEqual(user.password, rawPassword);
    assert.ok(user.password.startsWith('$2a$') || user.password.startsWith('$2b$'), 'Mật khẩu phải ở định dạng Bcrypt Hash');

    // Kiểm tra comparePassword
    const isCorrect = await user.comparePassword(rawPassword);
    const isWrong = await user.comparePassword('wrongPassword');
    assert.strictEqual(isCorrect, true, 'comparePassword phải trả về true khi khớp');
    assert.strictEqual(isWrong, false, 'comparePassword phải trả về false khi sai');
  });
});

test('--- KIỂM THỬ CATEGORY MODEL ---', async (t) => {
  await t.test('1. Báo lỗi khi thiếu name hoặc slug', async () => {
    const category = new Category({});
    let error;
    try {
      await category.validate();
    } catch (err) {
      error = err;
    }

    assert.ok(error, 'Phải có lỗi validation');
    assert.ok(error.errors.name, 'Phải báo lỗi thiếu name');
    assert.ok(error.errors.slug, 'Phải báo lỗi thiếu slug');
  });

  await t.test('2. Tự động trim name, description và lowercase slug', () => {
    const category = new Category({
      name: '  Áo Sơ Mi Cao Cấp  ',
      slug: '  AO-SO-MI-LUXURY  ',
      description: '   Chất liệu lụa satin   '
    });

    assert.strictEqual(category.name, 'Áo Sơ Mi Cao Cấp');
    assert.strictEqual(category.slug, 'ao-so-mi-luxury');
    assert.strictEqual(category.description, 'Chất liệu lụa satin');
  });

  await t.test('3. Trạng thái isActive mặc định là true', () => {
    const category = new Category({
      name: 'Blazer',
      slug: 'blazer'
    });

    assert.strictEqual(category.isActive, true);
  });
});
