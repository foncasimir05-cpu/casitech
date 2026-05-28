# CASITECH — Electronics Marketplace

> Full-stack e-commerce platform. Next.js frontend + Node.js/Express backend + PostgreSQL.

---

## Quick Start (Windows)

### Prerequisites
Install these first (if not already):
- [Node.js 20+](https://nodejs.org) — includes npm
- [PostgreSQL 16](https://www.postgresql.org/download/windows/)
- [Git](https://git-scm.com)

---

### 1. Clone & Install

```bash
git clone https://github.com/yourname/casitech.git
cd casitech
npm run install:all
```

---

### 2. Set Up the Database

Open **pgAdmin** or the psql shell and run:
```sql
CREATE DATABASE casitech_db;
```

---

### 3. Configure Environment Variables

**Backend** — edit `backend/.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=casitech_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=change_this_to_a_long_random_string
```

**Frontend** — edit `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

---

### 4. Run Database Migrations

```bash
cd backend
npm run migrate
```

---

### 5. Start Development Servers

From the root folder:
```bash
npm run dev
```

This starts **both** servers concurrently:
| Server   | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:3000       |
| Backend  | http://localhost:5000       |
| API Docs | http://localhost:5000/health|

---

## Project Structure

```
casitech/
├── package.json              ← root (runs both servers)
├── .gitignore
│
├── backend/
│   ├── src/
│   │   ├── index.js          ← Express entry point
│   │   ├── config/
│   │   │   ├── db.js         ← PostgreSQL connection pool
│   │   │   └── migrate.js    ← Creates all DB tables
│   │   ├── controllers/      ← Business logic
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── order.controller.js
│   │   │   ├── cart.controller.js
│   │   │   ├── payment.controller.js
│   │   │   ├── user.controller.js
│   │   │   └── ...
│   │   ├── routes/           ← API route definitions
│   │   ├── middleware/       ← Auth, validation, file upload
│   │   └── utils/            ← JWT, email, Cloudinary helpers
│   ├── uploads/              ← Local image fallback
│   ├── .env                  ← ⚠ Never commit this
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── app/              ← Next.js 14 App Router pages
    │   ├── components/       ← UI, layout, product, cart, admin
    │   ├── store/            ← Zustand (cart, auth state)
    │   ├── lib/
    │   │   └── api.js        ← Axios client + all API functions
    │   ├── hooks/            ← Custom React hooks
    │   └── types/            ← TypeScript interfaces
    ├── .env.local            ← ⚠ Never commit this
    ├── next.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## API Endpoints

| Method | Route                        | Auth     | Description            |
|--------|------------------------------|----------|------------------------|
| POST   | /api/v1/auth/register        | Public   | Register user          |
| POST   | /api/v1/auth/login           | Public   | Login, returns JWT     |
| GET    | /api/v1/auth/me              | User     | Get current user       |
| GET    | /api/v1/products             | Public   | List products          |
| GET    | /api/v1/products/:id         | Public   | Get product details    |
| POST   | /api/v1/products             | Admin    | Create product         |
| PUT    | /api/v1/products/:id         | Admin    | Update product         |
| DELETE | /api/v1/products/:id         | Admin    | Delete product         |
| POST   | /api/v1/orders               | User     | Place order            |
| GET    | /api/v1/orders               | User     | Get my orders          |
| POST   | /api/v1/payments/create-intent| User    | Create Stripe intent   |
| GET    | /api/v1/cart                 | User     | Get cart               |
| POST   | /api/v1/cart/add             | User     | Add to cart            |

---

## Next Steps

After setup is working:
1. **Auth** — wire JWT login to the frontend store
2. **Stripe** — real payment flow
3. **Cloudinary** — product image uploads
4. **Deploy** — Vercel (frontend) + Railway (backend)

---

*Built with Next.js 14, Node.js, Express, PostgreSQL, Stripe, Cloudinary*
