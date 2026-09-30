# Shoplane

A MERN e-commerce demo built for Nexlevr Level 2. Start with [START-HERE.md](START-HERE.md)
for local setup and Vercel deployment. No application code edits are needed to configure it.

## Features

- 36 products with bundled local JPEG photos, search, categories and sorting.
- Persistent shopping bag, quantity controls and stock checks.
- Registration/login with hashed passwords and HttpOnly JWT session cookies.
- Demo cash-on-delivery checkout, order history and an admin panel.
- Server-calculated totals, transactional stock updates and idempotent checkout.
- Validation, role checks, request protection and per-instance rate limiting.
- Responsive React/Vite frontend, Express API and MongoDB/Mongoose database.

## Run

```bash
npm ci
npm run setup
# Edit root .env: replace MONGO_URI with your Atlas URI.
npm run doctor
npm run dev
```

Open http://localhost:5173. Setup generates a unique JWT_SECRET. Startup ensures
missing catalog products exist without overwriting stock or admin edits. MONGO_DB_NAME
selects the database explicitly. The database user must have readWrite access to it.

## How it works

The browser calls same-origin /api routes. Locally Vite forwards these to Express
on port 5000. On Vercel, api/index.js forwards them to the same Express application;
static frontend files and photos are served from client/dist. Warm function requests
share a MongoDB connection pool and startup promise. Failed startup can retry.

Products, users and orders are stored in MongoDB. Orders use a transaction to update
stock and save the order together. A unique user/request ID makes repeat submissions
safe. Atlas or another replica set is needed for checkout. The bag is browser-local.
Photos are representative demo images; credits are included in the product detail view.

## Commands

| Command | Purpose |
| --- | --- |
| npm run setup | Prepare .env and generate JWT secret |
| npm run doctor | Check DB, indexes, topology; ensure catalog |
| npm run dev | Run local frontend and API |
| npm run build | Verify bundled assets and build frontend |
| npm start | Serve built app locally |
| npm run seed | Insert missing catalog products manually |
| npm run admin -- email | Promote an existing registered user |
| npm run check | Check server/API/script syntax |
| npm run test:unit | Run deployment/validation tests without MongoDB |
| npm test | Run API integration tests with isolated MongoDB |
| npm run test:e2e | Browser checkout, photo and mobile tests after build |

## Deployment and CI/CD

See [START-HERE.md](START-HERE.md) and [docs/CI-CD.md](docs/CI-CD.md).
Import root .env into Vercel after configuring it locally. The project root is the
folder containing vercel.json; output is client/dist. Environment files are excluded
from Git and deployment uploads. Never put database secrets in VITE_ variables.

Postman: [docs/Shoplane.postman_collection.json](docs/Shoplane.postman_collection.json).

This is an internship demo: COD creates an order record, not a real payment or shipment.
Rate limiting is per function instance; a larger production store needs a shared store.
No live deployment or social-media publication is performed by downloading this ZIP.
