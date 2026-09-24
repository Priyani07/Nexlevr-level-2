# Shoplane — Level 2 final project

A complete MERN e-commerce **demo** and GitHub Actions CI/CD implementation in one repository.

- **Task 01:** React storefront + Node.js/Express API + MongoDB persistence.
- **Task 02:** automatic tests/build on pull requests and main; optional gated Render deployment with live commit verification.

The source code and guides are included. You still need to create your GitHub repository, configure MongoDB/hosting, get a successful live deployment, record your own demo, and publish your social post/walkthrough to complete the external proof-of-work requirements. No accounts, public posts or deployments were created for you.

## Included

36 products across 4 categories with bundled real stock photographs; responsive storefront; search/category/sort; product details; persistent browser cart; registration/login/logout; cash-on-delivery demo checkout; database-backed order history; role-restricted product create/read/update/archive; order-status management; automated API and browser tests; one-service production build; CI/CD workflow.

**Start with `START-HERE.txt` for the short Windows instructions.** This is the complete project; no earlier ZIP or photo patch is required. All 36 JPG files are already inside `client/public/products/photos`. Displaying the catalog photos does not contact an external photo server. The photographs illustrate demo merchandise; credits are in `docs/PHOTO-SOURCES.md`.

**No payment gateway, card collection or real goods fulfillment.** The task does not require online payments. Admin access is granted by a local command, never by a signup field. Prices are stored as integer paise and computed by the server. Checkout uses a MongoDB transaction and an idempotency key.

## Quick start on Windows (PowerShell, CMD or Git Bash)

### 1. Extract and open the correct folder

Install **Node.js 24** from https://nodejs.org/ and restart your terminal. Extract this ZIP into a new folder, so the final project is separate from any earlier copy. Open a terminal in the **shoplane** folder containing `package.json` (not the parent Downloads folder). In VS Code: File → Open Folder → shoplane → Terminal → New Terminal.

```sh
node -v
npm -v
npm ci
npm run setup
```

`npm run setup` creates `server/.env` and generates your own random JWT secret. It never overwrites an existing environment file. `node_modules` is intentionally not in the ZIP; `npm ci` installs the locked dependencies.

### 2. Connect MongoDB — choose ONE method

**Option A: MongoDB Atlas (no local database installation)**

1. Visit https://www.mongodb.com/atlas and create a cluster. Select a free option only if available; do not select a paid plan unintentionally.
2. Create a database user with a strong password (different from your Atlas login).
3. In Network Access, allow your current public IP.
4. Connect → Drivers → Node.js → copy the connection string.
5. Open `server/.env` and replace only `MONGO_URI` with your real string, including database name `shoplane`:

```dotenv
MONGO_URI=mongodb+srv://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@YOUR_CLUSTER.mongodb.net/shoplane?retryWrites=true&w=majority
```

Replace all placeholders. URL-encode special password characters. Do not paste the real URI into chat, GitHub or a social post. Keep the generated JWT secret. Atlas supports the transactions used by checkout.

**Option B: local MongoDB using Docker Desktop**

With Docker Desktop running, keep the generated local `MONGO_URI` and run:

```sh
docker compose up -d --wait
```

This starts MongoDB with a replica set and a persistent volume. It binds the database port only to localhost. If port 27017 is occupied, stop the other local MongoDB instance first. A plain standalone MongoDB server will not support checkout transactions.

### 3. Add the catalog and run

```sh
npm run seed
npm run dev
```

Open **http://localhost:5173**. The API runs on http://localhost:5000; Vite forwards `/api` requests. Leave this terminal open; Ctrl+C stops the app.

Seeding is repeatable: it inserts missing catalog SKUs and preserves existing products, stock, users and orders. It does not create a shared/default admin password.

### 4. Get admin access

Register your own account in the website. Open a second terminal in the same shoplane folder:

```sh
npm run admin -- your-email@example.com
```

Use the exact registered email address. Refresh the website and click **Admin**. You can add/edit/archive products and advance orders from Placed → Processing → Shipped → Delivered. Archive preserves historical order details; edit and tick “Visible in store” to restore a product.

For seeded products, the original `/products/*.svg` values are kept for database compatibility; the React photo map displays the matching bundled JPG. This also upgrades existing cart and order images. For a new custom product, place your own JPG, JPEG, PNG, WEBP or SVG directly in `client/public/products`, enter `/products/your-file.jpg` (or its matching extension) in the admin form, and rebuild for deployment. Use filenames containing only letters, digits and hyphens. The admin form accepts an image path; it does not upload a file.

### 5. Production build locally

Stop the development server first:

```sh
npm run build
npm start
```

Open **http://localhost:5000**. Express now serves the compiled React app and API together. Keep `NODE_ENV=development` for local HTTP so the session cookie works. On HTTPS hosting, use `NODE_ENV=production`.

## Test commands

```sh
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

The API and browser tests create **isolated temporary MongoDB replica sets** and never connect to your real database. First test execution downloads a MongoDB binary and the browser; internet access is required. Linux users may need `npx playwright install --with-deps chromium`. The browser tests use port 5001.

## Deployment, CI/CD and submission

Read these in order:

1. `docs/DEPLOYMENT.md` — GitHub + Atlas + Render setup.
2. `docs/CI-CD-WALKTHROUGH.md` — pipeline explanation and a walkthrough you can adapt and publish after verifying your own run.
3. `docs/DEMO-AND-SUBMISSION.md` — demo recording script, post drafts and submission checklist.
4. `docs/API.md` — API routes, request shapes and security notes.
5. `docs/TEST-REPORT.md` — actual verification results for this ZIP.

A Postman collection is included at `docs/Shoplane.postman_collection.json`.

## Folder guide

| Path | Purpose |
| --- | --- |
| `client/src` | React UI and responsive styles |
| `client/public/products/photos` | 36 local JPG product photographs |
| `client/public/products` | Original paths retained for compatibility; custom product images |
| `server/app.js` | API routes, validation, auth, checkout transaction |
| `server/models.js` | User, Product and Order MongoDB schemas |
| `server/catalog.json` | Seed catalog |
| `server/tests` | API/database integration tests |
| `tests` | Browser smoke tests |
| `.github/workflows/ci-cd.yml` | CI and deployment jobs |
| `scripts` | Setup, syntax check, isolated test server, deployment |

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `vite`, `concurrently` or a module not found | Run `npm ci` from the folder containing root `package.json`. |
| `ENOENT package.json` | You are in the wrong folder; open the extracted `shoplane` directory. |
| PowerShell blocks `npm.ps1` | Use `npm.cmd` instead of `npm`, or use CMD/Git Bash. No policy change is needed. |
| MongoDB authentication failure | Check Atlas database username/password, URL encoding and connection string. |
| `ECONNREFUSED` / database selection timeout | Start Docker MongoDB, or check Atlas Network Access and your IP. |
| `docker: command not found` | Follow the Atlas option above; Docker is optional. |
| `JWT_SECRET must be...` | Run `npm run setup` in a fresh extraction. If reusing an existing `.env` with an invalid secret, follow `START-HERE.txt`. |
| Vite proxy `ECONNREFUSED 127.0.0.1:5000` | The API has not started. Fix the API terminal's MongoDB/configuration error, then restart `npm run dev`. |
| `Cannot GET /` on port 5000 during development | Open http://localhost:5173 for the storefront. Port 5000 serves the storefront after `npm run build`. |
| `Photo unavailable` | Verify that the entire ZIP was extracted, including `client/public/products/photos`. Open http://localhost:5173/products/photos/studio-headphones.jpg to check. |
| `/api/auth/me` returns 401 before signing in | This is the expected response for a visitor without a session. Sign in to access protected pages. |
| Checkout says replica set / transaction error | Use Atlas or the supplied Docker replica set, not standalone MongoDB. |
| Empty catalog | Set the correct URI, then run `npm run seed`. |
| Port 5000 or 5173 in use | Stop the previous app/terminal using that port, then run again. |
| Login succeeds but cookie isn't kept locally | Keep local `NODE_ENV=development`; production secure cookies require HTTPS. |
| Admin button missing | Register first, run the admin command against the same database, refresh. |
| GitHub deploy job is skipped | Add the deployment secret and repository variables per the deployment guide. |
| First tests download fails | Check internet/firewall access to MongoDB binary and Playwright download hosts, then retry. |

## Scope

This is an internship demo, not a production retail service. It has no email verification, password reset, online payment, refunds, tax engine, inventory reservation before checkout or cancellation workflow. Cart persists in the browser; users/products/orders persist in MongoDB. Admin lists show at most 500 products and 200 recent orders; customer order history shows 100. Search returns at most 200 products. Catalog descriptions and images are illustrative. Adapt branding and explanations so you can confidently explain your own submission.
