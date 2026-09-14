# Techloom.ai — Software Engineer Intern Practical Assessment

Full-stack solution for the **Techloom.ai Software Engineer Intern Practical Assessment**. This repository contains two production-deployed systems designed to demonstrate high-concurrency order handling, distributed stock reservation engines, atomic state machines, idempotent mock payment gateways, and end-to-end shopping experiences.

---

## 🔗 Live Deployment & Repository Links

> **Important (Submission Guideline #4):** Both sections are fully deployed and live on cloud infrastructure.

| Component | Live URL | Platform | Source Folder |
| :--- | :--- | :--- | :--- |
| **Repository** | [GitHub Repository](https://github.com/Ahileswaran/Techloom_ai_Practical_Assesment) | GitHub | `/` |
| **Task 01: POS Frontend** | [https://aromex-pos-system.vercel.app/](https://aromex-pos-system.vercel.app/) | Vercel | `/task-01/Frontend` |
| **Task 01: POS API** | [https://aromex-pos-system-production.up.railway.app](https://aromex-pos-system-production.up.railway.app) | Railway | `/task-01/Backend` |
| **Task 02: FastSpace Store** | [https://fastspace-store.vercel.app/](https://fastspace-store.vercel.app/) | Vercel | `/task-02/Frontend` |
| **Task 02: Store API** | [https://fastspace-backend-production.up.railway.app](https://fastspace-backend-production.up.railway.app) | Railway | `/task-02/Backend` |

*(Optional Video Walkthrough: [Demo Link Placeholder])*

---

## 📁 Repository Structure

As required by the assessment guidelines, all code is organized cleanly into dedicated `/task-01` and `/task-02` folders:

```text
Practical_Assessment/
│
├── task-01/                                # Section 01: POS Order & Inventory System
│   ├── Backend/                            # Node.js + Express + MySQL API
│   │   ├── config/                         # Connection pool & database schema (schema.sql)
│   │   ├── controllers/                    # Transactional controllers (order, payment, etc.)
│   │   ├── middleware/                     # Error handling & schema validation
│   │   ├── models/                         # Database queries with row-level locking
│   │   ├── routes/                         # REST endpoint definitions
│   │   ├── app.js                          # Express entry point + cron scheduler
│   │   ├── package.json
│   │   └── .env
│   ├── Frontend/                           # React 18 + Vite + Tailwind CSS
│   │   ├── src/
│   │   │   ├── components/                 # InventoryTable, SlipPreview, ReservationTimer, etc.
│   │   │   ├── pages/                      # POSDashboard, Checkout, PaymentSuccess, Cancel
│   │   │   ├── services/                   # Axios API clients with fallback mechanisms
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── .env.production
│   └── Documentations/                     # Architecture & Database Design Specifications (.docx)
│
├── task-02/                                # Section 02: E-Commerce Checkout & Payment System
│   ├── Backend/                            # Node.js + Express + MySQL Store API
│   │   ├── config/                         # DB configuration & e-commerce schema (schema.sql)
│   │   ├── controllers/                    # Products, Cart, Order, Payment, Refund controllers
│   │   ├── middleware/                     # Input validation & error handlers
│   │   ├── models/                         # MySQL models (Product, Cart, Order, Refund, etc.)
│   │   ├── routes/                         # REST API endpoints
│   │   ├── app.js                          # Server setup + reservation cron job
│   │   ├── package.json
│   │   └── .env
│   ├── Frontend/                           # React 18 + Vite + Tailwind CSS Storefront
│   │   ├── src/
│   │   │   ├── components/                 # Navbar, ProductCard, CategorySidebar, PaymentForm, etc.
│   │   │   ├── pages/                      # Home, ItemDetails, Cart, OrderHistory, Cancel, etc.
│   │   │   ├── services/                   # Services (product, cart, order, payment, refund)
│   │   │   └── App.jsx
│   │   ├── package.json
│   │   ├── vite.config.js
│   │   └── .env.production
│   └── Documentation/                      # Store Mockups & System Design Specifications (.docx)
│
├── README.md                               # Project documentation & testing guide
└── .gitignore                              # Git ignore rules
```

---

## 🛠️ Unified Tech Stack

Both systems are built on a consistent, robust full-stack architecture:

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, Lucide/Heroicons
- **Backend:** Node.js, Express.js (RESTful API architecture)
- **Database:** MySQL 8.0 with `mysql2/promise` connection pooling
- **Concurrency & Locking:** SQL Transactions (`BEGIN ... COMMIT / ROLLBACK`) with `SELECT ... FOR UPDATE` row-level locks
- **Scheduling & Cleanup:** `node-cron` for automated 5-minute reservation expiry and stock rollback
- **Idempotency:** UUID v4 idempotency keys with unique database constraints to reject duplicate payments
- **Cloud Hosting:**
  - Frontends deployed on **Vercel** (Edge CDN)
  - Backends and MySQL databases hosted on **Railway**

---

# SECTION 01: POS Order & Inventory System

### Overview
A high-throughput Point-of-Sale system for retail/cafe environments (branded **AROMEX Colombo**), engineered to prevent overselling when multiple cashiers simultaneously purchase limited-stock items.

### Core Architectural Features
1. **Pessimistic Row-Level Locking (`SELECT ... FOR UPDATE`):**
   When creating an order, product rows are locked within an atomic transaction. Other concurrent requests attempting to purchase the same product are queued until the first transaction commits or rolls back, completely eliminating race conditions and negative inventory.
2. **5-Minute Stock Reservation Engine:**
   When an order is created, available stock is immediately deducted and marked with a 5-minute reservation record (`expires_at = NOW() + 5 MIN`).
3. **Automated Cron Expiry:**
   A background `node-cron` worker runs every 60 seconds. Any reservation exceeding 5 minutes without completed payment is automatically transitioned to `Expired`, the parent order is updated to `Expired`, and the reserved inventory is immediately returned to the shelf.
4. **Idempotent Payment Processing:**
   Every payment submission requires a client-generated UUID `idempotency_key`. The `payments` table enforces a `UNIQUE(idempotency_key)` index. Duplicate requests return the original transaction without double-charging or corrupting order state.
5. **Distinct Payment Outcomes:**
   - **Success (70%):** Order status becomes `Paid`, reservation status becomes `completed`.
   - **Failed (20%):** Order status becomes `Failed`, reserved stock is immediately rolled back to inventory, and reservation status becomes `released`.
   - **Timeout (10%):** Order transitions to `Expired`, stock is restored to available inventory.
6. **Live Slip Preview & Colombo Rebrand:**
   Receipt preview renders real-time calculations: subtotal, 5% tax, and total balance formatted in Sri Lankan Rupees (LKR) with simulated thermal barcode.

### API Endpoints (Task 01)
- `GET /api/products` — Retrieve all inventory items with current stock and LKR pricing.
- `GET /api/products/:id` — Retrieve single product details.
- `POST /api/orders` — Atomically validate stock, lock rows, deduct inventory, create reservation, and return order ID.
- `GET /api/orders` — Retrieve all orders.
- `GET /api/orders/:id` — Retrieve order and associated line items.
- `PATCH /api/orders/:id/cancel` — Cancel pending order and immediately restore reserved inventory.
- `GET /api/reservations/:orderId` — Inspect active reservation expiry.
- `DELETE /api/reservations/:orderId` — Manually release reservation and restock items.
- `POST /api/payments/process` — Process payment (cash or card) with idempotency key enforcement.

---

# SECTION 02: E-Commerce Store & Payment System (FastSpace Store)

### Overview
A customer-facing online storefront (**FastSpace Online Store**) featuring rich product discovery, dynamic filtering, persistent cart synchronization, Sri Lankan payment options, and complete post-purchase lifecycle management.

### Core Architectural Features
1. **Dynamic Search & Multi-Criteria Filtering:**
   - Filter by keyword (case-insensitive substring match).
   - Filter by category (`Fashion`, `Electronics`, `Mobile`, `TV`, `Kitchen Items`).
   - Price range filtering (`minPrice` to `maxPrice`).
   - Availability toggle (`inStockOnly = true` ignores items with `stock_quantity = 0`).
   - Paginated grid with responsive thumbnails from Unsplash.
2. **Product Detail View:**
   - Detailed specifications, real-time stock counters, multi-angle thumbnail strip.
   - Out-of-stock overlay ("NO STOCK") disabling "Add to Cart" and "Buy Now".
   - "Similar Items" widget displaying related products in the same category.
3. **Multi-Payment Methods & Sri Lankan Bank Support:**
   - **Credit/Debit Card:** VISA/Mastercard with masked inputs, card number formatting, and CVV validation.
   - **Sri Lankan Bank Transfer:** Dropdown featuring major local banks (Commercial Bank, Sampath Bank, BOC, People's Bank, HNB, NTB, Seylan Bank, etc.), account number, branch, depositor name, and deposit reference along with FastSpace corporate beneficiary details.
   - **Cash on Delivery (COD):** Delivery address confirmation with zero upfront payment.
   - **Mutually Exclusive Selection:** Choosing one payment method disables others until explicitly changed, and payment fields remain neatly collapsed until chosen.
4. **Order History & Cancellation / Refund Flow:**
   - User order history view displaying status badges (`Paid`, `Pending`, `Cancelled`, `Expired`, `Failed`).
   - Cancel Order flow with structured cancellation reason dropdown and automated refund initiation (`card` or `bank_transfer`).

### API Endpoints (Task 02)
- `GET /api/products` — Search, filter, and paginate products (`?search=&category=&minPrice=&maxPrice=&available=&page=&limit=`).
- `GET /api/products/:id` — Product detail with similar products recommendation.
- `GET /api/categories` — List all product categories.
- `GET /api/cart` — Retrieve user cart items.
- `POST /api/cart` — Add product to cart with stock availability check.
- `DELETE /api/cart/:id` — Remove item from cart.
- `DELETE /api/cart` — Clear cart.
- `POST /api/orders` — Create transactional order with 5-minute stock lock.
- `GET /api/orders` — Retrieve user order history.
- `GET /api/orders/:id` — Inspect order details.
- `PATCH /api/orders/:id/cancel` — Cancel order and restore stock.
- `POST /api/payments/process` — Process payment across card, bank transfer, or COD.
- `POST /api/refunds` — Create and process refund for cancelled/failed orders.
- `GET /api/refunds/:orderId` — Check refund status.

---

## ⚙️ Environment Variables

### Task 01: POS System
**Backend (`task-01/Backend/.env`):**
```env
PORT=5000
DB_HOST=localhost            # or Railway ${{MySQL.MYSQLHOST}}
DB_USER=root                 # or Railway ${{MySQL.MYSQLUSER}}
DB_PASSWORD=your_password    # or Railway ${{MySQL.MYSQLPASSWORD}}
DB_NAME=pos_database         # or Railway ${{MySQL.MYSQLDATABASE}}
DB_PORT=3306
FRONTEND_URL=*
```

**Frontend (`task-01/Frontend/.env` or `.env.production`):**
```env
VITE_API_URL=https://aromex-pos-system-production.up.railway.app
```

---

### Task 02: FastSpace Store
**Backend (`task-02/Backend/.env`):**
```env
PORT=5001
DB_HOST=localhost            # or Railway ${{MySQL.MYSQLHOST}}
DB_USER=root                 # or Railway ${{MySQL.MYSQLUSER}}
DB_PASSWORD=your_password    # or Railway ${{MySQL.MYSQLPASSWORD}}
DB_NAME=ecommerce_database   # or Railway ${{MySQL.MYSQLDATABASE}}
DB_PORT=3306
FRONTEND_URL=*
```

**Frontend (`task-02/Frontend/.env` or `.env.production`):**
```env
VITE_API_URL=https://fastspace-backend-production.up.railway.app
```

---

## 💻 Local Setup & Installation

### Prerequisites
- Node.js (v18.0.0 or higher)
- MySQL Server (v8.0+)
- npm or yarn

### 1. Database Initialization
Create the two databases locally and run the provided SQL scripts:

```bash
# Task 01: POS Database
mysql -u root -p < "task-01/Backend/config/schema.sql"

# Task 02: E-Commerce Database
mysql -u root -p < "task-02/Backend/config/schema.sql"
```

### 2. Running Task 01 (POS System)
Open two separate terminals:

```powershell
# Terminal 1: Backend (port 5000)
cd task-01/Backend
npm install
npm run dev

# Terminal 2: Frontend (port 3000)
cd task-01/Frontend
npm install
npm run dev
```
Navigate to `http://localhost:3000`.

### 3. Running Task 02 (FastSpace Store)
Open two separate terminals:

```powershell
# Terminal 3: Backend (port 5001)
cd task-02/Backend
npm install
npm run dev

# Terminal 4: Frontend (port 3001)
cd task-02/Frontend
npm install
npm run dev
```
Navigate to `http://localhost:3001`.

---

## 🧪 Feature Testing Guide

Follow this test matrix to verify all criteria specified in the assessment:

### Task 01: POS System Feature Tests

| Feature | How to Test | Expected Behavior |
| :--- | :--- | :--- |
| **Inventory & Pricing View** | Open POS Dashboard (`/`). | Left panel loads products (Apple, Noodles, Monitor, etc.) with accurate stock and price in LKR. Low stock ($\le 5$) displays in bold red. |
| **Stock Validation & Add Item** | Type `Apple`, enter quantity `5`, click **Add**. | Item appears in "Item Details" middle panel. Slip Preview updates in real-time. |
| **Oversell Prevention** | Look up `Monitor` (Stock: 4). Attempt to add quantity `10`. | System prompts `"Not enough stock."` and rejects the addition. |
| **5-Minute Stock Reservation** | Add items to cart. Observe timer badge. | "Stocks Occupied for 4:59..." countdown begins. |
| **Reservation Expiry** | Wait 5 minutes without checking out. | Reservation timer reaches 0:00. Dialog appears: *"Stock reservation expired. Please restart your order."* Selected items are cleared and stock is released back. |
| **Checkout & Cash Payment** | Click **Proceed to Checkout**. Select **Cash**. Enter Paid Amount $\ge$ Total. Click **Done**. | Calculates exact change balance. Navigates to `/payment-success` displaying itemized receipt and order total. |
| **Card Payment & Idempotency** | Select **Card**. Click **USE THIS CARD**. Click **Done**. | Submits unique UUID idempotency key. Gateway processes transaction and redirects to `/payment-success` or `/payment-failed`. Re-submitting the same key does not create duplicate orders. |
| **Order Cancellation** | On payment failed page or via cancel flow, click **Cancel Order**. | Navigates to `/cancel`. Selecting reason and clicking **Cancel Order** releases reserved stock back to database inventory. |

---

### Task 02: FastSpace Store Feature Tests

| Feature | How to Test | Expected Behavior |
| :--- | :--- | :--- |
| **Product Search** | In top navbar, type `Headphones` and click **Search**. | Grid instantly filters to "Wireless Headphones". |
| **Category Filtering** | Click **Electronics** or **Fashion** in category sidebar. | Product grid displays only items belonging to that category. |
| **Price Range & Availability** | Set Min Price `5000`, Max Price `20000`, check `In stock only`. | Only items matching the criteria with stock $> 0$ appear. Out-of-stock items (e.g. iPhone 15) are hidden. |
| **Product Details & Similar Items** | Click any product card (e.g. "Smart Watch"). | Navigates to `/item/:id`. Shows full description, multi-angle thumbnails, quantity selector, and related electronics in "Similar Items". |
| **Add to Cart & Badge Sync** | On product page, click **Add to cart**. | Navbar cart badge updates in real time and persists across page reloads via local storage sync. |
| **Cart & Reservation Timer** | Click cart icon in navbar. | Opens `/cart` showing line items, subtotal, and 5-minute reservation timer. |
| **Sri Lankan Bank Transfer** | In checkout panel, click **Bank transfer** [Select]. | Other payment buttons become disabled. Form expands showing Commercial Bank, BOC, Sampath, etc., FastSpace company beneficiary account details, account number, and branch inputs. |
| **Card Payment Details** | Click **Pay with card** [Select]. | Card form expands with VISA card formatting, Expiry, and CVV fields. |
| **Cash on Delivery (COD)** | Click **Cash on delivery** [Select]. | Displays cash collection confirmation with recipient name, delivery address, and amount due. |
| **Duplicate Payment Rejection** | Click **Proceed to Pay**. Button enters disabled spinner state. | Prevents double clicking. Idempotency key ensures a single order/charge is created. |
| **Order History** | Click **My Orders** in navbar. | Navigates to `/orders` displaying complete table of past orders, dates, total in LKR, and status badges (`Paid`, `Cancelled`, `Expired`, `Failed`). |
| **Order Cancellation & Refund** | Navigate to `/cancel`. Select refund method (Card / Bank Transfer) and click **Proceed**. | Confirms cancellation and generates a processed refund record. |

---

## 📄 Note on Architecture Documents

In addition to this self-contained `README.md`, full system design documents with visual UI mockups, normalized entity-relationship schemas, and API design specifications are preserved in:
- `/task-01/Documentations/1.POS Order & Inventory System.docx`
- `/task-02/Documentation/2.E-Commerce Checkout & Payment System.docx`

---

## 👤 Candidate Information

- **Candidate Name:** Ahileswaran B.
- **Role:** Software Engineer Intern
- **Assessment:** Techloom.ai Practical Assessment (Sections 01 & 02)
- **Email:** ahileswaran@yahoo.com
