# Database Setup Runbook (Fresh Start with Seed Data — PostgreSQL/Neon)

This runbook provisions a **new** PostgreSQL database for Gamepedia on **Neon** (free tier, no card) and fills it with the demo/seed data. Use it when deploying to Render or switching databases from scratch.

If you need to **preserve existing live data** instead, see [Appendix A](#appendix-a-preserving-existing-live-data).

---

## Prerequisites

- A free **Neon** account (https://neon.tech) — Serverless PostgreSQL, free forever, no credit card.
- A Neon **project** created (the default "main" branch comes with one DB). Give it a name like `gamepedia`.
- `sequelize-cli` is already installed in `projects/server` (devDependency).
- The app reads the DB connection from environment variables (see Step 2) — no code changes needed.

---

## Step 1 — Create the Neon project and copy the connection values

1. Sign in to https://neon.tech and click **Create project**.
2. Choose a name (e.g. `gamepedia`), any region, and the **Free** plan.
3. In the dashboard, open the **Connection Details** panel for the project.
4. Copy the **non-pooled** connection values (the primary host; skip the `?pgbouncer=true` pooled variant — Sequelize works best against the direct connection):

| Key | Value (example) |
|---|---|
| `DB_HOST` | `ep-xxxx-yyyy.eu-central-1.aws.neon.tech` |
| `DB_PORT` | `5432` |
| `DB_USERNAME` | `<db user>` (e.g. `gamepedia_owner`) |
| `DB_PASSWORD` | the project password |
| `DB_NAME` | `neondb` (or the name of the DB you created) |
| `DB_DIALECT` | `postgres` |
| `DB_SSL` | `true` |

> ⚠️ Neon's free plan databases are persistent (unlike Render's built-in free Postgres, which is **deleted after 30 days**).

## Step 2 — Configure the connection

For **local seeding**, set these as environment variables (or in `projects/server/.env` — that file is gitignored):

```ini
DB_DIALECT=postgres
DB_USERNAME=<db user>
DB_PASSWORD=<password>
DB_NAME=neondb
DB_HOST=ep-xxxx-yyyy.eu-central-1.aws.neon.tech
DB_PORT=5432
DB_SSL=true
```

On **Render**, set the same keys in the web service's **Environment** section (Render dashboard → your service → Environment → Add Environment Variables). The server loads them automatically via `dotenv`; `config.js` reads `DB_DIALECT`, `DB_PORT` and `DB_SSL` (when `DB_SSL=true` it enables `dialectOptions.ssl` with `rejectUnauthorized: false`).

### Render web service settings (repo root)

| Setting | Value |
|---|---|
| Environment | Node |
| Build command | `npm install --include=dev && npm run build` |
| Start command | `node projects/server/src/index.js` |
| Root directory | `/` |

> ⚠️ `--include=dev` is required: Render sets `NODE_ENV=production`, which makes plain `npm install` skip devDependencies — and `react-scripts build` (via lerna `npm run build`) needs them (babel/webpack). Environment variables for the DB go in Render → your service → **Environment** (see Step 2).

## Step 3 — Create the schema (migrations)

From `projects/server` (with the DB env vars from Step 2 exported):

```bash
npx sequelize-cli db:migrate
```

This runs the 18 migrations in `src/migrations` and creates all tables (users, profiles, products, carts, transactions, admin, etc.). Migrations are tracked in the `SequelizeMeta` table, so re-running is safe.

> The migrations/models/seeders are portable Sequelize (no MySQL-only SQL or types), so they run unchanged on PostgreSQL.

## Step 4 — Load seed data

From `projects/server`:

```bash
npx sequelize-cli db:seed:all
```

This seeds:

- Transaction statuses (6 lifecycle statuses)
- Super admin — `admin@gamepedia.com` / `admin123`
- Demo user — `demo@gamepedia.com` / `demo123`
- 3 branch stores (Jakarta, Bandung, Surabaya)
- 5 categories + 20 products with detail/price/images + branch stock
- "Switch Sale" discounts on 3 products

> ⚠️ Run the seeder **only once** on a fresh DB. Re-running it duplicates the admin email and demo data. There is no Render shell, so seed from your local machine using the same env vars.

## Step 5 — Verify

From the server directory, confirm the app can reach the DB:

```bash
node src/index.js
```

Then check (adjust the connection values as needed):

```bash
# count tables
psql "postgresql://<db user>:<password>@<host>:5432/<db name>?sslmode=require" -c "\dt" | wc -l
```

And smoke-test the app:

| Action | URL | Expected |
|---|---|---|
| API health | `GET /api/greetings` | `200 {"message":"Hello, Student !"}` |
| Admin login | `POST /api/admin/login` | 200 with `admin@gamepedia.com` / `admin123` |
| User login | `POST /api/users/login` | 200 with `demo@gamepedia.com` / `demo123` |
| Product list | `GET /api/products/get` | 200 with seeded products |

## Step 6 — Images (uploaded files) on Render

- **Product seed images** ship with the deploy inside `projects/server/src/Public/products` and are served at `/Public/...`.
- **User uploads** (payment proofs → `Public/images`, profile pictures → `Public/profile_picture`) are written to the server's local disk at runtime.
- ⚠️ Render free tiers have an **ephemeral filesystem**: uploaded files are **wiped on every redeploy**. This is acceptable for a demo; the product seed images (committed to the repo) survive. Long-term, move uploads to object storage (e.g. S3/R2) or a Render disk add-on.

---

## Appendix A — Preserving Existing Live Data

If you later want to move *existing* data to the new DB instead of starting fresh:

1. Dump the old Postgres DB:
   ```bash
   pg_dump -h <old-host> -U <old-user> -d <old-db> -Fc -f backup.dump
   ```
2. Restore into the new Neon DB:
   ```bash
   pg_restore -h <new-host> -U <new-user> -d <new-db> --no-owner backup.dump
   ```
3. Copy the uploaded files (not stored in the DB) from the old server's `Public` folder.
4. Point the env vars at the new DB and restart.
5. Do **not** run `db:seed:all` on a populated DB — it would duplicate demo records.
