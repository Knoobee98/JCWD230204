    # Gamepedia

**E-commerce for gaming products — consoles, games, and accessories — with multi-branch store inventory.**

A Purwadhika final project monorepo containing a React frontend (`projects/client`) and an Express + Sequelize backend (`projects/server`), managed with Lerna.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Data Model](#data-model)
- [Available Scripts](#available-scripts)
- [Deployment](#deployment)

---

## Overview

Gamepedia is a full-stack e-commerce platform for gaming products. Customers browse a catalog of consoles, games, and accessories, manage a shopping cart, and check out with real shipping-cost calculation (RajaOngkir) and nearest-branch stock deduction. Orders flow through a 6-step status lifecycle (waiting for payment → waiting for confirmation → payment confirmed → delivery → completed, or cancelled).

The backend includes user management (registration with email activation, login, password reset), product/category/stock management, discounts, wishlists, order tracking, and admin panels for super admins and branch admins.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Create React App), React Router v6, Tailwind CSS 3, Flowbite, Chart.js, Axios |
| Backend | Express 4, Sequelize 6 (ORM), MySQL |
| Auth | JWT, bcrypt |
| Files | Multer (disk storage) |
| Email | Nodemailer + Handlebars templates |
| Integrations | RajaOngkir (shipping cost), OpenCage (geocoding), browser geolocation |
| Tooling | Lerna monorepo, npm workspaces |

---

## Features

### Customer
- Registration with email activation, login, keep-login
- Product catalog with category filter, search, sorting, and server-side pagination
- Product detail pages, "What's New" and promo sections on the landing page
- Shopping cart with quantity update and item removal
- Checkout with address selection, RajaOngkir shipping-cost lookup (JNE/POS/TIKI), and nearest-branch stock deduction
- Payment proof upload and order status tracking
- Profile management and password flows (forgot / reset / change)
- Wishlist support (backend ready)

### Admin
- Super admin login and branch admin registration
- Product, branch-stock, and discount management
- Stock history tracking
- Transaction management: get transactions, update status, confirm payments

---

## Project Structure

```
.
├── projects/
│   ├── client/            # React frontend
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── pages/user/       # Customer pages (landing, products, cart, checkout, auth)
│   │   │   ├── pages/admin/      # Admin pages (dashboard, products, transactions)
│   │   │   ├── components/       # Reusable UI components
│   │   │   ├── partials/         # Admin layout & section partials
│   │   │   └── charts/           # Chart.js wrapper components
│   │   ├── .env.development
│   │   └── .env.production
│   └── server/            # Express backend
│       ├── Public/        # Uploaded & seeded product images
│       └── src/
│           ├── controllers/
│           ├── routers/
│           ├── models/            # 20 Sequelize models
│           ├── migrations/        # 18 migrations
│           ├── seeders/
│           ├── middleware/
│           ├── helpers/
│           ├── lib/
│           ├── template/          # Email templates
│           └── config/
├── package.json           # Lerna monorepo root
└── readme.md
```

---

## Getting Started

### Prerequisites
- Node.js 16+
- MySQL server

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the server

Copy `projects/server/.env.example` to `projects/server/.env` and fill in the values:

```bash
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=gamepediadb
DB_DIALECT=mysql
JWT_SECRET=your-secret-key
EMAIL_USER=
EMAIL_PASS=
CLIENT_BASE_URL=http://localhost:3000
RAJAONGKIR_API_KEY=
OPENCAGE_API_KEY=
```

The client uses `projects/client/.env.development` (dev) and `.env.production` (build), which already point to `http://localhost:8000` in development.

### 3. Create the database schema and seed data

From `projects/server`:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Run the app

From the repo root:

```bash
npm start
```

- Client: http://localhost:3000
- API: http://localhost:8000/api

### Demo Credentials

| Role | Email | Password |
|---|---|---|
| Super admin | `admin@gamepedia.com` | `admin123` |
| Demo user | `demo@gamepedia.com` | `demo123` |

---

## API Overview

All routes are prefixed with `/api`. Authenticated endpoints require a JWT sent in a header named `token`.

| Group | Prefix | Description |
|---|---|---|
| Users | `/api/users` | Register, login, keep-login, activation, forgot/reset/change password, profile, profile-picture upload |
| Products | `/api/products` | Product list (filter/sort/pagination), detail, categories, promos, new/recommended products, cart add/get/update/delete |
| Transaction | `/api/transaction` | Place order, get transactions, upload payment proof, cancel/confirm order |
| Admin | `/api/admin` | Admin login/register, product & stock & discount management, transaction status updates |
| RajaOngkir | `/api/rajaOngkir` | City, province, and shipping-cost lookups |
| OpenCage | `/api/openCage` | Place search and user-location geocoding |

---

## Data Model

The database is managed with Sequelize migrations and consists of ~20 models:

- **users / profiles / address** — accounts and profile data
- **products / products_detail / products_image / category** — catalog
- **carts / wishlists** — shopping cart and wishlist
- **branch_store / branch_products** — multi-branch inventory
- **discounts / discount_category** — promotions
- **transactions / transactions_detail / transactions_status / transactions_log** — orders with a 6-status lifecycle
- **admin / stock_history** — administration and stock change tracking

---

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Opens http://localhost:3000 (client) and http://localhost:8000/api (API).

### `npm run clean`

Removes `node_modules` from all projects.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run serve`

Runs the app in the production mode.

### `npm run client` / `npm run install:client` / `npm run install:client:dev`

Run a command or install dependencies on the client project.

### `npm run server` / `npm run install:server` / `npm run install:server:dev`

Run a command or install dependencies on the server project.

---

## Deployment

The client is built with `npm run build` and deployed to Vercel. The production frontend is live at https://jcwd-230204-client.vercel.app.

---

# Gamepedia

**E-commerce produk gaming — konsol, game, dan aksesori — dengan inventaris toko multi-cabang.**

Merupakan proyek akhir Purwadhika dalam bentuk monorepo yang berisi frontend React (`projects/client`) dan backend Express + Sequelize (`projects/server`), dikelola menggunakan Lerna.

---

## Daftar Isi

- [Gambaran Umum](#gambaran-umum)
- [Tech Stack](#tech-stack-1)
- [Fitur](#fitur)
- [Struktur Proyek](#struktur-proyek-1)
- [Memulai](#memulai)
- [Ikhtisar API](#ikhtisar-api)
- [Model Data](#model-data)
- [Skrip yang Tersedia](#skrip-yang-tersedia)
- [Deployment](#deployment-1)

---

## Gambaran Umum

Gamepedia adalah platform e-commerce full-stack untuk produk gaming. Pelanggan dapat menjelajahi katalog konsol, game, dan aksesori, mengelola keranjang belanja, dan melakukan checkout dengan perhitungan ongkos kirim sungguhan (RajaOngkir) serta pemotongan stok dari cabang terdekat. Pesanan mengalir melalui siklus status 6 langkah (menunggu pembayaran → menunggu konfirmasi → pembayaran dikonfirmasi → pengiriman → selesai, atau dibatalkan).

Backend mencakup manajemen pengguna (registrasi dengan aktivasi email, login, reset kata sandi), manajemen produk/kategori/stok, diskon, wishlist, pelacakan pesanan, serta panel admin untuk super admin dan admin cabang.

---

## Tech Stack

| Lapisan | Teknologi |
|---|---|
| Frontend | React 18 (Create React App), React Router v6, Tailwind CSS 3, Flowbite, Chart.js, Axios |
| Backend | Express 4, Sequelize 6 (ORM), MySQL |
| Autentikasi | JWT, bcrypt |
| File | Multer (disk storage) |
| Email | Nodemailer + template Handlebars |
| Integrasi | RajaOngkir (ongkos kirim), OpenCage (geocoding), geolokasi browser |
| Alat | Monorepo Lerna, npm workspaces |

---

## Fitur

### Pelanggan
- Registrasi dengan aktivasi email, login, keep-login
- Katalog produk dengan filter kategori, pencarian, pengurutan, dan paginasi sisi server
- Halaman detail produk, bagian "What's New" dan promo di halaman beranda
- Keranjang belanja dengan pembaruan kuantitas dan penghapusan item
- Checkout dengan pemilihan alamat, pencarian ongkos kirim RajaOngkir (JNE/POS/TIKI), dan pemotongan stok dari cabang terdekat
- Unggah bukti pembayaran dan pelacakan status pesanan
- Manajemen profil dan alur kata sandi (lupa / reset / ganti)
- Wishlist (siap di backend)

### Admin
- Login super admin dan registrasi admin cabang
- Manajemen produk, stok cabang, dan diskon
- Pelacakan riwayat stok
- Manajemen transaksi: ambil transaksi, perbarui status, konfirmasi pembayaran

---

## Struktur Proyek

```
.
├── projects/
│   ├── client/            # Frontend React
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── pages/user/       # Halaman pelanggan (beranda, produk, keranjang, checkout, auth)
│   │   │   ├── pages/admin/      # Halaman admin (dashboard, produk, transaksi)
│   │   │   ├── components/       # Komponen UI yang dapat digunakan ulang
│   │   │   ├── partials/         # Partial layout & section admin
│   │   │   └── charts/           # Komponen wrapper Chart.js
│   │   ├── .env.development
│   │   └── .env.production
│   └── server/            # Backend Express
│       ├── Public/        # Gambar produk yang diunggah & di-seed
│       └── src/
│           ├── controllers/
│           ├── routers/
│           ├── models/            # 20 model Sequelize
│           ├── migrations/        # 18 migrasi
│           ├── seeders/
│           ├── middleware/
│           ├── helpers/
│           ├── lib/
│           ├── template/          # Template email
│           └── config/
├── package.json           # Root monorepo Lerna
└── readme.md
```

---

## Memulai

### Prasyarat
- Node.js 16+
- Server MySQL

### 1. Instal dependensi

```bash
npm install
```

### 2. Konfigurasi server

Salin `projects/server/.env.example` menjadi `projects/server/.env` dan isi nilainya:

```bash
DB_HOST=localhost
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=gamepediadb
DB_DIALECT=mysql
JWT_SECRET=your-secret-key
EMAIL_USER=
EMAIL_PASS=
CLIENT_BASE_URL=http://localhost:3000
RAJAONGKIR_API_KEY=
OPENCAGE_API_KEY=
```

Client menggunakan `projects/client/.env.development` (dev) dan `.env.production` (build), yang pada pengembangan sudah mengarah ke `http://localhost:8000`.

### 3. Buat skema database dan seed data

Dari `projects/server`:

```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 4. Jalankan aplikasi

Dari root repository:

```bash
npm start
```

- Client: http://localhost:3000
- API: http://localhost:8000/api

### Kredensial Demo

| Peran | Email | Kata Sandi |
|---|---|---|
| Super admin | `admin@gamepedia.com` | `admin123` |
| Pengguna demo | `demo@gamepedia.com` | `demo123` |

---

## Ikhtisar API

Semua rute diawali dengan `/api`. Endpoint yang memerlukan autentikasi menggunakan JWT yang dikirim pada header bernama `token`.

| Grup | Prefix | Deskripsi |
|---|---|---|
| Users | `/api/users` | Register, login, keep-login, aktivasi, lupa/reset/ganti kata sandi, profil, unggah foto profil |
| Products | `/api/products` | Daftar produk (filter/sort/pagination), detail, kategori, promo, produk baru/rekomendasi, keranjang tambah/ambil/perbarui/hapus |
| Transaction | `/api/transaction` | Buat pesanan, ambil transaksi, unggah bukti pembayaran, batal/konfirmasi pesanan |
| Admin | `/api/admin` | Login/register admin, manajemen produk & stok & diskon, pembaruan status transaksi |
| RajaOngkir | `/api/rajaOngkir` | Pencarian kota, provinsi, dan ongkos kirim |
| OpenCage | `/api/openCage` | Pencarian tempat dan geocoding lokasi pengguna |

---

## Model Data

Database dikelola dengan migrasi Sequelize dan terdiri dari ±20 model:

- **users / profiles / address** — akun dan data profil
- **products / products_detail / products_image / category** — katalog
- **carts / wishlists** — keranjang belanja dan wishlist
- **branch_store / branch_products** — inventaris multi-cabang
- **discounts / discount_category** — promosi
- **transactions / transactions_detail / transactions_status / transactions_log** — pesanan dengan siklus 6 status
- **admin / stock_history** — administrasi dan pelacakan perubahan stok

---

## Skrip yang Tersedia

Di direktori proyek, Anda dapat menjalankan:

### `npm start`

Menjalankan aplikasi dalam mode pengembangan. Membuka http://localhost:3000 (client) dan http://localhost:8000/api (API).

### `npm run clean`

Menghapus `node_modules` dari semua proyek.

### `npm run build`

Membangun aplikasi untuk produksi ke folder `build`.

### `npm run serve`

Menjalankan aplikasi dalam mode produksi.

### `npm run client` / `npm run install:client` / `npm run install:client:dev`

Menjalankan perintah atau menginstal dependensi pada proyek client.

### `npm run server` / `npm run install:server` / `npm run install:server:dev`

Menjalankan perintah atau menginstal dependensi pada proyek server.

---

## Deployment

Client dibuat dengan `npm run build` dan di-deploy ke Vercel. Frontend produksi aktif di https://jcwd-230204-client.vercel.app.
