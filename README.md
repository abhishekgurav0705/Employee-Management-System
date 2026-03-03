# 🏢 EMS Pro — Modern Employee Management System

EMS Pro is a production‑ready HR platform for growing organizations. It streamlines onboarding, employee profiles, departments, leave management, attendance tracking, and audit logging — delivered in a clean, SaaS‑style interface designed for both administrators and employees.

## 🛠️ Tech Stack & Architecture

- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React icons
- Backend: Node.js (Express), TypeScript, Prisma ORM
- Database: PostgreSQL
- Authentication: JWT stored in localStorage (stable session handling)

High‑level architecture:
- Frontend (Next.js) calls the Backend via REST under /api/*
- Backend (Express) exposes modules: auth, employees, departments, leaves, attendance, activity‑logs
- Database managed via Prisma schema and migrations
- Deployed on Render (frontend and backend services)

## 📂 Folder Structure

```text
.
├── frontend/           # Next.js 14 Application (User Interface)
│   ├── app/            # App router pages and layouts
│   ├── components/     # Reusable UI components (shadcn-style)
│   ├── lib/            # API helpers, auth logic, and utilities
│   └── public/         # Static assets
├── backend/            # Express API Service
│   ├── src/            # Source code (modules for auth, employees, etc.)
│   ├── prisma/         # Database schema and migrations
│   └── package.json    # Backend dependencies
└── README.md           # You are here
```

## ⚙️ Local Development

### Prerequisites
- Node.js v18+
- PostgreSQL database (local or cloud-hosted)

### 1) Clone
```bash
git clone https://github.com/abhishekgurav0705/Employee-Management-System.git
cd Employee-Management-System
```

### 2) Backend
```bash
cd backend
npm install
```
Create backend `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ems_db"
JWT_SECRET="your-super-secret-key-change-this"
NODE_ENV="development"
PORT=5000
```
Migrate and seed:
```bash
npx prisma migrate dev
npm run seed
```
Run backend:
```bash
npm run dev
```

### 3) Frontend
```bash
cd ../frontend
npm install
```
Create frontend `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```
Run frontend:
```bash
npm run dev
```
Open http://localhost:3000 in the browser.

## 🚢 Deployment on Render

This project is optimized for deployment on [Render.com](https://render.com).

### Backend (Web Service)
- Root Directory: `backend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Post‑Deploy Command (recommended): `npm run migrate`
- Health Check Path: `/api/health`
- Env Vars:
  - `DATABASE_URL` — include SSL for hosted Postgres, e.g. `...?sslmode=require`
  - `JWT_SECRET` — long random secret
  - `NODE_ENV=production`
  - `CORS_ORIGIN` — your frontend origin (e.g., `https://ems-frontend-xxxx.onrender.com`)

### Frontend (Web Service)
- Root Directory: `frontend`
- Build Command: `npm install && npm run build`
- Start Command: `npm run start`
- Env Vars:
  - `NEXT_PUBLIC_API_BASE_URL` — exact backend HTTPS URL (e.g., `https://ems-backend-xxxx.onrender.com`)
    - When the frontend is HTTPS, the API URL must be HTTPS to avoid mixed content.

### CORS & SSL Notes
- Backend reflects `CORS_ORIGIN` (comma-separated list) when set, otherwise allows requests from any origin.
- For Render/Neon/Cloud Postgres, append `?sslmode=require` to `DATABASE_URL` to prevent TLS errors.
- Keep the backend warm (optional) by pinging `/api/health` every 5 minutes using a scheduler (cron-job.org).

## 🔐 Sample Credentials (Seed)

- **Admin Access**: `admin@example.com` / `Password123!`
- **Employee Access**: `employee@example.com` / `Password123!`

## ✅ Production Notes

- Stable EMPLOYEE/ADMIN sessions (logout only on 401 or explicit action)
- Role‑aware routing and permissions
- Clean error handling (no infinite loops)
- Consistent UI with loading/empty states and toasts

## 🤝 Credits
- **Lead Developer**: [Abhishek Gurav](https://github.com/abhishekgurav0705)  
- **Helping Hand**: RAM GAWAS — https://ramgawas55.in

---
Built with ❤️ for better workplaces.
