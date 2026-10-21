# MENSTYLE Backend

`npm start` runs the Express application at `src/server.js`. The existing top-level `config/`, `models/`, and `seeders/` directories are retained as legacy scaffolding and are not imported by this entry point.

## Local setup

1. Install Node.js and MongoDB, then run `npm install` from this directory.
2. Copy `.env.example` to `.env`. Set `MONGODB_URI` to a local or isolated test database, set a unique `JWT_SECRET` with at least 32 characters, and set unique seed passwords if you intend to seed.
3. Start the API with `npm run dev`. The default API URL is `http://localhost:5001/api`; the health endpoint is `/api/health`.
4. Set the Frontend `VITE_API_URL=http://localhost:5001/api` in its local environment if the default URL does not apply.

`npm run seed` is additive and idempotent: it inserts missing demo records and preserves existing accounts, inventory, coupon usage, and orders. Demo passwords are only used when the demo users do not already exist.

## Tests

Run `npm test` from this directory. Core endpoints include `GET /api/products`, `POST /api/coupons/validate`, `POST /api/orders`, `GET /api/orders/my-orders`, and Admin-only `GET /api/orders/admin` / `PATCH /api/orders/admin/:id/status`.
