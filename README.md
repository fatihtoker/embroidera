# Embroidera

Handcrafted embroidery art, workshops & portfolio — a bilingual (NL / EN / TR) website with an admin panel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Backend | Node.js + Express 5 |
| Database & Auth | Supabase (PostgreSQL + RLS + Auth) |
| i18n | i18next (NL, EN, TR) |
| Styling | Pure CSS (custom design system, no framework) |

## Project Structure

```
embroidera/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Shared UI components
│   │   ├── context/        # Auth context
│   │   ├── i18n/           # Translation files
│   │   ├── lib/            # Supabase client & API helpers
│   │   ├── pages/          # Public & admin pages
│   │   └── styles/         # CSS design system
│   └── index.html
├── server/                 # Express API
│   └── src/
│       ├── lib/            # Supabase clients
│       ├── middleware/     # Auth middleware
│       └── routes/         # API routes
└── supabase/
    └── schema.sql          # Database schema
```

## Getting Started

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase/schema.sql`
3. Go to **Storage** and create a public bucket called `media`
4. Go to **Authentication** → **Users** and create your admin user
5. Copy your project URL and keys

### 2. Environment Variables

```bash
# Server
cp server/.env.example server/.env
# Fill in SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

# Client
cp client/.env.example client/.env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
```

### 3. Install & Run

```bash
# Install all dependencies
npm run install:all

# Start both client (port 5173) and server (port 3001)
npm run dev
```

### 4. Access

- **Website:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin/login
- **API:** http://localhost:3001/api/health

## Pages

### Public
| Route | Description |
|-------|-------------|
| `/` | Landing page with hero, featured workshops & products |
| `/workshops` | All published workshops |
| `/portfolio` | Product grid with category filtering |
| `/portfolio/:id` | Product detail with image gallery |
| `/about` | Brand story, mission & values |
| `/contact` | Contact form |

### Admin (requires authentication)
| Route | Description |
|-------|-------------|
| `/admin/login` | Login page |
| `/admin` | Dashboard with stats |
| `/admin/workshops` | CRUD for workshops |
| `/admin/products` | CRUD for products |
| `/admin/messages` | View contact messages |

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/workshops` | — | Published workshops |
| GET | `/api/workshops/all` | ✓ | All workshops (admin) |
| GET | `/api/workshops/:id` | — | Single workshop |
| POST | `/api/workshops` | ✓ | Create workshop |
| PUT | `/api/workshops/:id` | ✓ | Update workshop |
| DELETE | `/api/workshops/:id` | ✓ | Delete workshop |
| GET | `/api/products` | — | Published products |
| GET | `/api/products/all` | ✓ | All products (admin) |
| GET | `/api/products/:id` | — | Single product |
| POST | `/api/products` | ✓ | Create product |
| PUT | `/api/products/:id` | ✓ | Update product |
| DELETE | `/api/products/:id` | ✓ | Delete product |
| POST | `/api/contact` | — | Send contact message |
| GET | `/api/contact` | ✓ | List messages (admin) |
| PUT | `/api/contact/:id/read` | ✓ | Mark message as read |
| DELETE | `/api/contact/:id` | ✓ | Delete message |
| POST | `/api/upload` | ✓ | Upload image |

## Design

The UI features an **embroidery-inspired design system**:
- Cross-stitch pattern backgrounds
- Dashed "stitched" borders and dividers
- Embroidery hoop frame elements
- Thread-inspired decorative lines
- Warm, earth-tone color palette (linen, cream, amber)
- Playfair Display (headings) + DM Sans (body) typography

## License

Private — All rights reserved.
