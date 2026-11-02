# AgriTech – Empowering Farmers Through Digital Technology

AgriTech is a comprehensive, production-ready MERN (MongoDB Atlas, Express.js, React.js, Node.js) platform designed to empower agricultural communities. It delivers crop monitoring and phenology tracking, rule-based soil fertility advisory, micro-climate weather forecasts, a single-seller agri-marketplace, a farmer knowledge forum, verified agronomist consultations, and role-based administrative governance.

---

## 🏛️ Architecture & Compliance

The project is built in strict compliance with **Approved Technical Architecture Version 2.3**:
* Documentation: [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md)
* Security Model: JWT Bearer authentication, bcryptjs salted password hashing, IDOR ownership verification, live database status gates, Helmet headers, CORS origin whitelisting, and rate limiting.
* Role-Based Access Control (5 Roles):
  1. **Farmer**: Plot management, crop monitoring, soil test logging, marketplace buying, consultation requests.
  2. **Agricultural Expert**: Consultation answers (upon admin verification), agronomic forum participation.
  3. **Vendor**: Direct product listing, inventory management, single-seller order fulfillment.
  4. **Buyer**: Public catalog browsing, cart ordering, consumer consultation.
  5. **Platform Admin**: Expert verification approval/rejection, user account governance, platform metrics.

---

## 💻 Technology Stack

* **Frontend:** React 19, Vite 8, Bootstrap 5.3, Bootstrap Icons, Axios, React Router 7.
* **Backend:** Node.js, Express.js 5, Mongoose 9, jsonwebtoken, bcryptjs, express-validator, helmet, express-rate-limit.
* **Database:** MongoDB Atlas (Cloud Database with Replica Set).
* **External APIs:** OpenWeatherMap API (with automated fallback to clearly labelled demo data if unconfigured).

---

## 📁 Repository Structure

```text
AgriTech/
├── frontend/                     # React 19 Single Page Application
│   ├── src/
│   │   ├── components/           # Reusable UI cards, modals & tab views
│   │   │   ├── auth/             # ProtectedRoute guards
│   │   │   ├── dashboard/        # FarmCard, CropCard, SoilHealthCard, WeatherCard,
│   │   │   │                     # AddFarmModal, AddCropModal, LogSoilModal,
│   │   │   │                     # MarketplaceTab, ForumTab, ConsultationTab, AdminTab
│   │   ├── context/              # AuthContext (login, register, logout, profile)
│   │   ├── pages/                # LandingPage, LoginPage, RegisterPage, FarmerDashboard
│   │   └── services/             # Axios API client with Bearer interceptors
│   ├── .env.example              # Frontend environment template
│   └── package.json
│
├── backend/                      # Express.js REST API Server
│   ├── config/                   # db.js (Atlas Mongoose connection & DNS resolution)
│   ├── controllers/              # Auth, Farm, Crop, Soil, Weather, Market, Forum, Consultation, Admin
│   ├── middleware/               # authenticateToken, authorizeRoles, checkOwnership, rateLimiter
│   ├── models/                   # User, Farm, Crop, SoilRecord, Product, Cart, Order, ForumPost, Consultation
│   ├── routes/                   # Modular route mounts
│   ├── scripts/                  # seedAdmin.js (Platform admin CLI seed)
│   ├── services/                 # soilRules.js (NPK & pH rule engine), weatherService.js
│   ├── .env.example              # Backend environment template
│   ├── server.js                 # Express server root
│   └── package.json
│
├── docs/
│   └── architecture/
│       └── ARCHITECTURE.md       # Approved Technical Architecture (Version 2.3)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher
* **MongoDB Atlas Account**: Connection URI string with whitelist access for your development IP.

---

### 2. Backend Setup

1. Open your terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```
   Edit `backend/.env` with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:5173
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/agritech?retryWrites=true&w=majority
   JWT_SECRET=your_cryptographically_secure_jwt_secret_64_chars
   JWT_EXPIRES_IN=7d
   OPENWEATHER_API_KEY=your_openweather_api_key_optional
   ADMIN_NAME=Platform Administrator
   ADMIN_EMAIL=admin@agritech.com
   ADMIN_PASSWORD=AdminMaster2026!
   ```

4. Seed the initial platform administrator:
   ```bash
   npm run seed:admin
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   * The API server will boot on `http://localhost:5000`.
   * Verify health at: `http://localhost:5000/api/health`.

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure frontend environment variables:
   ```bash
   cp .env.example .env
   ```
   Ensure `frontend/.env` points to your backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   * Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing & Verification

### Run End-to-End Test Suite
A comprehensive 35-assertion automated test suite validates the entire API and database lifecycle:
```bash
node scratch/test_full_e2e_verification.js
```
**Test Coverage Includes:**
1. Health-check & live MongoDB Atlas connection status.
2. Registration, login, and JWT issuing across all 5 roles.
3. Farm plot CRUD and crop growth stage progression.
4. Soil rule evaluation (NPK & pH thresholds) and mandatory advisory disclaimer persistence.
5. Weather API delivery with explicit `isLive` policy and fallback banner.
6. Marketplace listing, cart management, single-seller checkout rejection and order placement.
7. Community forum permissions and unverified expert read-only enforcement (403 Forbidden).
8. Admin verification portal and live database consultation gate.

### Production Build Verification
To ensure all frontend JSX, CSS, and modules build cleanly without errors:
```bash
cd frontend
npm run build
```

---

## 📡 Core API Reference

| Endpoint | Method | Role / Access | Description |
|---|---|---|---|
| `/api/health` | GET | Public | Server uptime and Atlas connection health |
| `/api/auth/register` | POST | Public | Register new user across any of the 5 roles |
| `/api/auth/login` | POST | Public | Authenticate user and receive JWT Bearer token |
| `/api/auth/me` | GET | Authenticated | Fetch active user profile from database |
| `/api/farms` | GET, POST | Farmer, Admin | List owned plots or register new agricultural parcel |
| `/api/crops` | GET, POST | Farmer, Admin | Crop monitoring list and phenology tracking |
| `/api/crops/:id` | PUT | Farmer, Admin | Update growth stage and irrigation progress |
| `/api/soil` | GET, POST | Farmer, Admin | Run rule engine calculation and store test records |
| `/api/weather` | GET | Authenticated | Micro-climate alerts with live vs. demo tagging |
| `/api/products` | GET, POST | Public (Read), Vendor (Write) | Agri-marketplace catalog & product listings |
| `/api/cart` | GET, POST, DELETE | Authenticated | Cart management with unique user constraint |
| `/api/orders` | POST, GET | Authenticated | Single-seller order validation & placement |
| `/api/forum/posts` | GET, POST | Public (Read), Active (Write) | Community forum threads (pending expert blocked) |
| `/api/forum/posts/:id/comments` | POST | Active Users | Comment on forum discussion threads |
| `/api/consultations` | GET, POST | Farmer, Admin | Submit agronomist consultation requests |
| `/api/consultations/:id/respond` | PUT | Verified Expert | Deliver diagnostic advice (live DB status checked) |
| `/api/admin/metrics` | GET | Platform Admin | System-wide statistics and usage metrics |
| `/api/admin/experts/:id/verify` | PATCH | Platform Admin | Approve or reject agricultural expert credentials |
| `/api/admin/users/:id/status` | PATCH | Platform Admin | Activate or deactivate user accounts |

---

## 🔒 Architectural Rules & Security Notes

1. **Single-Seller MVP Order Rule**:
   The marketplace enforces single-seller checkouts (`marketController.js`). If a cart contains items from multiple vendors, checkout is rejected with HTTP 400 Bad Request to prevent partial fulfillment splits.
2. **Mandatory Soil Advisory Disclaimer**:
   Every soil evaluation calculation automatically attaches and stores the mandatory educational disclaimer:
   > *"These recommendations are indicative, rule-based advisories generated from configurable demo thresholds. They are for educational and preliminary planning purposes only and do not constitute a certified laboratory or agronomist diagnosis. Always consult a qualified local agronomist before applying chemical soil amendments."*
3. **Live DB Expert Status Verification**:
   When answering consultation tickets, the system verifies `expertVerificationStatus === 'verified'` directly against the live MongoDB Atlas document, preventing stale or tampered client tokens from bypassing the verification gate.
4. **JWT Storage in Prototype**:
   In this prototype, the JWT is stored in `localStorage` for responsive client demonstration. In enterprise production, migration to `HttpOnly`, `SameSite=Strict`, `Secure` cookies is recommended to prevent XSS credential exfiltration.
