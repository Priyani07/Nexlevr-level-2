# Shoplane — Full-Stack E-Commerce Application

Shoplane is a responsive e-commerce application built using React, Node.js, Express and MongoDB. Customers can browse products, manage their shopping bag, create an account and place demo cash-on-delivery orders. Administrators can manage products and update order statuses.

Built for the **Nexlevr Level 2 Full Stack Development Internship**.

**Live Demo:** https://nexlevr-level-2-client.vercel.app/

## Features

### Customer Features

- Browse a catalog of 36 products with bundled product photographs.
- Search products by name.
- Filter products by category and sort by price or name.
- View product details, prices and available stock.
- Add products to a shopping bag and adjust quantities.
- Keep shopping bag items after refreshing the browser.
- Register, sign in and sign out.
- Enter delivery details and place demo cash-on-delivery orders.
- View personal order history and order status.
- Use the application on desktop and mobile screens.

### Admin Features

- Add and edit products.
- Update product prices and stock.
- Archive products to remove them from the storefront.
- View customer orders.
- Update order status from Placed to Processing, Shipped and Delivered.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, CSS, Lucide icons |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JWT, bcrypt, HttpOnly cookies |
| Validation | Zod |
| Testing | Node.js test runner, Supertest, Playwright |
| Hosting | Vercel |
| CI | GitHub Actions |

## How the Application Works

### Product Catalog

The backend retrieves products from MongoDB and returns them through REST API endpoints. The frontend displays the results and sends search, category and sorting options to the API.

Product photographs are included in the project and served from the application's own domain.

### Shopping Bag

The shopping bag is stored in browser local storage, so its contents remain after a page refresh. Customers can change quantities or remove products before checkout.

### Authentication

Passwords are hashed using bcrypt. After registration or login, the server issues a JWT session token in an HttpOnly cookie.

Protected routes require authentication. Admin routes also check the user's role.

### Checkout and Orders

The server checks current prices and stock when an order is submitted. It calculates the final total instead of trusting prices sent by the browser.

MongoDB transactions update stock and save the order together. A unique checkout request ID prevents the same request from creating duplicate orders.

Customers can view only their own order history.

### Deployment

The React frontend and Express API share one Vercel domain. Requests to `/api` are handled by the serverless API entry point.

The backend reuses its MongoDB connection across warm requests. During initialization, missing catalog products are inserted without overwriting existing stock or product edits.

## Project Structure

```text
api/                  Vercel API entry point
client/
  public/             Product photographs and static assets
  src/                React components and styles
server/               Express API, models and database configuration
scripts/              Setup, diagnostics and deployment utilities
tests/                Playwright browser tests
docs/                 Postman collection and project documentation
.github/workflows/    GitHub Actions workflow
.env.example          Environment variable template
vercel.json           Vercel build and routing configuration
```

## Run Locally

### Prerequisites

- Node.js 24 LTS
- npm
- MongoDB Atlas database and a database user with appropriate access

### 1. Clone the Repository

```bash
git clone https://github.com/Priyani07/Nexlevr-level-2.git
cd Nexlevr-level-2
```

### 2. Install Dependencies and Prepare Configuration

```bash
npm ci
npm run setup
```

The setup command creates a root `.env` file and generates a JWT secret.

### 3. Configure MongoDB

Edit the root `.env` file:

- Set `MONGO_URI` to your complete Atlas connection string.
- Set `MONGO_DB_NAME` to the database you want to use.
- Keep the generated `JWT_SECRET`.
- Keep `AUTO_SEED=true` to initialize missing catalog products.

Allow your connection in Atlas Network Access and grant the database user `readWrite` access to the selected database.

Do not commit `.env` to GitHub.

### 4. Check Configuration and Start

```bash
npm run doctor
npm run dev
```

Open **http://localhost:5173**.

The local API runs on port **5000**. Vite forwards frontend API requests to it.

## Admin Access

Register an account through the application, then run:

```bash
npm run admin -- your-email@example.com
```

The command promotes that existing account to administrator in the configured database.

## Testing

```bash
# Check JavaScript syntax
npm run check

# Run deployment and validation tests without MongoDB
npm run test:unit

# Run API integration tests with an isolated MongoDB replica set
npm test

# Verify product assets and build the frontend
npm run build

# Install Chromium and run browser tests
npx playwright install chromium
npm run test:e2e
```

Tests cover authentication, access restrictions, product filtering, checkout, stock updates, order isolation and responsive layout.

## CI/CD

GitHub Actions runs syntax checks, API tests, the production build and Playwright browser tests.

The current deployment uses Vercel's Git integration. This deployment runs independently of GitHub Actions.

The workflow also includes an optional Vercel deployment job that depends on successful tests. It requires Vercel credentials and the `VERCEL_CD_ENABLED` repository variable before it can run.

Setup and workflow explanation: [CI/CD Walkthrough](docs/CI-CD.md).

## Project Scope

Shoplane is an educational e-commerce demo. Cash-on-delivery checkout creates an order record; it does not collect payments or arrange shipments.

Product photographs are representative demo images. Photo credits are available in product details.
