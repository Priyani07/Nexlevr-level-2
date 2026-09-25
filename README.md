# Shoplane

Shoplane is a full-stack e-commerce application built with React, Node.js, Express and MongoDB. Customers can browse products, manage a shopping cart and place cash-on-delivery demo orders. Administrators manage products, inventory and order fulfillment.

## Features

- Responsive storefront with 36 products across four categories and bundled product photographs.
- Product search, category filters, sorting and detailed product views.
- Account registration, login and logout.
- Shopping cart that persists after a page refresh.
- Checkout with delivery details, stock validation and order history.
- Admin dashboard for creating, editing and archiving products, updating stock and managing order status.
- GitHub Actions workflow for automated checks, builds and deployment.

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, CSS, Lucide icons |
| Backend | Node.js, Express, REST API |
| Database | MongoDB, Mongoose |
| Authentication | JWT, HttpOnly cookies, bcrypt password hashing |
| Validation | Zod |
| Testing | Node.js test runner, Supertest, Playwright |
| CI/CD | GitHub Actions; Render deployment integration |

## How the Project Works

### Product browsing

The React storefront requests products from the Express API. The API reads active products from MongoDB and applies the requested search, category and sort options. Product photographs are served from the project's public assets.

### Authentication

Registration creates a customer account with a hashed password. After registration or login, the server issues a signed JWT in an HttpOnly cookie. Protected requests validate the token and load the current account from MongoDB. Admin routes also check the account's role.

### Shopping cart

Cart items and quantities are managed in React state and saved in browser local storage. This lets the cart survive a refresh. Users sign in before proceeding to checkout.

### Checkout and orders

The frontend sends product IDs, quantities and delivery details to the API. The server loads current product prices, validates stock and calculates the total. A MongoDB transaction updates inventory and creates the order together. Retrying the same checkout request returns the existing order instead of creating a duplicate.

The order stores a snapshot of the purchased items, prices and delivery address. Customers can view their own order history after checkout.

### Administration

Administrators manage the catalog and inventory through protected API routes. Archiving a product removes it from the active storefront while preserving order history. Orders progress through **Placed → Processing → Shipped → Delivered**.

## Run Locally

Requirements: **Node.js 24** and **MongoDB Atlas or a MongoDB replica set**. Checkout uses database transactions.

From the project root:

```bash
npm ci
npm run setup
```

The setup command creates `server/.env` with a generated JWT secret. Set `MONGO_URI` in that file to your MongoDB connection string, using `shoplane` as the database name. Keep `NODE_ENV=development` for local use.

```bash
npm run seed
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite forwards `/api` requests to the backend on port `5000`.

The seed command adds missing catalog products while preserving existing products, users and orders. Run it when preparing a new database.

### Admin access

Register an account in the app, then run the following command in a second terminal against the same database:

```bash
npm run admin -- your-registered-email@example.com
```

Replace the sample email with your registered email and refresh the app.

### Production build

```bash
npm run build
npm start
```

Express serves the compiled frontend and API together at [http://localhost:5000](http://localhost:5000) when using the default local port. On HTTPS hosting, set `NODE_ENV=production`.

## CI/CD

The workflow in `.github/workflows/ci-cd.yml` runs on pull requests to `main`, pushes to `main` and manual triggers.

1. Install dependencies from the lockfile.
2. Check backend and script syntax.
3. Run API and database integration tests.
4. Build the React frontend.
5. Run browser checkout and mobile layout tests.
6. Deploy the verified commit to Render when deployment is enabled on `main`.

The deployment job checks application health and confirms that the live commit matches the tested revision. See the [deployment guide](docs/DEPLOYMENT.md) for setup and the [CI/CD walkthrough](docs/CI-CD-WALKTHROUGH.md) for the pipeline details.

## Tests

```bash
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

API integration and browser tests use temporary MongoDB replica sets. Internet access is needed for the initial MongoDB binary and browser downloads. Recorded verification results are in the [test report](docs/TEST-REPORT.md).

## Project Structure

| Path | Purpose |
| --- | --- |
| `client/src/` | React storefront, account flows and admin interface |
| `client/public/products/photos/` | Bundled product photographs |
| `server/app.js` | API routes, authentication and checkout logic |
| `server/models.js` | User, Product and Order schemas |
| `server/catalog.json` | Initial product catalog |
| `server/tests/` | API validation and database integration tests |
| `tests/` | Browser tests |
| `scripts/` | Setup, checks and deployment utilities |
| `.github/workflows/` | GitHub Actions configuration |
| `docs/` | API reference, deployment guide and supporting documentation |

API endpoints and request formats are documented in the [API reference](docs/API.md). A [Postman collection](docs/Shoplane.postman_collection.json) and [photo credits](docs/PHOTO-SOURCES.md) are included.
