# 🏢 EMS Pro - Modern Employee Management System

Welcome to **EMS Pro**, a production-grade, company-ready Employee Management System designed for modern HR teams and growing organizations. This platform streamlines HR operations, from employee onboarding to leave management and attendance tracking, all wrapped in a premium SaaS-style interface.

## 🚀 Overview

EMS Pro is built to provide a seamless experience for both administrators and employees. It features a robust role-based access control (RBAC) system, ensuring that sensitive data is only accessible to authorized personnel while giving employees the tools they need to manage their daily work life.

### Key Features

- **📊 Professional Dashboard**: At-a-glance metrics for HR admins and personalized summaries for employees.
- **👥 Employee Directory**: Comprehensive management of employee profiles, contact details, and employment history.
- **🏢 Department Management**: Organize your workforce into functional units with ease.
- **📅 Leave Management**: Full lifecycle for leave requests—from submission by employees to approval/rejection by managers.
- **⏱️ Attendance Tracking**: Daily check-in/check-out system with duration tracking and status indicators.
- **📜 Audit Logs**: A complete activity log tracking every significant action within the system for compliance and security.
- **⚙️ Configuration Hub**: A centralized settings center to manage organization profiles, leave policies, work hours, and roles.

## 🛠️ Tech Stack

- **Frontend**: [Next.js 14](https://nextjs.org/) (App Router), TypeScript, [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide-dev.customary.io/) icons.
- **Backend**: [Node.js](https://nodejs.org/) (Express), TypeScript, [Prisma ORM](https://www.prisma.io/).
- **Database**: [PostgreSQL](https://www.postgresql.org/).
- **Authentication**: JWT (JSON Web Tokens) with secure local storage.

## 📂 Project Structure

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

## ⚙️ Local Setup Guide

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (local or cloud-hosted)

### 1. Clone the Repository
```bash
git clone https://github.com/abhishekgurav0705/Employee-Management-System.git
cd Employee-Management-System
```

### 2. Configure Backend
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ems_db"
JWT_SECRET="your-super-secret-key-change-this"
NODE_ENV="development"
PORT=5000
```
Run migrations and seed the database:
```bash
npx prisma migrate dev
npm run seed
```
Start the backend:
```bash
npm run dev
```

### 3. Configure Frontend
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend` folder:
```env
NEXT_PUBLIC_API_BASE_URL="http://localhost:5000"
```
Start the development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment on Render

This project is optimized for deployment on [Render.com](https://render.com).

### Backend (Web Service)
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Post‑Deploy Command (recommended)**: `npm run migrate`
- **Health Check Path**: `/api/health`
- **Env Vars**:
  - `DATABASE_URL` — include SSL for hosted Postgres, e.g.  
    `postgresql://user:password@host:5432/dbname?sslmode=require`
  - `JWT_SECRET` — long random secret
  - `NODE_ENV=production`
  - `CORS_ORIGIN` — your frontend origin (e.g., `https://ems-frontend-xxxx.onrender.com`)

### Frontend (Web Service)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm run start`
- **Root Directory**: `frontend`
- **Env Vars**:
  - `NEXT_PUBLIC_API_BASE_URL` — must be the exact backend HTTPS URL (e.g., `https://ems-backend-xxxx.onrender.com`)
    - When front-end is under HTTPS, the API URL should also be HTTPS to avoid mixed-content/CORS issues.

### CORS & SSL Notes
- Backend reflects `CORS_ORIGIN` (comma-separated list) when set, otherwise allows requests from any origin.
- For Render/Neon/Cloud Postgres, append `?sslmode=require` to `DATABASE_URL` to prevent TLS errors.
- Keep the backend warm (optional) by pinging `/api/health` every 5 minutes using a scheduler (cron-job.org).

## 🔐 Sample Credentials (Mock/Seed)

If you are using the default seed data, you can log in with:

- **Admin Access**: `admin@example.com` / `Password123!`
- **Employee Access**: `employee@example.com` / `Password123!`

## 🤝 Credits

Special thanks to everyone who contributed to making EMS Pro a reality.

**Lead Developer**: [Abhishek Gurav](https://github.com/abhishekgurav0705)  
**Helping Hand**: RAM GAWAS — [https://ramgawas55.in](https://ramgawas55.in)

---
*Built with ❤️ for better workplaces.*
