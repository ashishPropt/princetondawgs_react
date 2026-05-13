# Princeton Dawgs — React + Node.js + PostgreSQL

Full-stack rewrite of princetondawgs.com using:

| Layer | Tech |
|---|---|
| Frontend | React 18 + React Router v6 + Vite |
| Styling | CSS Modules (faithful port of original site.css / home.css) |
| Backend | Node.js + Express |
| Database | PostgreSQL (via `pg` / node-postgres) |
| Auth | JWT (access token in memory + refresh token in httpOnly cookie) |

## Quick Start

### 1. Database
```bash
psql -U postgres -c "CREATE DATABASE princetondawgs;"
psql -U postgres -d princetondawgs -f db/schema.sql
psql -U postgres -d princetondawgs -f db/seed.sql
```

### 2. Backend
```bash
cd server
npm install
cp .env.example .env   # fill in DATABASE_URL + JWT_SECRET
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
npm run dev
```

Frontend → http://localhost:5173  
API → http://localhost:4000

## Project Structure
```
princetondawgs_react/
├── client/               # React (Vite)
│   ├── src/
│   │   ├── components/   # Shared UI (Nav, Footer, etc.)
│   │   ├── pages/        # Route-level components
│   │   ├── api/          # API helpers (fetch wrappers)
│   │   ├── context/      # AuthContext
│   │   └── styles/       # CSS Modules
│   └── vite.config.js
├── server/               # Express API
│   ├── routes/           # Express routers
│   ├── middleware/        # Auth middleware
│   ├── db/               # pg pool + query helpers
│   └── index.js
└── db/
    ├── schema.sql        # PostgreSQL schema
    └── seed.sql          # Seed data
```

## Pages Ported

| PHP | React Route |
|---|---|
| home.php | `/` |
| login.php | `/login` |
| register.php | `/register` |
| dashboard.php | `/dashboard` |
| team.php | `/team` |
| leagues.php | `/leagues` |
| tournament.php | `/tournament` |
| tie.php | `/tie/:id` |
| standings.php | `/standings` |
| admin.php | `/admin` |
| sponsors.php | `/sponsors` |
| shop.php | `/shop` |
| join.php | `/join` |
| usta-register.php | `/usta-register` |
| events.php | `/events` |
| forgot_password.php | `/forgot-password` |
| reset_password.php | `/reset-password` |
