<div align="left">

# StoreFlow

**Built to manage. Designed to grow.**

A multi-store inventory, POS and invoicing platform with role-based access, real-time updates and sales analytics. Built for Bangladesh, ready for the world.

[**Live Demo**](https://storeflow.alaminhere.com/) · [**Report a Bug**](https://github.com/alaminhere/StoreFlow/issues) · [**Portfolio**](https://alaminhere.com/)

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000000?logo=express)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-MariaDB-4479A1?logo=mysql&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

![StoreFlow overview](/frontend/public/storeFlow_overview_v1.webp)

</div>

---

## Live Demo

**https://storeflow.alaminhere.com**

Explore the full system without signing up. Use the demo account below:

| Field    | Value              |
| -------- | ------------------ |
| Email    | `demo@example.com` |
| Password | `12345`            |

After signing in, you will land on the **Store List**. Pick a store to continue:

| Store       | Role    | Access                        |
| ----------- | ------- | ----------------------------- |
| **Store A** | Owner   | Full access to every module   |
| **Store B** | Manager | Limited, role-based access    |

Switch stores anytime from the user menu to see how the menus, permissions and dashboard change with each store and role.

---

## Features

### Inventory and Sales

- Manage inventory across multiple stores and warehouses
- Organize products with categories, brands, images, pricing and stock levels
- Sell faster with a point of sale that updates stock in real time
- Spot low-stock and out-of-stock items at a glance
- Generate PDF invoices and email them to customers and suppliers
- Track sales and inventory with analytics dashboards

### Multi-Tenant and Access Control

- Run many stores from one account with a quick store switcher
- Control access with roles: Owner, Manager, Admin and Salesman
- Menus, permissions and dashboards adapt to the selected store and role

### Authentication and Security

- Secure sign-in with JWT and protected cookies
- Passwords hashed with bcrypt
- Email verification and password reset powered by Resend
- Every API input validated with Zod
- Rate limiting, with dedicated limiters for login, email and password routes
- CORS locked to the production client origin

### Experience

- Real-time, two-way updates with Socket.IO
- Image upload and optimized delivery through Cloudinary
- Light and dark themes
- Responsive layout from phone to desktop
- Smooth forms with React Hook Form, plus clear loading, error and empty states

---

## Tech Stack

| Frontend                  | Backend and Services            |
| ------------------------- | ------------------------------- |
| Next.js 16 (App Router)   | Node.js and Express 5           |
| React 19                  | Prisma ORM with MariaDB adapter |
| TypeScript                | MySQL / MariaDB                 |
| Tailwind CSS 4            | Socket.IO                       |
| Redux Toolkit / RTK Query | JWT and bcrypt                  |
| React Hook Form           | Zod                             |
| Chart.js                  | express-rate-limit and CORS     |
| jsPDF and jsPDF AutoTable | Cloudinary and Multer           |
| next-themes               | Resend                          |
| SweetAlert2               | Slugify and Day.js              |

---

## Architecture

```text
┌──────────────────────┐        HTTPS (JSON + cookies)        ┌───────────────────────┐
│  Next.js frontend    │ ───────────────────────────────────▶ │  Express 5 API        │
│  RTK Query + RHF     │ ◀─────────────────────────────────── │  Zod · JWT · Limiters │
│  storeflow.*         │            Socket.IO (WS)            │  api.storeflow.*      │
└──────────────────────┘                                      └──────────┬────────────┘
                                                                         │ Prisma
                                                     ┌───────────────────┼───────────────────┐
                                                     ▼                   ▼                   ▼
                                               MySQL / MariaDB       Cloudinary            Resend
                                               (stores, stock,       (product images)      (verification
                                                sales, users)                               and reset emails)
```

---

## Project Structure

```text
StoreFlow/
├── frontend/    # Next.js application
└── backend/     # Express API
```

---

## Getting Started

### Prerequisites

- Node.js 20 or newer
- A MySQL or MariaDB database
- Cloudinary and Resend accounts for images and email

### 1. Clone the repository

```bash
git clone https://github.com/alaminhere/StoreFlow.git
cd StoreFlow
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env` (see [Environment Variables](#environment-variables)), then run:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

The API starts on `http://localhost:8000`.

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env` (see below), then run:

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Environment Variables

### Backend (`backend/.env`)

```env
CLIENT_URL="http://localhost:3000"
COOKIE_DOMAIN=

DATABASE_URL=
DATABASE_HOST=
DATABASE_PORT=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_NAME=

JWT_SECRET=
JWT_ACCESS_EXPIRATION_MINUTES=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
EMAIL_FROM=
```

### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_API_URL="http://localhost:8000/api/v1"
NEXT_PUBLIC_SOCKET_URL="http://localhost:8000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

NEXT_PUBLIC_CLOUD_NAME=
NEXT_PUBLIC_PRESET_NAME=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

JWT_SECRET=
```

> **Note:** `JWT_SECRET` must be the same in the frontend and the backend.

---

## Scripts

| Location   | Command         | Description                          |
| ---------- | --------------- | ------------------------------------ |
| `backend`  | `npm run dev`   | Start the API with hot reload (tsx)  |
| `backend`  | `npm run build` | Generate the Prisma client and build |
| `backend`  | `npm start`     | Run the production build             |
| `frontend` | `npm run dev`   | Start the Next.js dev server         |
| `frontend` | `npm run build` | Create a production build            |
| `frontend` | `npm start`     | Serve the production build           |
| `frontend` | `npm run lint`  | Run ESLint                           |

---

## Deployment Notes

- Set `NODE_ENV=production` on the backend.
- Set `CLIENT_URL` to your frontend origin without a trailing slash, for example `https://storeflow.alaminhere.com`.
- Set `COOKIE_DOMAIN` to the shared parent domain so cookies work across the frontend and API subdomains.
- Enable `trust proxy` behind Nginx, Cloudflare or a similar proxy, so rate limiting sees real client IPs.

---

## Author

**Md. Al-Amin**, Full-Stack Developer

[Portfolio](https://alaminhere.com/) · [LinkedIn](https://www.linkedin.com/in/alamin-here) · [GitHub](https://github.com/alaminhere)

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

If you found this project helpful, consider giving it a ⭐ on GitHub.

</div>