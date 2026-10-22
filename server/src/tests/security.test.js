import test from 'node:test';
import assert from 'node:assert/strict';
import { authorize } from '../middlewares/auth.js';
import { getJwtSecret } from '../config/jwt.js';

test('JWT secret rejects missing or short values', () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  assert.throws(() => getJwtSecret(), /at least 32 characters/);
  process.env.JWT_SECRET = 'short';
  assert.throws(() => getJwtSecret(), /at least 32 characters/);
  if (previous === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previous;
});

test('Admin authorization rejects a customer and permits an admin', () => {
  const middleware = authorize('admin');
  const invoke = (role) => {
    let statusCode = null;
    let continued = false;
    const req = { user: { role } };
    const res = {
      status(code) { statusCode = code; return this; },
      json() { return this; }
    };
    middleware(req, res, () => { continued = true; });
    return { statusCode, continued };
  };

  assert.deepEqual(invoke('customer'), { statusCode: 403, continued: false });
  assert.deepEqual(invoke('admin'), { statusCode: null, continued: true });
});
