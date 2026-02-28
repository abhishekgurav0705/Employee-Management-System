# Employee Management System (EMS) — Monorepo

Production-grade HR SaaS-style EMS built with:
- Frontend: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn-style UI
- Backend: Node.js (Express), TypeScript, Prisma ORM, PostgreSQL, JWT auth
- Deployment Target: Render.com (Frontend Web Service + Backend Web Service + PostgreSQL DB)

## Repository Structure
```
employee-management/
├─ backend/                 # Express + Prisma + PostgreSQL
│  ├─ src/                  # Modules and app entry
│  │  ├─ middleware/        # Auth middleware
│  │  └─ modules/           # Auth, employees, departments, leaves, attendance, activity-log
│  ├─ prisma/               # Prisma schema and migrations
│  ├─ package.json
│  └─ tsconfig.json
├─ frontend/                # Next.js 14 App Router (this repository root currently)
│  ├─ app/                  # Pages and layout
│  ├─ components/           # UI library
│  ├─ lib/                  # helpers and mock data
│  ├─ package.json
│  └─ tailwind.config.ts
└─ README.md
```

Note: The frontend currently resides in the repository root. To match the above tree exactly, move the frontend files into a `frontend/` directory and update paths. The backend is provided under `backend/`.

## Backend — Render Deployment
- Root: `backend/`
- Build: `npm install && npm run build`
- Start: `npm run start`
- Migrate: `npm run migrate`

Environment variables:
- `DATABASE_URL` — PostgreSQL connection string (Render or Neon)
- `JWT_SECRET` — a long random secret
- `NODE_ENV=production`
- `CORS_ORIGIN` — frontend URL (e.g., https://your-frontend.onrender.com)

Prisma:
- Update `backend/prisma/schema.prisma` if needed
- Run local migration: `npx prisma migrate dev`
- Deploy on Render: add a job step or run `npm run migrate`

## Frontend — Render Deployment
- Root: repository root (or `frontend/` after moving)
- Build: `npm install && npm run build`
- Start: `npm run start`
- Env: `NEXT_PUBLIC_API_BASE_URL` pointing to backend (e.g., https://ems-backend.onrender.com)

## Frontend–Backend Integration
- API client should read `NEXT_PUBLIC_API_BASE_URL`
- Attach JWT from storage (cookie/localStorage) to `Authorization: Bearer <token>`
- Handle 401/403 by redirecting to login

## Notes
- UI is built with premium SaaS-style components and responsive layout
- Replace mock data with real API integration in `lib/` as you wire endpoints
