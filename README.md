# Farm To Table – Food and Vegetables, Nakasero

An online storefront for fresh farm produce sourced from **Nakasero Market, Uganda**. Customers browse available groceries, build a cart, and place orders that are confirmed over **WhatsApp**. Prices are in **UGX (Ugandan Shillings)**.

## Features

- 🥦 Browse fresh vegetables, fruits, and groceries by category
- 🔍 Search items by name
- 🛒 Add to cart and adjust quantities
- 📦 Place orders with name and WhatsApp number — confirmed via WhatsApp
- 🔒 Password-protected admin panel for inventory and order management

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build | [Vite](https://vitejs.dev/) |
| UI components | [shadcn/ui](https://ui.shadcn.com/) + [Tailwind CSS](https://tailwindcss.com/) |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Row-Level Security) |
| State / data-fetching | [TanStack Query](https://tanstack.com/query) |
| Routing | [React Router v6](https://reactrouter.com/) |

## Getting Started (Local Development)

### Prerequisites

- [Node.js](https://nodejs.org/) v18+ and npm (or use [nvm](https://github.com/nvm-sh/nvm#installing-and-updating))
- A [Supabase](https://supabase.com/) project (see [Supabase Setup](#supabase-setup) below)

### Setup

```sh
# 1. Clone the repository
git clone https://github.com/chrisapx/farm-to-table-fav.git
cd farm-to-table-fav

# 2. Install dependencies
npm install

# 3. Configure environment variables (see below)
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Environment Variables

Create a `.env` file at the project root with the following variables:

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

These values are found in your Supabase project under **Project Settings → API**.

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Production build (output in `dist/`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests with Vitest |
| `npm run test:watch` | Run tests in watch mode |

---

## Maintainer Documentation

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com/).
2. Run the SQL migrations in order from the `supabase/migrations/` folder inside the Supabase **SQL Editor** to create the required tables (`grocery_items`, `orders`, `order_items`).
3. Copy your **Project URL** and **anon public key** from **Project Settings → API** into `.env`.

#### Database Schema

```
grocery_items
  id, name, description, price (UGX), unit, category,
  image_url, available (bool), stock_quantity, created_at, updated_at

orders
  id, customer_name, whatsapp_number, status (pending|confirmed|delivered),
  notes, created_at, updated_at

order_items
  id, order_id → orders, grocery_item_id → grocery_items,
  item_name, quantity, unit_price, unit
```

Row-Level Security is enabled on all tables:
- **Public** can read available `grocery_items` and insert `orders` / `order_items`.
- **Authenticated users** (admins) can create, update, and delete `grocery_items` and manage `orders`.

### Admin Panel

The admin panel is available at `/admin`.

- Log in with an email/password account created in **Supabase → Authentication → Users**.
- **Inventory tab** – add, edit, toggle availability, and delete grocery items.
- **Orders tab** – view incoming orders, confirm them, and mark as delivered.

To create the first admin account:
1. Go to your Supabase project → **Authentication → Users → Add user**.
2. Enter an email and password, then click **Create User**.
3. Log in at `/admin` with those credentials.

### WhatsApp Contact Number

The WhatsApp floating button is configured in `src/components/WhatsAppButton.tsx`. Update the `WHATSAPP_NUMBER` constant to your business number in international format **without** the leading `+` sign (e.g. for +256 712 345 678, use `256712345678`).

### Deployment

The app is a static SPA and can be deployed to any static hosting provider.

**Recommended: [Netlify](https://netlify.com/) or [Vercel](https://vercel.com/)**

```sh
# Build for production
npm run build
# Deploy the contents of dist/
```

Set the environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY`) in your hosting provider's dashboard.

**Important:** Configure your hosting provider to redirect all routes to `index.html` so that React Router works correctly (e.g. set up a `_redirects` file on Netlify: `/* /index.html 200`).

### Adding or Updating Dependencies

Always check for known vulnerabilities before adding new packages. Run:

```sh
npm audit
```

### Contributing

1. Create a feature branch from `main`.
2. Make your changes and ensure `npm run lint` and `npm test` pass.
3. Open a pull request with a clear description of your changes.
