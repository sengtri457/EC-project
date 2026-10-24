# Molla Ecommerce: Laravel + SQLite Build Spec

This is a build plan for an AI agent. Follow it in order. Keep the code simple. Only use routes, controllers, models, migrations, seeders and Blade views.

## 1. Goal

Build an ecommerce site from the Molla HTML template. Every block on the home page must come from the database. No hard coded banners, menus, categories or products in Blade.

What must work:

- Home page with dynamic header, menu, sidebar, hero slider, categories, promo banners, products, footer
- Shop list with category filter, search, sort, pagination
- Product detail page
- Cart, wishlist, compare (counts shown in header)
- Simple checkout that saves an order

## 2. Hard rules

1. The Molla template is already purchased and used. Do not rewrite its CSS or JS. Keep its class names and HTML structure.
2. Copy template assets into `public/assets/`. Reference them with `asset('assets/...')`.
3. One master layout. Every page extends it.
4. Anything used twice becomes a Blade partial or component.
5. No data arrays inside views. Controllers load data. Views only loop and print.
6. Database must be normalized. No comma separated lists, no repeated text columns.
7. No fancy Laravel features. No packages. No repositories, services, events, queues. Plain Eloquent only.
8. Use Laravel default auth only if needed later. Cart and wishlist work for guests using a session token.

## 3. Screen to database map

This is the image broken into blocks. Each block has one source table and one partial.

| UI block                                                            | Source table                             | Blade partial               |
| ------------------------------------------------------------------- | ---------------------------------------- | --------------------------- |
| Logo                                                                | `settings` (site_logo)                   | `partials/header`           |
| Department dropdown in search                                       | `categories` (root only)                 | `partials/header`           |
| Compare, Wishlist, Cart icons and counts                            | session + `wishlist_items`, `cart_items` | `partials/header`           |
| Top nav (Home, Shop, Product, Pages, Blog, Elements) with dropdowns | `menus`, `menu_items` (code `main`)      | `partials/main-nav`         |
| Clearance Up to 30% Off                                             | `menu_items` (code `header_promo`)       | `partials/main-nav`         |
| Browse Categories sidebar with arrows                               | `categories` (parent + children)         | `partials/category-sidebar` |
| Hero carousel (MacBook Air slide)                                   | `hero_slides`                            | `home/_hero`                |
| Explore Popular Categories                                          | `categories` where `is_featured = 1`     | `home/_popular-categories`  |
| 3 promo banners                                                     | `promo_banners`                          | `home/_promo-banners`       |
| Product sections (below the fold)                                   | `products`, `product_images`             | `components/product-card`   |
| Footer links and contact                                            | `menus` (footer codes), `settings`       | `partials/footer`           |

The arrow on a sidebar category means it has children. Show the arrow only when `children->count() > 0`.

## 4. Folder structure

```
app/Models/
  Setting, Menu, MenuItem, Category, Brand, Product, ProductImage,
  HeroSlide, PromoBanner, Cart, CartItem, WishlistItem, Order, OrderItem
app/Http/Controllers/
  HomeController, ShopController, ProductController, SearchController,
  CartController, WishlistController, CompareController, CheckoutController
database/migrations/   one file per table
database/seeders/      one seeder per table + DatabaseSeeder
resources/views/
  layouts/app.blade.php
  partials/ header, main-nav, category-sidebar, footer, breadcrumb, pagination
  components/ product-card.blade.php
  home/ index, _hero, _popular-categories, _promo-banners, _product-section
  shop/ index
  product/ show
  cart/ index
  wishlist/ index
  compare/ index
  checkout/ index, success
routes/web.php
public/assets/         (Molla css, js, images, fonts)
public/uploads/        (seeded images for banners, categories, products)
```

## 5. Database design

SQLite. Use `.env`: `DB_CONNECTION=sqlite`. Create `database/database.sqlite`. In every migration add `$table->timestamps()`. Turn on foreign keys. Index every foreign key and every `slug`.

### settings

Key value store for site wide text.

| column | type          | note                                                                      |
| ------ | ------------- | ------------------------------------------------------------------------- |
| id     | pk            |                                                                           |
| key    | string unique | site_name, site_logo, phone, email, address, footer_text, currency_symbol |
| value  | text nullable |                                                                           |

### menus

| column | type          | note                                                         |
| ------ | ------------- | ------------------------------------------------------------ |
| id     | pk            |                                                              |
| code   | string unique | main, header_promo, footer_help, footer_account, footer_info |
| name   | string        |                                                              |

### menu_items

| column     | type                   | note                          |
| ---------- | ---------------------- | ----------------------------- |
| id         | pk                     |                               |
| menu_id    | fk menus               | cascade                       |
| parent_id  | fk menu_items nullable | for dropdown items            |
| label      | string                 |                               |
| url        | string                 | like `/shop`                  |
| icon       | string nullable        | icon class for the promo link |
| sort_order | integer default 0      |                               |
| is_active  | boolean default 1      |                               |

### categories

One table for the sidebar, the dropdown and the popular grid.

| column      | type                   | note                                |
| ----------- | ---------------------- | ----------------------------------- |
| id          | pk                     |                                     |
| parent_id   | fk categories nullable | null means root                     |
| name        | string                 |                                     |
| slug        | string unique          |                                     |
| image       | string nullable        | used by popular grid                |
| sort_order  | integer default 0      |                                     |
| is_featured | boolean default 0      | shows in Explore Popular Categories |
| is_active   | boolean default 1      |                                     |

### brands

| column | type          |
| ------ | ------------- |
| id     | pk            |
| name   | string        |
| slug   | string unique |

### products

| column            | type                   | note                  |
| ----------------- | ---------------------- | --------------------- |
| id                | pk                     |                       |
| category_id       | fk categories          |                       |
| brand_id          | fk brands nullable     |                       |
| name              | string                 |                       |
| slug              | string unique          |                       |
| sku               | string unique          |                       |
| short_description | string nullable        |                       |
| description       | text nullable          |                       |
| price             | decimal(10,2)          | current regular price |
| sale_price        | decimal(10,2) nullable | null means no sale    |
| stock             | integer default 0      |                       |
| is_new            | boolean default 0      | badge                 |
| is_featured       | boolean default 0      |                       |
| is_active         | boolean default 1      |                       |

### product_images

Separate table so one product can have many images.

| column     | type              | note    |
| ---------- | ----------------- | ------- |
| id         | pk                |         |
| product_id | fk products       | cascade |
| path       | string            |         |
| is_primary | boolean default 0 |         |
| sort_order | integer default 0 |         |

### hero_slides

The big carousel. Fields match the MacBook Air slide in the image.

| column           | type                   | example                    |
| ---------------- | ---------------------- | -------------------------- |
| id               | pk                     |                            |
| subtitle         | string nullable        | Trade-In Offer             |
| title            | string                 | MacBook Air Latest Model   |
| price_prefix     | string nullable        | from                       |
| price            | decimal(10,2) nullable | 999.99                     |
| button_text      | string nullable        | Shop Now                   |
| button_url       | string nullable        | /shop                      |
| image            | string                 | uploads/slides/macbook.jpg |
| background_color | string nullable        | #f5f5f5                    |
| sort_order       | integer default 0      |                            |
| is_active        | boolean default 1      |                            |
| starts_at        | datetime nullable      |                            |
| ends_at          | datetime nullable      |                            |

The price prints as big dollars and small cents. Split in the view: `floor($price)` and the two decimals.

### promo_banners

The 3 cards under popular categories. They have different widths and colors, so keep style fields.

| column           | type                      | example                                              |
| ---------------- | ------------------------- | ---------------------------------------------------- |
| id               | pk                        |                                                      |
| position         | string                    | home_promo (lets you reuse the table on other pages) |
| subtitle         | string nullable           | Weekend Sale                                         |
| title            | string                    | Lighting & Accessories                               |
| description      | string nullable           | 25% off / from \$12,99                               |
| button_text      | string nullable           | Shop Now                                             |
| button_url       | string nullable           |                                                      |
| image            | string                    |                                                      |
| background_color | string nullable           |                                                      |
| column_class     | string default `col-md-3` | controls card width, wide card gets `col-md-6`       |
| sort_order       | integer default 0         |                                                      |
| is_active        | boolean default 1         |                                                      |

### Cart, wishlist

**carts**: `id`, `session_token` (string unique), `user_id` nullable.

**cart_items**: `id`, `cart_id` fk, `product_id` fk, `quantity` integer, `unit_price` decimal(10,2). Unique on (`cart_id`, `product_id`).

**wishlist_items**: `id`, `session_token` string, `product_id` fk, `user_id` nullable. Unique on (`session_token`, `product_id`).

Compare list is not a table. Store product ids in the session, max 4.

### Orders

**orders**: `id`, `order_number` string unique, `user_id` nullable, `customer_name`, `customer_email`, `customer_phone`, `shipping_address` text, `subtotal` decimal, `total` decimal, `status` string default `pending` (pending, paid, shipped, completed, cancelled), `notes` nullable.

**order_items**: `id`, `order_id` fk cascade, `product_id` fk nullable, `product_name` string, `unit_price` decimal, `quantity` integer, `line_total` decimal. Name and price are copied on purpose so old orders keep their history.

### Relationships

```
Menu 1-N MenuItem        MenuItem 1-N MenuItem (children)
Category 1-N Category (children)   Category 1-N Product
Brand 1-N Product        Product 1-N ProductImage
Cart 1-N CartItem N-1 Product
WishlistItem N-1 Product
Order 1-N OrderItem
```

### Model helpers to write

- `Category`: `children()`, `parent()`, `products()`, scopes `active()`, `roots()`, `featured()`
- `MenuItem`: `children()`, scope `active()`
- `Menu`: `items()` returns root items only, ordered
- `Product`: `category()`, `brand()`, `images()`, accessor `primary_image`, accessor `final_price` (sale_price or price), accessor `has_discount`, scopes `active()`, `featured()`, `newest()`
- `HeroSlide`, `PromoBanner`: scope `active()` that checks `is_active` and the date window, ordered by `sort_order`
- `Setting`: static `get($key, $default)`

## 6. Shared layout

`layouts/app.blade.php` holds the full page shell:

```
<head> css from public/assets, @yield('title'), @stack('styles')
<body>
  @include('partials.header')
  @include('partials.main-nav')
  @yield('content')
  @include('partials.footer')
  js scripts, @stack('scripts')
```

The Browse Categories sidebar sits inside the main nav bar in the template. Include it from `main-nav`, not from each page.

### Data shared to every page

Use one View Composer in `AppServiceProvider::boot()` for the `layouts.app` view. It loads:

- `$settings` (all settings as key => value array)
- `$mainMenu`, `$promoMenu`, footer menus (with children)
- `$rootCategories` (active, with active children)
- `$cartCount`, `$wishlistCount`, `$compareCount`

This way no controller repeats this work.

### Reusable components

- `components/product-card.blade.php` takes a `$product`. Shows image, badge, name, price, sale price, add to cart, wishlist, compare buttons. Use it in home, shop, related products, wishlist.
- `partials/breadcrumb.blade.php` takes `$items` array.
- `partials/pagination.blade.php` styles Laravel pagination with Molla classes. Register once with `Paginator::defaultView()`.
- `home/_product-section.blade.php` takes `$title` and `$products`. Used for Featured, New Arrivals, and any other section.

## 7. Routes

```
GET  /                         HomeController@index        home
GET  /shop                     ShopController@index        shop.index
GET  /category/{slug}          ShopController@category     shop.category
GET  /product/{slug}           ProductController@show      product.show
GET  /search                   SearchController@index      search

GET  /cart                     CartController@index        cart.index
POST /cart/add                 CartController@add          cart.add
POST /cart/update              CartController@update       cart.update
POST /cart/remove              CartController@remove       cart.remove

GET  /wishlist                 WishlistController@index    wishlist.index
POST /wishlist/toggle          WishlistController@toggle   wishlist.toggle

GET  /compare                  CompareController@index     compare.index
POST /compare/toggle           CompareController@toggle    compare.toggle

GET  /checkout                 CheckoutController@index    checkout.index
POST /checkout                 CheckoutController@store    checkout.store
GET  /order-success/{number}   CheckoutController@success  checkout.success
```

All POST forms use `@csrf` and redirect back with a flash message. No JavaScript required. Use plain forms first.

Menu `url` values in the database should match these paths.

## 8. Controllers

**HomeController\@index**

```
$slides      = HeroSlide::active()->get();
$featuredCategories = Category::active()->featured()->orderBy('sort_order')->get();
$promoBanners = PromoBanner::active()->where('position','home_promo')->get();
$featuredProducts = Product::active()->featured()->with('images')->take(8)->get();
$newProducts = Product::active()->newest()->with('images')->take(8)->get();
```

**ShopController**: one private method builds the query. Filters: `category` (include child categories), `q`, `min_price`, `max_price`, `sort` (newest, price_asc, price_desc, name). Paginate 12. Keep query string with `withQueryString()`.

**ProductController\@show**: load product with images, category, brand. Related products: same category, exclude self, take 4.

**SearchController**: search `name`, `sku`. Optional `category` id from the department dropdown. Return the shop view.

**CartController**: find or create cart by session token. Add increments quantity. Cap by stock. Update and remove by `cart_item_id`. Subtotal computed in the view from items.

**WishlistController / CompareController**: toggle add or remove, redirect back.

**CheckoutController**: validate name, email, phone, address. Inside `DB::transaction`: create order, copy cart items to order_items, reduce stock, delete cart items. Redirect to success page.

## 9. Seed data

Seeders must produce a full working home page. Use the screenshot as the source.

**settings**: site_name Molla, site_logo, phone, email, address, footer_text, currency_symbol `$`.

**menus**:

- `main`: Home, Shop (children: Shop List, By Category), Product (children: Default, Featured), Pages (About, Contact, FAQ), Blog, Elements
- `header_promo`: one item, label `Clearance Up to 30% Off`, url `/shop?sale=1`
- footer menus with a few links each

**categories (root)**: Electronics, Furniture, Cooking, Clothing, Home Appliances, Healthy & Beauty, Shoes & Boots, Travel & Outdoor, Smart Phones, TV & Audio, Gift Ideas.

Children: Electronics has Computers, Laptops, Cameras. Furniture has Chairs, Sofas. Cooking has Mixers, Cookware. Clothing has Women, Men.

**Featured categories (6)**: Computer & Laptop, Lighting, Smart Phones, Televisions, Cooking, Furniture. Set `is_featured = 1` and an image for each.

**hero_slides**: 3 slides. Slide 1 is Trade-In Offer, MacBook Air Latest Model, from 999.99. The image shows 3 dots, so seed 3.

**promo_banners**: 3 rows.

1. Weekend Sale, Lighting & Accessories, 25% off, `col-md-3`
2. Amazing Value, Clothes Trending Spring Collection 2019, from \$12,99, `col-md-6`
3. Smart Offer, Anniversary Special, 15% off, `col-md-3`

**products**: at least 24 across the categories, 1 to 3 images each, some with `sale_price`, some `is_new`, some `is_featured`. Use a factory or a plain loop.

Put seeded images in `public/uploads/`. Use placeholder files if the real ones are missing.

## 10. Blade rules

- Images from the database: `asset($slide->image)`.
- Money: one helper `money($amount)` in `app/helpers.php` (autoload in composer.json) that prints symbol from settings plus two decimals.
- Hero: loop `$slides`. The first one gets the active class.
- Sidebar: loop `$rootCategories`. Print arrow icon only if children exist. Show children in a dropdown.
- Main nav: loop `$mainMenu`. If an item has children, print the dropdown markup the template already uses.
- Active link: compare `request()->is(ltrim($item->url,'/'))`.
- Empty states: if a list is empty, skip the whole section. Do not print an empty block.
- Escape output with `{{ }}`. Use `{!! !!}` only for trusted description HTML.

## 11. Build order

The agent should finish and test each phase before the next.

**Phase 1: Setup**

- New Laravel project, SQLite configured
- Copy Molla assets into `public/assets`
- Convert template `index.html` into `layouts/app.blade.php` plus the header, nav, footer partials
- Check: page loads with styles and no 404 assets

**Phase 2: Database**

- All migrations, models, relations, scopes
- All seeders
- Check: `php artisan migrate:fresh --seed` runs clean

**Phase 3: Dynamic home page**

- View Composer for shared data
- Header, menu, sidebar, hero, popular categories, promo banners, product sections, footer all from the database
- Check: change a row in SQLite and the home page changes. Disable a slide with `is_active = 0` and it disappears.

**Phase 4: Catalog**

- Shop list, category page, search, product detail
- Product card component used everywhere
- Check: filters, sorting, pagination all work together

**Phase 5: Cart, wishlist, compare**

- Header counts update after each action
- Check: add, update quantity, remove, stock limit

**Phase 6: Checkout**

- Order and order items saved, stock reduced, cart cleared
- Check: order shows in database with copied names and prices

**Phase 7 (optional)**

- Blog posts table (`blog_posts`, `blog_categories`)
- Admin pages to edit slides and banners
- Customer login and order history

## 12. Acceptance checklist

- [ ] No Blade file contains a hard coded menu, category, banner, or product
- [ ] Header, nav, sidebar and footer exist once in one place only
- [ ] Product card exists once and is reused
- [ ] Every table has foreign keys and indexes
- [ ] No repeated data in tables. Prices, names and images live in one place each (order_items is the only intentional copy)
- [ ] `migrate:fresh --seed` gives a complete working site
- [ ] Template CSS and JS are untouched
- [ ] Code has no packages beyond a fresh Laravel install

## 13. Notes for the agent

- If the template needs a class that the data does not give, add a column. Do not hard code it.
- Keep controllers short. If a query is repeated twice, make it a model scope.
- Do not invent extra tables. If something is unclear, pick the simplest option and leave a short comment.
- Start with the home page. Show the result before building more.

## 14. Update: Every Page Is Dynamic

This section replaces the home page only focus. The scope is now the whole site. Every page, every text block, every image, every link, every list must come from the database. If this section conflicts with sections 1 to 13, this section wins.

One rule for the whole project: **a Blade file may only hold layout markup and field names. It never holds real content.** Even the About page text, the FAQ answers and the Contact address are rows in tables.

### 14.1 Page list

| Page              | URL                             | Controller\@method           | View                | Data source                                                                       |
| ----------------- | ------------------------------- | ---------------------------- | ------------------- | --------------------------------------------------------------------------------- |
| Home              | `/`                             | HomeController\@index        | `home/index`        | hero_slides, categories, promo_banners, features, home_sections, products, brands |
| Shop              | `/shop`                         | ShopController\@index        | `shop/index`        | products, categories, attributes, brands                                          |
| Category          | `/category/{slug}`              | ShopController\@category     | `shop/index`        | same as shop, filtered                                                            |
| Search            | `/search`                       | SearchController\@index      | `shop/index`        | products                                                                          |
| Product detail    | `/product/{slug}`               | ProductController\@show      | `product/show`      | products, product_images, attribute values, product_reviews                       |
| Add review        | `/product/{slug}/review` (POST) | ReviewController\@store      | redirect            | product_reviews                                                                   |
| Cart              | `/cart`                         | CartController\@index        | `cart/index`        | cart_items, shipping_methods, coupons                                             |
| Apply coupon      | `/cart/coupon` (POST)           | CartController\@coupon       | redirect            | coupons                                                                           |
| Checkout          | `/checkout`                     | CheckoutController\@index    | `checkout/index`    | cart, addresses, shipping_methods                                                 |
| Order success     | `/order-success/{number}`       | CheckoutController\@success  | `checkout/success`  | orders                                                                            |
| Wishlist          | `/wishlist`                     | WishlistController\@index    | `wishlist/index`    | wishlist_items                                                                    |
| Compare           | `/compare`                      | CompareController\@index     | `compare/index`     | products + attribute values                                                       |
| Login             | `/login`                        | AuthController\@showLogin    | `auth/login`        | users                                                                             |
| Register          | `/register`                     | AuthController\@showRegister | `auth/register`     | users                                                                             |
| Account dashboard | `/account`                      | AccountController\@dashboard | `account/dashboard` | users, orders                                                                     |
| My orders         | `/account/orders`               | AccountController\@orders    | `account/orders`    | orders                                                                            |
| Order detail      | `/account/orders/{number}`      | AccountController\@order     | `account/order`     | orders, order_items                                                               |
| My addresses      | `/account/addresses`            | AddressController (CRUD)     | `account/addresses` | addresses                                                                         |
| Profile           | `/account/profile`              | AccountController\@profile   | `account/profile`   | users                                                                             |
| Blog list         | `/blog`                         | BlogController\@index        | `blog/index`        | blog_posts                                                                        |
| Blog category     | `/blog/category/{slug}`         | BlogController\@category     | `blog/index`        | blog_categories                                                                   |
| Blog tag          | `/blog/tag/{slug}`              | BlogController\@tag          | `blog/index`        | blog_tags                                                                         |
| Blog detail       | `/blog/{slug}`                  | BlogController\@show         | `blog/show`         | blog_posts, blog_comments                                                         |
| Add comment       | `/blog/{slug}/comment` (POST)   | BlogController\@comment      | redirect            | blog_comments                                                                     |
| About             | `/about`                        | PageController\@about        | `pages/about`       | pages, team_members, testimonials, features                                       |
| Contact           | `/contact`                      | ContactController\@index     | `pages/contact`     | pages, store_locations, settings                                                  |
| Send message      | `/contact` (POST)               | ContactController\@store     | redirect            | contact_messages                                                                  |
| FAQ               | `/faq`                          | FaqController\@index         | `pages/faq`         | pages, faq_categories, faqs                                                       |
| Generic page      | `/page/{slug}`                  | PageController\@show         | `pages/show`        | pages (privacy, terms, shipping, returns)                                         |
| Newsletter        | `/newsletter` (POST)            | NewsletterController\@store  | redirect            | newsletter_subscribers                                                            |
| 404               | any unknown                     | handled in `errors/404`      | `errors/404`        | settings                                                                          |

**The template Elements menu** is a set of demo pages for UI parts. Do not build them. Remove it from the seeded `main` menu.

Menu items for About, Contact, FAQ, Privacy and so on must point to the URLs above. Seed them in `menu_items`. Do not type them in Blade.

### 14.2 Extra tables

All earlier tables stay. These are new or changed. Every table gets `timestamps()`, foreign key indexes, and `is_active` and `sort_order` where it is a list shown to visitors.

**Changed tables**

- `users`: add `phone` string nullable, `role` string default `customer` (customer, admin).
- `brands`: add `logo` string nullable, `is_active` boolean. Used by the home brand carousel.
- `categories`: add `banner_image` string nullable, `description` text nullable. Used by the shop page header.
- `orders`: add `shipping_method_id` fk nullable, `coupon_id` fk nullable, `shipping_cost` decimal, `discount` decimal default 0, `payment_method` string default `cod`. Keep the copied customer fields.
- `carts`: add `coupon_id` fk nullable.
- `settings`: add keys for social links is **not** needed. Social links live in the `footer_social` menu.

**Shop and product**

| table                    | columns                                                                                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| attributes               | id, name (Color, Size, Storage), slug unique, type (color, text)                                                                                             |
| attribute_values         | id, attribute_id fk, value (Black, 128GB), color_code nullable, sort_order                                                                                   |
| product_attribute_values | product_id fk, attribute_value_id fk, primary key on both. Normalized link, no comma lists.                                                                  |
| product_reviews          | id, product_id fk, user_id fk nullable, name, rating tinyint 1 to 5, title nullable, body text, is_approved boolean default 0                                |
| shipping_methods         | id, name (Free, Standard, Express), cost decimal, min_order_total decimal nullable, is_active, sort_order                                                    |
| coupons                  | id, code unique, type (percent, fixed), value decimal, min_total decimal nullable, starts_at, ends_at, usage_limit nullable, used_count default 0, is_active |

Shop sidebar filters are built from these tables: categories, attribute values (colors, sizes), brands, and the min and max of `products.price`. Product detail color and size selectors come from `product_attribute_values`. Product page tabs (Description, Additional information, Shipping, Reviews) come from `products.description`, attribute values, the `shipping` page row in `pages`, and `product_reviews`. Average rating is computed with `avg()` over approved reviews.

**Account**

| table     | columns                                                                                                                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| addresses | id, user_id fk cascade, label (Home, Office), full_name, phone, line1, line2 nullable, city, state nullable, postal_code, country, is_default boolean |

Checkout lets a logged in user pick a saved address. Guests type one. The order still copies the address text into `orders`.

**Blog**

| table           | columns                                                                                                                                        |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| blog_categories | id, name, slug unique, sort_order                                                                                                              |
| blog_posts      | id, blog_category_id fk, author_id fk users, title, slug unique, excerpt, content longtext, image, is_published boolean, published_at datetime |
| blog_tags       | id, name, slug unique                                                                                                                          |
| blog_post_tag   | blog_post_id fk, blog_tag_id fk, primary key on both                                                                                           |
| blog_comments   | id, blog_post_id fk cascade, parent_id fk nullable, name, email, body text, is_approved boolean default 0                                      |

Blog sidebar (search, categories with counts, popular posts, tags) all comes from these tables. Popular posts means newest published for now.

**Content pages**

| table                  | columns                                                                                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pages                  | id, slug unique, title, subtitle nullable, banner_image nullable, content longtext nullable, meta_title nullable, meta_description nullable, is_active |
| team_members           | id, name, role, photo, bio nullable, sort_order, is_active                                                                                             |
| testimonials           | id, author_name, author_role nullable, photo nullable, quote text, sort_order, is_active                                                               |
| faq_categories         | id, name, sort_order                                                                                                                                   |
| faqs                   | id, faq_category_id fk, question, answer text, sort_order, is_active                                                                                   |
| store_locations        | id, name, address, city, phone, email, opening_hours text, map_embed_url nullable, sort_order, is_active                                               |
| contact_messages       | id, name, email, phone nullable, subject nullable, message text, is_read boolean default 0                                                             |
| newsletter_subscribers | id, email unique, is_active                                                                                                                            |

**Home page building blocks**

| table                 | columns                                                                                                                                                           |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| features              | id, position (home_services, about_values), icon, title, description, sort_order, is_active. Used for the strip like Free Shipping, 24/7 Support, Secure Payment. |
| home_sections         | id, title, subtitle nullable, type (featured, new, category, on_sale, manual), category_id fk nullable, item_limit integer default 8, sort_order, is_active       |
| home_section_products | home_section_id fk, product_id fk, sort_order. Only used when `type = manual`.                                                                                    |

`home_sections` makes the product blocks on the home page fully dynamic. The controller loops the active sections and loads products by type. The view prints each with the same `_product-section` partial. To add a new block, add a row. No code change.

### 14.3 More models and relations

```
Attribute 1-N AttributeValue    Product N-N AttributeValue (product_attribute_values)
Product 1-N ProductReview       User 1-N Address
ShippingMethod 1-N Order        Coupon 1-N Order
BlogCategory 1-N BlogPost       BlogPost N-N BlogTag (blog_post_tag)
BlogPost 1-N BlogComment        BlogComment 1-N BlogComment (replies)
FaqCategory 1-N Faq
HomeSection N-N Product (home_section_products)
```

Helpful scopes: `BlogPost::published()`, `ProductReview::approved()`, `Page::active()`, `Coupon::valid()`, and `active()` on every list model.

### 14.4 Shared pieces to build once

These make the pages reusable. Every page below uses them.

- `partials/page-header.blade.php`: the dark title banner with page title and breadcrumb. Takes `$title`, `$subtitle`, `$image`, `$breadcrumbs`. Used by shop, cart, checkout, wishlist, compare, blog, about, contact, faq, account.
- `partials/account-sidebar.blade.php`: account menu (Dashboard, Orders, Addresses, Profile, Logout). Shared by all account pages through `layouts/account.blade.php` which extends `layouts/app`.
- `partials/blog-sidebar.blade.php`: search, categories, popular posts, tags. Used by blog list and detail. Loaded by a view composer.
- `partials/shop-filters.blade.php`: filter sidebar. Used by shop, category, search.
- `components/product-card.blade.php`: already planned. Used on home, shop, product related, wishlist, compare.
- `components/blog-card.blade.php`: used on blog list, home latest posts, related posts.
- `components/rating-stars.blade.php`: takes a number. Used on product card, product page, review list.
- `components/form-input.blade.php`: label, input, error message. Used on login, register, checkout, contact, address, review, comment.
- `components/flash-message.blade.php`: success and error alerts. Included once in the master layout.
- `components/empty-state.blade.php`: message plus a button. Used by empty cart, wishlist, orders.
- `partials/seo.blade.php`: prints title and meta description. Every controller passes `$pageTitle` and `$metaDescription`, taken from the `pages` row or the product, post or category.

Use two layouts only: `layouts/app` (default) and `layouts/account` (extends app, adds the sidebar).

### 14.5 What each page must show from the database

The agent should treat this as a checklist per page.

**Home**: header, menus, sidebar, hero slides, popular categories, promo banners, `features` strip, every active `home_sections` block, brand logo carousel from `brands`, latest 3 blog posts, newsletter box, footer.

**Shop, category, search**: page header uses `categories.banner_image`, `name`, `description`. Filter sidebar is dynamic. Product count text, sort dropdown, and pagination are real. Show an empty state when no products match.

**Product detail**: gallery from `product_images`, name, sku, brand, category link, price and sale price, stock text (In stock, Out of stock), color and size selectors, quantity, add to cart, wishlist, compare, tabs, approved reviews with average rating, review form, related products.

**Cart**: line items, quantity update, remove, coupon form, shipping method choices from `shipping_methods`, subtotal, discount, shipping, total. Empty state when no items.

**Checkout**: billing form, saved addresses for logged in users, shipping method, payment method (`cod` or `bank_transfer` for now), order summary. On submit, save the order, order items, coupon usage, then clear the cart.

**Wishlist, Compare**: product cards or a comparison table. Compare rows come from the attribute list so a new attribute shows up with no code change.

**Login, Register**: simple forms, validation errors, redirect back. After login, merge the guest cart and wishlist (update `session_token` rows to the user).

**Account pages**: dashboard greeting with last order and counts, orders table with status badge, order detail with items, address create, edit, delete, set default, profile name, phone, password change.

**Blog list and detail**: post card, category, date, author, excerpt, pagination, full content, tags, approved comments with replies, comment form, previous and next post, related posts.

**About**: `pages` row with slug `about` for the intro, `features` with position `about_values`, `team_members`, `testimonials`.

**Contact**: `pages` row `contact`, all `store_locations`, form saves to `contact_messages`, flash message on success.

**FAQ**: `faq_categories` as tabs or groups, `faqs` inside each as accordion.

**Privacy, Terms, Shipping, Returns**: `pages` rows, one generic view.

**404**: uses the shared layout so menus still load.

**Footer** (every page): logo, text, address, phone, email from `settings`, link columns from `footer_*` menus, social icons from `footer_social` menu, newsletter form, payment icons image from `settings`.

### 14.6 Routes added

```
GET  /login                     AuthController@showLogin
POST /login                     AuthController@login
GET  /register                  AuthController@showRegister
POST /register                  AuthController@register
POST /logout                    AuthController@logout

GET  /account                   AccountController@dashboard      (auth)
GET  /account/orders            AccountController@orders         (auth)
GET  /account/orders/{number}   AccountController@order          (auth)
GET  /account/profile           AccountController@profile        (auth)
POST /account/profile           AccountController@updateProfile  (auth)
GET  /account/addresses         AddressController@index          (auth)
POST /account/addresses         AddressController@store          (auth)
POST /account/addresses/{id}    AddressController@update         (auth)
POST /account/addresses/{id}/delete  AddressController@destroy   (auth)

GET  /blog                      BlogController@index
GET  /blog/category/{slug}      BlogController@category
GET  /blog/tag/{slug}           BlogController@tag
GET  /blog/{slug}               BlogController@show
POST /blog/{slug}/comment       BlogController@comment

GET  /about                     PageController@about
GET  /faq                       FaqController@index
GET  /contact                   ContactController@index
POST /contact                   ContactController@store
GET  /page/{slug}               PageController@show
POST /newsletter                NewsletterController@store
POST /product/{slug}/review     ReviewController@store
POST /cart/coupon               CartController@coupon
```

Put the `/account/*` routes inside one `Route::middleware('auth')->group(...)`. Keep `/blog/{slug}` after the category and tag routes so they do not clash. Use a simple hand written AuthController with `Auth::attempt`. No packages like Breeze or Jetstream.

### 14.7 Seed data for the new tables

The site must look complete after `migrate:fresh --seed`.

- 1 admin user and 2 customers, each customer with 1 address and 1 order
- attributes Color (5 values) and Size (4 values), linked to about half the products
- 3 shipping methods: Free (min order 50), Standard, Express
- 2 coupons: one percent, one fixed
- 3 to 5 reviews on several products, mix of approved and not approved
- 4 blog categories, 6 tags, 8 posts, 3 comments with 1 reply
- pages: about, contact, faq, privacy, terms, shipping, returns
- 4 team members, 3 testimonials, 4 features for home, 3 for about
- 3 faq categories with 4 questions each
- 2 store locations
- 3 `home_sections`: Featured Products, New Arrivals, On Sale
- 6 brands with logos
- all menus filled with real URLs, including `footer_social`

### 14.8 Admin editing

Because the whole site comes from tables, the owner needs a way to edit them. Phase 9 below is a small admin area. If you skip it, edit data in a SQLite tool for now. The site code does not change either way.

### 14.9 New build order

This replaces the phase list in section 11.

1. **Setup**: project, SQLite, assets, master layout, header, nav, footer partials.
2. **Database**: all migrations from sections 5 and 14.2, all models, relations and scopes, all seeders. Check `migrate:fresh --seed`.
3. **Shared pieces**: view composers, `money()` helper, every component in 14.4, `page-header`, flash messages, SEO partial.
4. **Home page**: all blocks dynamic including `features`, `home_sections`, brands, latest posts.
5. **Catalog**: shop, category, search, filters, product detail, reviews.
6. **Cart and wishlist and compare**: counts in header, coupon, shipping method.
7. **Auth and account**: login, register, cart merge, dashboard, orders, addresses, profile.
8. **Checkout and orders**: save order, stock, coupon usage, success page.
9. **Content pages**: blog (list, category, tag, detail, comments), about, contact, FAQ, generic pages, newsletter, 404.
10. **Admin (optional)**: simple CRUD for slides, banners, products, categories, pages, posts, orders. Plain controllers and Blade forms only.
11. **Final check**: click every link in the header, sidebar, footer and every menu. None may 404 or show empty content.

### 14.10 Extra acceptance checks

- [ ] Every page in 14.1 exists and loads with seeded data
- [ ] Search the Blade files for real sentences or fixed prices. There should be none
- [ ] Turn off one row in each of: slide, banner, feature, home section, menu item, faq, team member. The matching block disappears and nothing breaks
- [ ] Edit one `pages` row. The page changes with no code change
- [ ] Adding a new attribute value shows in filters, product page and compare
- [ ] Header counts are right for guests and for logged in users
- [ ] Guest cart merges after login
- [ ] Order history keeps old names and prices after a product is edited
- [ ] Every form shows validation errors and keeps old input
- [ ] The same partial or component is used wherever the same UI shows. No copy pasted markup
