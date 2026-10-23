# Project Spec: Simple Online Shop (Frontend Only)

**Stack:** Next.js (App Router) + React + TypeScript + Tailwind CSS
**Type:** Class project, frontend only
**Data:** Local array in code (no API, no database)
**Rendering:** SSG and SSR (both used)

***

## 1. Overview

A small online shop. A user can browse products, open a product, add it to a cart, check out, and get an invoice as an HTML file.

There is no backend. Products come from an array in the code. The cart and orders are saved in the browser with `localStorage`. There is no real payment and no login.

## 2. Goals

* Build the full buying flow: catalog, detail, add to cart, cart list, checkout, invoice.
* Use SSG on at least one page and SSR on at least one page.
* Let the user download the invoice as a standalone `.html` file.
* Keep the code clean and easy to explain in class.

## 3. Out of Scope

* Backend, API routes, and database
* User accounts and login
* Real payment
* Admin dashboard
* Product reviews and wishlist
* Email sending

## 4. Tech Stack

| Part                   | Choice                       | Reason                                       |
| ---------------------- | ---------------------------- | -------------------------------------------- |
| Framework              | Next.js 14+ (App Router)     | SSG and SSR built in                         |
| UI library             | React                        | Required by the teacher                      |
| Language               | TypeScript                   | Fewer bugs (JS is fine if the class uses JS) |
| Styling                | Tailwind CSS                 | Fast to write, responsive by default         |
| Product data           | Array in `data/products.ts`  | No API needed                                |
| Product images         | Files in `public/images/`    | Fully local                                  |
| Cart state             | React Context + `useReducer` | Simple, no extra library                     |
| Cart and order storage | `localStorage`               | Works with no server                         |

## 5. Rendering Strategy

| Page           | Route                | Rendering | Why                                                     |
| -------------- | -------------------- | --------- | ------------------------------------------------------- |
| Catalog / Home | `/`                  | **SSG**   | Same for everyone, built once at build time             |
| Product Detail | `/products/[id]`     | **SSR**   | Rendered on every request                               |
| Cart List      | `/cart`              | CSR       | Cart lives in the browser                               |
| Checkout       | `/checkout`          | CSR       | Form with client state                                  |
| Invoice        | `/invoice/[orderId]` | CSR       | Order is in `localStorage`, which the server can't read |

**Why this still counts as SSR and SSG without an API:** these terms are about when and where the page is built, not about where the data comes from. An array read on the server works the same as an API call.

### 5.1 SSG: Catalog

```TSX
// app/page.tsx
import { getProducts } from "@/data/products";

export default function Home() {
  const products = getProducts();
  // render product grid
}
```

No dynamic data and no `cache: no-store`, so Next.js builds this page at build time.

### 5.2 SSR: Product Detail

```TSX
// app/products/[id]/page.tsx
import { notFound } from "next/navigation";
import { getProductById } from "@/data/products";

export const dynamic = "force-dynamic"; // forces SSR

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();
  // render detail
}
```

The line `export const dynamic = "force-dynamic"` is required. With only a local array, Next.js would otherwise try to cache this page, and it would not be real SSR.

### 5.3 How to prove it

Run `npm run build`. The output marks:

* `/` as static (○)
* `/products/[id]` as dynamic (ƒ)

Show this in your demo or put a screenshot in the README.

## 6. Pages and Features

### 6.1 Catalog / Home (`/`) , SSG

**Shows**

* Header with logo, link to cart, and cart item count
* Grid of product cards

**Product card**

* Image
* Title
* Price
* "View" button linking to `/products/[id]`

**Optional extras**

* Search box (client side filter)
* Category filter

**States**

* Empty: "No products found"

### 6.2 Product Detail (`/products/[id]`) , SSR

**Shows**

* Large image
* Title, description, category
* Price (2 decimals)
* Stock status ("In stock" / "Out of stock")
* Quantity selector (min 1, max = stock)
* "Add to Cart" button
* "Back to catalog" link

**Rules**

* If the product doesn't exist, show the 404 page with `notFound()`.
* If stock is 0, disable the Add to Cart button.
* The page itself is a server component. The quantity selector and Add to Cart button go in a separate client component (`AddToCartButton.tsx`) with `"use client"`.

### 6.3 Add to Cart (action)

Not a page. It's an action from the detail page (and optionally the catalog card).

**Behavior**

* If the item is already in the cart, increase its quantity.
* Quantity can't go above stock.
* Show a small toast: "Added to cart".
* Header cart count updates right away.
* Save the cart to `localStorage` on every change.

### 6.4 Cart List (`/cart`) , CSR

**Shows**

* List or table with: image, title, unit price, quantity, line total
* Quantity controls (+ / −)
* Remove button per item
* Summary: subtotal, tax (10%), total
* "Proceed to Checkout" button
* "Continue Shopping" link

**Rules**

* Minimum quantity is 1. Use Remove to delete an item.
* If the cart is empty, show an empty state with a link to the catalog, and disable the checkout button.

### 6.5 Checkout (`/checkout`) , CSR

**Form fields**

| Field     | Rule                                      |
| --------- | ----------------------------------------- |
| Full name | Required, min 2 characters                |
| Email     | Required, valid email format              |
| Phone     | Required, digits only, 8 to 15 characters |
| Address   | Required, min 5 characters                |

**Behavior**

* Show an order summary next to the form.
* Show errors under each field.
* Payment label: "Cash on delivery". No real payment.
* If the cart is empty, redirect to `/cart`.
* On submit:
  1. Validate the form.
  2. Build the `Order` object. Generate an order ID in the browser, for example `ORD-<timestamp>`.
  3. Calculate subtotal, tax, and total.
  4. Save the order in `localStorage` under the key `orders`.
  5. Clear the cart.
  6. Redirect to `/invoice/[orderId]`.

### 6.6 Invoice (`/invoice/[orderId]`) , CSR

**Shows**

* Invoice number (the order ID)
* Date
* Customer name, email, phone, address
* Item table: title, unit price, quantity, line total
* Subtotal, tax, total
* "Download Invoice (.html)" button
* "Back to shop" link

**Rules**

* This is a client component. It reads the order from `localStorage` in a `useEffect`.
* While loading, show a loading state.
* If the order is not found, show an "Order not found" message with a link to the catalog.
* Use the saved totals. Don't recalculate from the cart.
* Orders only exist in the browser that made them. Opening the link in another browser will show "not found". This is expected.

**Download as .html (no server)**

```TypeScript
// lib/downloadInvoice.ts
import { buildInvoiceHtml } from "./invoiceTemplate";
import { Order } from "@/types";

export function downloadInvoice(order: Order) {
  const html = buildInvoiceHtml(order);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `invoice-${order.id}.html`;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}
```

**HTML file rules**

* One standalone file with inline CSS in a `<style>` tag.
* No external scripts, fonts, or images, so it opens correctly offline.
* Escape customer text (name, email, address) before putting it in the HTML, so input like `<script>` can't run inside the file.

## 7. Data Layer

### 7.1 Products array

```TypeScript
// data/products.ts
import { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    title: "Phone",
    description: "A simple smartphone.",
    price: 199.99,
    stock: 10,
    thumbnail: "/images/phone.jpg",
    category: "tech",
  },
  {
    id: 2,
    title: "Shoes",
    description: "Comfortable everyday shoes.",
    price: 49.5,
    stock: 25,
    thumbnail: "/images/shoes.jpg",
    category: "fashion",
  },
  // add at least 8 to 12 products
];

export function getProducts() {
  return products;
}

export function getProductById(id: number) {
  return products.find((p) => p.id === id);
}
```

**Notes**

* Add at least 8 to 12 products across 2 or 3 categories so the catalog looks real.
* Stock is fixed. Placing an order does not reduce it, because the array can't be changed at runtime.

### 7.2 localStorage keys

| Key      | Value        |
| -------- | ------------ |
| `cart`   | `CartItem[]` |
| `orders` | `Order[]`    |

Wrap every read in `try/catch` and handle bad or missing JSON. Return an empty array if something is wrong.

## 8. Data Models

```TypeScript
// types/index.ts
export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  category: string;
};

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

export type Customer = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export type Order = {
  id: string;
  createdAt: string; // ISO date
  customer: Customer;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
};
```

## 9. Cart Logic

**Context exposes**

* `items`
* `addItem(item, qty)`
* `removeItem(productId)`
* `updateQty(productId, qty)`
* `clearCart()`
* `itemCount`
* `subtotal`, `tax`, `total`

**Notes**

* Use `useReducer` with actions: `ADD`, `REMOVE`, `UPDATE_QTY`, `CLEAR`, `LOAD`.
* Load from `localStorage` inside `useEffect` on mount. Doing it during render causes hydration errors.
* Save to `localStorage` whenever `items` change, but only after the first load. Otherwise the empty initial state will overwrite the saved cart.
* Put `CartProvider` in `app/layout.tsx`. The provider file needs `"use client"` at the top.

**Calculations**

* `subtotal = sum(price * quantity)`
* `tax = subtotal * 0.10`
* `total = subtotal + tax`
* Round to 2 decimals when showing.

## 10. Folder Structure

```
online-shop/
├── app/
│   ├── layout.tsx                  // Header + CartProvider
│   ├── page.tsx                    // Catalog (SSG)
│   ├── not-found.tsx
│   ├── products/
│   │   └── [id]/page.tsx           // Detail (SSR)
│   ├── cart/page.tsx               // Cart list (CSR)
│   ├── checkout/page.tsx           // Checkout form (CSR)
│   └── invoice/
│       └── [orderId]/page.tsx      // Invoice (CSR)
├── components/
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   ├── AddToCartButton.tsx
│   ├── CartItemRow.tsx
│   ├── OrderSummary.tsx
│   └── Toast.tsx
├── context/
│   └── CartContext.tsx
├── data/
│   └── products.ts                 // product array + helpers
├── lib/
│   ├── storage.ts                  // safe localStorage helpers
│   ├── orders.ts                   // save and read orders
│   ├── invoiceTemplate.ts          // builds the HTML string
│   ├── downloadInvoice.ts          // Blob download
│   └── validation.ts               // checkout form validation
├── types/
│   └── index.ts
├── public/
│   └── images/                     // product images
└── README.md
```

## 11. Non-Functional Requirements

* **Responsive:** works on mobile, tablet, and desktop.
* **Loading and empty states:** cart, invoice, and catalog handle them.
* **Accessibility:** alt text on images, labels on inputs, visible keyboard focus.
* **Images:** use `next/image` for product images.
* **Formatting:** prices shown with 2 decimals and a currency symbol.
* **Code quality:** no unused code, clear file names, short components.

## 12. Build Order

1. Create the project:
   ```Shell
   npx create-next-app@latest online-shop
   ```
   Choose TypeScript, Tailwind, and App Router.
2. Add `types/index.ts` and `data/products.ts` with sample products and images.
3. Build `Header` and the catalog page (SSG).
4. Build the product detail page (SSR) with `force-dynamic`.
5. Build `CartContext`, then Add to Cart and the toast.
6. Build the cart list page.
7. Build the checkout form with validation and saving the order.
8. Build the invoice page (CSR).
9. Build the invoice HTML template and the download function.
10. Run `npm run build` and check SSG and SSR in the output.
11. Test the full flow, fix bugs, polish the UI.
12. Write the README.

## 13. Testing Checklist

**Catalog**

* [ ] Products display in a grid
* [ ] Build output shows `/` as static (○)

**Detail**

* [ ] Correct product loads from the URL
* [ ] Invalid ID shows 404
* [ ] Build output shows `/products/[id]` as dynamic (ƒ)

**Cart**

* [ ] Add to cart works from the detail page
* [ ] Adding the same item twice increases quantity
* [ ] Quantity can't go above stock
* [ ] Cart count in the header updates
* [ ] Cart persists after refresh
* [ ] Totals are correct

**Checkout**

* [ ] Empty fields show errors
* [ ] Invalid email is rejected
* [ ] Empty cart redirects to `/cart`
* [ ] Successful submit saves the order, clears the cart, and opens the invoice

**Invoice**

* [ ] Shows correct customer and items
* [ ] Refreshing the invoice page still works
* [ ] Download gives a `.html` file
* [ ] The downloaded file opens offline with correct styling
* [ ] Unknown order ID shows "Order not found"

## 14. Deliverables

* Source code in a GitHub repo
* `README.md` with:
  * Setup and run steps
  * Which pages use SSG and which use SSR, and why
  * Screenshot of the `npm run build` output
  * Known limits
* Screenshots or a short demo video of the full flow

## 15. Known Limits

* Orders and cart are stored in the browser only. Clearing browser data deletes them.
* An invoice link only works in the browser that created the order.
* Stock does not change after an order, because the product array is fixed.
* No server side validation, since there is no server.
* Prices come from the array in the code. A user can edit `localStorage` by hand, which is fine for a class project.

## 16. Open Questions for the Teacher

1. App Router or Pages Router?
2. TypeScript or JavaScript?
3. Is using a local array as the data store acceptable?
4. Does the project need to be deployed?
5. Any required UI library (for example Material UI or Bootstrap)?

