# Meraki by Kritika — E-Commerce Website

> **"Made with Soul, Worn with Ease"**  
> Premium Indian designer womenswear label — Dhanbad, Jharkhand

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vite + React 19 + TypeScript + Tailwind CSS v3 |
| State | Zustand (cart, wishlist, auth) |
| Routing | React Router v6 |
| Charts | Recharts (admin dashboard) |
| Carousels | Embla Carousel |
| Backend | PHP 8.x + MySQL 8.x (Phase 2) |
| Payments | Razorpay (Phase 2) |
| Images | Cloudinary / Hostinger File Manager (Phase 2) |
| Email | PHPMailer / SMTP (Phase 2) |
| Hosting | Hostinger (production), Vercel (staging) |

---

## Local Development

### Prerequisites
- Node.js 18+ 
- npm 9+

### Setup

```bash
# 1. Clone / copy project
cd meraki-by-kritika

# 2. Install dependencies
npm install

# 3. Copy environment variables
cp .env.example .env
# Edit .env with your values

# 4. Start development server
npm run dev
```

The app will be available at http://localhost:5173.

### Build for Production

```bash
npm run build
# Output: dist/ folder - upload contents to Hostinger public_html
```

---

## Project Structure

```
meraki-by-kritika/
├── src/
│   ├── components/
│   │   ├── layout/       # Header, Footer, CartDrawer
│   │   ├── product/      # ProductCard
│   │   └── ui/           # Button, Badge, Input, Modal, Drawer, etc.
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── ProductPage.tsx    # PDP
│   │   ├── CategoryPage.tsx   # PLP + CollectionsPage
│   │   ├── CartPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── AccountPages.tsx   # Login + all account pages
│   │   ├── OtherPages.tsx     # About, FAQ, Blog, Contact, etc.
│   │   └── admin/
│   │       └── AdminPages.tsx # All admin panel pages
│   ├── store/
│   │   ├── cartStore.ts
│   │   ├── wishlistStore.ts
│   │   └── authStore.ts
│   ├── lib/
│   │   ├── mockData.ts    # Phase 1 data
│   │   └── utils.ts       # Helpers
│   ├── types/
│   │   ├── product.ts
│   │   ├── order.ts
│   │   └── index.ts
│   ├── App.tsx            # Route tree
│   ├── main.tsx
│   └── index.css          # Global styles + Tailwind
├── backend/
│   └── schema.sql         # MySQL schema + seed data
├── tailwind.config.js     # Brand palette + typography
├── vite.config.ts
├── .env.example
└── README.md
```

---

## Key URLs

| URL | Description |
|---|---|
| / | Homepage |
| /collections | All categories |
| /collections/:slug | Category product listing |
| /product/:slug | Product detail |
| /cart | Cart page |
| /checkout | Multi-step checkout |
| /account/login | Sign in / create account |
| /account/orders | Order history |
| /wishlist | Public wishlist |
| /admin/login | Admin login |
| /admin | Admin dashboard |
| /admin/products | Product management |
| /admin/orders | Order management |

---

## Admin Access (Phase 1 - Mock)

1. Go to http://localhost:5173/admin/login
2. Enter any email + password (mock auth in Phase 1)
3. You will be logged in as Super Admin

---

## Hostinger Deployment

### 1. Build the Frontend
```bash
npm run build
```

### 2. Upload to Hostinger
1. Log in to Hostinger Control Panel
2. Go to Files > File Manager
3. Navigate to public_html
4. Upload the contents of the dist/ folder
5. Ensure index.html is at the root of public_html

### 3. Configure SPA Routing (.htaccess)
Create public_html/.htaccess:
```
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### 4. Set Up MySQL Database
1. In Hostinger, go to Databases > MySQL Databases
2. Create a new database and user
3. In phpMyAdmin, import backend/schema.sql

---

## Brand Colors

| Role | Hex |
|---|---|
| Primary Mauve | #9B7A93 |
| Primary Dark | #7E5D77 |
| Blush Peach | #F3D9CE |
| Warm Cream | #FBF7F3 |
| Deep Charcoal | #3A2E37 |
| Warm Taupe | #8A7A82 |
| Antique Gold | #C7A96B |
| Sage Green | #7C9473 |
| Muted Rust | #B5544A |

---

(c) 2025 Meraki by Kritika. Handcrafted with love in Dhanbad, Jharkhand.
