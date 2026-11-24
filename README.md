# 🌿 Clothes™ — Accessible Conscious Luxury

<div align="center">

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  <strong>"Minimalism in Everyday Wear"</strong><br />
  A contemporary, editorial-inspired e-commerce storefront engineered with Next.js App Router, React 19, TypeScript, and Tailwind CSS v4.
</p>

**[Explore Features](#-key-features)** • **[Architecture](#-architecture--rendering-strategy)** • **[Quick Start](#-getting-started)** • **[Project Structure](#-project-structure)**

</div>

---

## 📖 Overview

**Clothes™** is a contemporary lifestyle and apparel storefront built around the premise that everyday wear should be intentional, elevated, and timeless. Rejecting disposable fast-fashion and inaccessible ultra-luxury, **Clothes™** delivers an uncompromised standard of **accessible conscious luxury** through tactile fabrics, minimalist silhouettes, and a serene, curated digital shopping experience.

This project delivers a **complete, full-journey e-commerce application** using Next.js App Router with hybrid rendering strategies (SSG, SSR, CSR). It operates fully self-contained without requiring an external backend or database, leveraging mock local data, persistent browser storage, and client-side document generation.

---

## ✨ Key Features

| Feature                             | Description                                                                                                                                       |
| :---------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| 🪞 **Interactive Clothing Rack**    | Custom interactive garment showcase component with kinetic swinging physics and preview interactions.                                             |
| 🛍️ **Comprehensive Catalog**        | Product discovery with dynamic category filtering, price sorting, search, and a responsive filter drawer.                                         |
| 📄 **Dynamic Product Detail (SSR)** | Rich product pages featuring multi-angle imagery, color and size selectors, garment composition, and inventory availability.                      |
| 🛒 **Cart & Slide-out Drawer**      | Global cart state driven by React Context, featuring real-time item count badges, quantity controls, and slide-over mini-cart drawer.             |
| 💳 **Seamless Checkout Flow**       | Multi-step checkout with form validation, localized Cambodia delivery options (provinces and districts), coupon discounts, and order calculation. |
| 🧾 **Offline HTML Invoice Engine**  | Instant client-side generation and download of formatted, standalone HTML invoices with order tracking codes.                                     |
| 🔐 **Mock Authentication Flow**     | Lightweight authentication state allowing guest and simulated member sign-ins with persistent session state.                                      |
| 📱 **Responsive Editorial Design**  | Mobile-first layout crafted with high-end editorial typography, muted luxury palette, and fluid transitions.                                      |

---

## 🏛️ Architecture & Rendering Strategy

The application demonstrates practical Next.js 16 App Router rendering models by selecting the optimal paradigm for each route:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              Clothes™ Shop                             │
└────────────────────────────────────────────────────────────────────────┘
          │
          ├─── [SSG]  /                     Homepage & Featured Lookbook
          ├─── [SSG]  /catalog              Catalog & Product Browsing
          ├─── [SSR]  /products/[id]        Dynamic Product Detail Pages
          ├─── [CSR]  /cart                 Cart Management (localStorage)
          ├─── [CSR]  /checkout             Order Form & Province Selector
          └─── [CSR]  /invoice/[orderId]    Invoice Generator & Downloader
```

| Route                | Rendering | Rationale                                                                     |
| :------------------- | :-------: | :---------------------------------------------------------------------------- |
| `/`                  |  **SSG**  | Pre-rendered at build time for instant initial paint and SEO performance.     |
| `/catalog`           |  **SSG**  | Static product catalog with reactive client-side filtering and sorting.       |
| `/products/[id]`     |  **SSR**  | Rendered per request on the server to demonstrate dynamic route processing.   |
| `/cart`              |  **CSR**  | Client-side only; state resides in user's browser `localStorage`.             |
| `/checkout`          |  **CSR**  | Interactive client form with multi-step inputs, validation, and dynamic fees. |
| `/invoice/[orderId]` |  **CSR**  | Generates offline-ready printable HTML bills retrieved from order history.    |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- **Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **State Management:** React Context API (`CartContext`, `AuthContext`)
- **Persistence:** Browser `localStorage` (Cart items, active orders, auth session)
- **Icons & Assets:** Optimized SVGs, WebP images, and custom SVG iconography

---

## 📂 Project Structure

```text
ec-online-shop/
├── app/                              # Next.js App Router routes & layouts
│   ├── layout.tsx                    # Root layout with Cart & Auth providers
│   ├── page.tsx                      # Homepage / Hero / Interactive showcase (SSG)
│   ├── globals.css                   # Global styles & Tailwind v4 configurations
│   ├── cart/                         # Cart overview page
│   ├── catalog/                      # Product catalog with filters
│   ├── checkout/                     # Checkout & shipping information flow
│   ├── invoice/[orderId]/            # Order confirmation & printable invoice
│   ├── login/                        # Member authentication page
│   └── products/[id]/                # Dynamic product detail page (SSR)
├── components/                       # Modular UI components
│   ├── AddToCartButton.tsx           # Interactive cart trigger with state feedback
│   ├── CartDrawer.tsx                # Slide-over slide-in cart drawer
│   ├── CartItemRow.tsx               # Cart item listing with quantity stepper
│   ├── CatalogClient.tsx             # Catalog client state & filter handlers
│   ├── CatalogFilterDrawer.tsx       # Responsive mobile filter panel
│   ├── ClothingRack.tsx              # Kinetic clothing rack widget
│   ├── Footer.tsx                    # Site-wide editorial footer
│   ├── Header.tsx                    # Sticky navigation bar with cart badge
│   ├── InvoiceClient.tsx             # Invoice renderer & HTML exporter
│   ├── NewsletterForm.tsx            # Subscription newsletter input
│   ├── OrderStepper.tsx              # Checkout progression indicator
│   ├── OrderSummary.tsx              # Price, shipping, and tax summary card
│   ├── PiecesList.tsx                # Curated garment grid showcase
│   ├── ProductCard.tsx               # Product preview card with quick actions
│   └── Toast.tsx                     # Non-intrusive floating feedback notifications
├── context/                          # Global state providers
│   ├── AuthContext.tsx               # Mock authentication state
│   └── CartContext.tsx               # Global shopping cart logic & sync
├── data/                             # Mock data layer
│   └── products.ts                   # Static product inventory, prices, & specs
├── docs/                             # Brand books, design tokens & specifications
├── lib/                              # Helper functions & utilities
│   ├── cambodiaLocations.ts          # Cambodian provinces and districts directory
│   ├── downloadInvoice.ts            # Client-side file downloader
│   ├── invoiceTemplate.ts            # Standalone printable HTML invoice template
│   ├── orders.ts                     # Order calculation & ID generator
│   ├── storage.ts                    # Safe LocalStorage wrapper utilities
│   ├── swing-system.ts               # Animation physics for clothing rack
│   └── validation.ts                 # Form validation utilities
├── public/                           # Static assets, WebP images, and icons
├── package.json                      # Dependencies and npm scripts
├── tsconfig.json                     # TypeScript compiler configuration
└── next.config.ts                    # Next.js configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js**: `v20.x` or higher recommended
- **npm**, **pnpm**, or **yarn**

### 1. Clone & Install

```Shell
git clone https://github.com/your-username/ec-online-shop.git
cd ec-online-shop
npm install
```

### 2. Run the Development Server

```Shell
npm run dev
```

Open <http://localhost:3000> in your browser to experience the storefront.

### 3. Build for Production

```Shell
npm run build
npm run start
```

---

## 📜 Available Scripts

| Command         | Action                                                                    |
| :-------------- | :------------------------------------------------------------------------ |
| `npm run dev`   | Starts the Next.js local development server with Turbopack.               |
| `npm run build` | Compiles and builds the production bundle with Next.js webpack/turbopack. |
| `npm run start` | Boots the pre-built production server.                                    |
| `npm run lint`  | Runs ESLint to check for code quality and convention violations.          |

---

## 🎨 Design System & Palette

Clothes™ utilizes an understated, luxury-conscious palette inspired by architectural minimalism and raw textiles:

| Token                  |    Hex    | Role                                                   |
| :--------------------- | :-------: | :----------------------------------------------------- |
| **Primary Ink**        | `#000000` | Main headings, primary buttons, high-contrast accents  |
| **Background Neutral** | `#F9FAFB` | Primary canvas backdrop and soft section dividers      |
| **Pure Paper**         | `#FFFFFF` | Product cards, modals, and container surfaces          |
| **Accent Terracotta**  | `#864433` | Brand marks, highlighted tags, luxury accents          |
| **Subtle Slate**       | `#6B7280` | Secondary copy, metadata, specifications, and captions |
| **Muted Border**       | `#ECECEC` | Clean hairline strokes and structured dividers         |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use and adapt this codebase for educational and portfolio purposes.
