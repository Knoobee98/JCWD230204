# Codebase Review and Action Plan

Reviewed on: 2026-08-06 | Status updated: 2026-08-06

## 1. Executive Summary

This repository is a monorepo for a React client (`projects/client`) and an Express/Sequelize backend (`projects/server`). The stabilization pass described below is complete for the agreed scope: build fixes, security hardening, error sanitization, dead-code removal, and an initial automated test suite. Remaining work is limited to items that were blocked or intentionally deferred (see §5).

## 2. Work Completed

### 2.1 Committed baseline (commit `2071e24` — "Phase C")

- Centralized API client usage; aligned client requests with server response shapes.
- Added route protection for admin/user routes on both client and server.
- Added server-side role authentication and input validation.
- Client build unblocked on Windows via `cross-env` in the build script.

### 2.2 Security and correctness fixes (this commit)

- **Error sanitization** — `usersController.js`, `adminController.js`, `productsController.js`, `transactionController.js`, `rajaOngkirAPI.js`, `openCageAPI.js` no longer leak raw `error.message` / DB errors to clients.
- **Guard clauses** — removed unsafe property access that could throw (`!email.length`, missing `products_details[0]`, null `productDetail`) across controllers.
- **Reset-password flow** — server now emails a signed JWT (`createResetToken`, 1h expiry) in the reset URL instead of a raw user id; client `resetPassword.jsx` no longer sends the id in the body.
- **Safe HTTP methods** — state-changing routes converted from GET to safe methods:
  - `/api/products/add` GET → POST
  - `/api/products/update` GET → PATCH
  - `/api/transaction/confirmOrder` GET → PATCH
  - Clients updated to match (`productDetails.jsx`, `cartPage.jsx`, `transactionList.jsx`).
- **Role claims** — `createToken` now includes a `role` claim; `requireRole` middleware checks `req.uid.role` with fallback to `req.uid.status`; `RequireAuth.jsx` verifies admin roles (`super admin`, `branch admin`) via `/api/admin/checkStatus`.
- **File upload hardening** — `middleware/upload.js` guards missing `req.files` and removes oversized files; upload paths fixed to `Public/profile_picture` and `Public/products_images`.
- **Secrets** — removed `console.log(process.env.RAJAONGKIR_API_KEY)`; `.gitignore` now ignores `projects/server/.env`, `.env`, and `projects/client/build/`.
- **Deferred auth check** — admin `keepLogin`/`checkStatus` guards added for register/login edge cases.
- **JWT fallback** — `JWT_SECRET` falls back to `dev-only-change-me` only outside production; throws in production when unset.

### 2.3 Debug logging removal

- Removed ~56 live `console.log/error/warn` statements across 15 client files.
- Removed remaining server `console.log` statements from controllers; only intentional startup logging remains in `src/index.js`.

### 2.4 Dead-code removal

Deleted 44 tracked files after verifying each had zero importers/usages:

- `src/charts/` — BarChart05/06, LineChart05-09, PieChart (8)
- `src/components/` — AccordionBasic, AccordionTableItem, AccordionTableRichItem, Banner, Banner2, cards-skeleton, DropdownClassic, DropdownFull, DropdownSort, DropdownSwitch, Modal, ModalAction, ModalBasic, ModalBlank, ModalCookies, Notification, PaginationNumeric2, profileModal, Toast, Toast2, Toast3 (22)
- `src/partials/inventory/` — ShopCards01-06, pHistoryTableItem, pStocksTableItem (8)
- `src/pages/admin/` — branchAdmin, branchregister (unrouted; sidebaradmin removed as its only importer)
- Stray files — `client/db.json`, `client/src/db/db.json`, `client/src/logo.svg`, root `.DS_Store`; untracked `package-lock.json.bak` removed.

### 2.5 Automated tests

Added jest + supertest suite in `projects/server/src/__tests__/`:

- `jwtoken.test.js` — token creation/validation, 1d vs 1h expiry, tampered-token rejection.
- `tokenMiddleware.test.js` — `tokenVerify` and `requireRole` behavior (unit, mocked req/res).
- `routes.test.js` — API smoke tests: `/api/greetings`, 404 handling, safe-method conversion, and protected routes rejecting missing tokens before touching the DB.

Run with `npm test` from `projects/server` (all 19 tests pass).

## 3. Verification Performed

- `npm run build` in `projects/client` → "Compiled successfully" after all deletions and logging cleanup.
- Server boot check on port 8000 → `GET /api/greetings` returns `200 {"message":"Hello, Student !"}`.
- `npm test` in `projects/server` → 3 suites, 19 tests passing.

## 4. Blocked / Deferred

- **DB smoke test** — blocked: no MySQL credentials available for the local database.
- **Unreferenced image assets** — deferred by decision: ~110 files under `src/images/` and `src/assets/img` remain; removal is lower-value and higher-risk to verify than code.
- **Jest/CI wiring at workspace root** — the root `npm test` (lerna) will run the server suite; a client test pass and a CI pipeline are still outstanding.

## 5. Remaining Action Plan

### Phase A — Environment and deployment readiness

1. Provision MySQL credentials (local `.env` documented, not committed).
2. Run a full DB smoke test: register → activate → login → browse products → add to cart → checkout → confirm order.
3. Add a CI pipeline (install, lint, test, build) on push/PR.

### Phase B — Correctness and hardening

1. Add client-side tests (at minimum for `RequireAuth.jsx` and the API client).
2. Standardize response envelope on any remaining routes that deviate from `{ isError, message, data }`.
3. Review pagination/sorting consistency across admin tables.

### Phase C — Cleanup

1. Remove unreferenced image assets under `src/images/` and `src/assets/img`.
2. Gate or remove the remaining startup logging in `src/index.js` (optional).

### Phase D — Feature roadmap

1. Product management improvements (CRUD, image validation).
2. Transaction/payment flow polish (status history, clearer admin actions).
3. Sales reporting and inventory dashboards with filters/search/pagination.

## 6. Suggested Implementation Order

1. Provision credentials and run the DB smoke test (Phase A).
2. Add CI (Phase A) and client tests (Phase B).
3. Image-asset cleanup (Phase C).
4. Continue feature work on products, transactions, and reporting (Phase D).
