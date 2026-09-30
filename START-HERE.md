# Shoplane — start here

Complete project: React storefront, Express API, MongoDB, 36 bundled product photographs,
authentication, bag, demo COD checkout, orders, admin, tests and Vercel configuration.

## 1. Run on Windows

Extract the ZIP. Open the **shoplane** folder in VS Code, where package.json is visible.
Use Node.js 24 LTS. In the terminal:

```bash
npm ci
npm run setup
```

Open **.env in the root shoplane folder**. Replace only the MONGO_URI placeholder
with your complete Atlas connection string. Keep the generated JWT_SECRET.
MONGO_DB_NAME=shoplane explicitly selects the shoplane database. If your existing
store uses another database, set this to that exact name; otherwise the new database
will have a fresh catalog and you will need to register again.

```bash
npm run doctor
npm run dev
```

Open http://localhost:5173 once the API says it is ready. A brief proxy error while
the API starts can be resolved by refreshing. Stop an old running terminal with
Ctrl+C before starting again. No Docker is needed with Atlas.

Doctor checks the connection, indexes and replica-set topology, and inserts missing
catalog products. Normal startup does the same catalog initialization automatically.
**No separate seed command is needed.** Existing stock, admin edits and orders are preserved.

## 2. MongoDB Atlas requirements

The database user needs **readWrite on shoplane** (or your MONGO_DB_NAME), a correct
password and an allowed network connection. Use Atlas Connect → Drivers to obtain
the full URI. Percent-encode reserved characters in the password. Never paste a
secret URI in chat or commit .env to GitHub.

Atlas Network Access must allow your local IP and your hosting environment. A local
connection succeeding does not prove Vercel is allowed. Vercel outbound IPs can vary.
For a student demo, Atlas can allow 0.0.0.0/0, but that opens network access from all
addresses: use a strong password and a database user restricted to this app. Prefer
restricted egress/IP allowlisting where available. The ZIP cannot set account access
or repair incorrect credentials.

## 3. Deploy on Vercel

Upload/push these project files to your repository root; keep your existing .git.
Do not upload node_modules or .env. There is no need to delete your GitHub repo.
If copying into your existing checkout, overwrite matching code files and include
api/, client/public/, scripts/, server/, .github/, vercel.json and package-lock.json.

Import the repository on Vercel or update your existing project:

| Setting | Value |
| --- | --- |
| Root Directory | repository root (folder containing vercel.json and package.json) |
| Framework | Other |
| Install Command | npm ci --include=dev |
| Build Command | npm run build |
| Output Directory | client/dist |
| Node.js | 24.x |

**Import the root .env into Vercel Environment Variables** for Production and Preview.
Local .env changes do not automatically update Vercel. Import after running setup
and entering the real URI. Keep NODEJS_HELPERS=0 and TRUST_PROXY=1. Remove an old
PORT or NODE_ENV=development override if present. Redeploy after saving env changes.

Deploy the whole project once. Do not deploy client/ and server/ separately.

After Ready, open /api/health on your live domain: it should return status ok.
Then test photos, signup, bag and demo order. A successful build alone does not prove
that database credentials or network access work.

## 4. If there is an error

| Code | What to fix |
| --- | --- |
| CONFIG_URI | Complete MONGO_URI; no placeholder values |
| CONFIG_SECRET | Run setup and import generated JWT_SECRET into Vercel |
| DB_AUTH | Atlas database username/password and password encoding |
| DB_PERMISSION | readWrite role on the selected database |
| DB_NETWORK | Cluster status, hostname, Atlas Network Access |
| DB_DUPLICATE | Existing duplicate data blocking a unique index; inspect before changing data |
| DB_INIT | Expand latest runtime log to read name, code and codeName |

Do not increase timeouts to solve wrong credentials. Do not delete database records
to hide an error. The logs exclude the raw connection string and password.

## 5. Admin and tests

Register normally, then grant that account admin access from your local terminal:

```bash
npm run admin -- your-email@example.com
npm run check
npm run test:unit
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Integration and browser tests use an isolated temporary MongoDB replica set, never
your Atlas data. npm test downloads a MongoDB test binary on its first run.
GitHub Actions runs the checks automatically. See docs/CI-CD.md for optional gated
Vercel deployment and the walkthrough.
