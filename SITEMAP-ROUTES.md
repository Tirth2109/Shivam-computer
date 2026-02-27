# Shivam Computer – Sitemap & Routes

## Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | HomePage | Hero, categories, featured (Best Sellers / New Arrivals / Top Deals), Custom Build, brands, trust, reviews |
| `/category/:slug?` | CategoryPage | Listing with filters (brand, price, stock) and sort. Slug: e.g. `laptops`, `monitors`, `components`, `all` |
| `/category/all?q=...` | CategoryPage | Search results |
| `/product/:id` | ProductDetailPage | Gallery, specs, price, pincode check, Add to Cart / Buy Now / Wishlist |
| `/cart` | CartPage | Cart items, coupon, order summary, Proceed to Checkout |
| `/checkout` | CheckoutPage | Address → Payment (COD/UPI/Card/NetBanking) → Order confirmation |
| `/custom-build` | CustomPCBuilderPage | 7-step Custom PC Builder flow |
| `/deals` | DealsPage | Top deals product grid |
| `/support` | PlaceholderPage | Support info |
| `/account` | PlaceholderPage | Account / Login |
| `/wishlist` | PlaceholderPage | Wishlist |
| `/login` | LoginPage | Login |
| `/admin` | AdminPage | Admin |
| `/shipping`, `/returns`, `/warranty`, `/privacy`, `/terms`, `/faq` | PlaceholderPage | Policy & help pages |

## UI Components

- **SiteHeader** – Logo, search bar, Account / Wishlist / Cart icons, nav menu (New Computers, Custom Build PC, Components, Laptops, Monitors, Accessories, Deals, Support)
- **Footer** – About, Policies, Help, Contact, social
- **ProductCard** – Image, name, category, rating, price/MRP/discount, Add to Cart, Buy Now
- **WhatsAppFloat** – Fixed WhatsApp button
- **Category grid** – Clickable category tiles on homepage
- **Featured tabs** – Best Sellers / New Arrivals / Top Deals
- **Custom Build section** – 5 steps + CTA
- **Trust grid** – Why Shivam Computer (6 cards)
- **Reviews grid** – Customer reviews with verified badge
- **Filters panel** – Brand, price range, in stock (category page)
- **Cart summary** – Subtotal, shipping, total, coupon
- **Checkout form** – Address fields, payment method selection
- **Custom PC Builder** – Step indicators and 7 steps (Budget & Purpose → CPU → Motherboard → RAM+Storage → GPU+PSU → Cabinet+Cooling → Summary)

## Sample Data

- **20 products** in `src/data/products.ts` (INR): gaming PCs, office PCs, laptops, monitors, CPU, GPU, RAM, SSD, PSU, cabinet, keyboard, mouse, custom builds, motherboard, cooler
- **Categories** in `src/data/categories.ts`: 15 shop-by-category tiles + nav links

## Tech

- **React 18** + **TypeScript** + **Vite**
- **react-router-dom** for routing
- **CartContext** for cart state (add/remove/update quantity)
- Mobile-first responsive layout; filters and cart/checkout stack on small screens
