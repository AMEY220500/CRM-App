# CRM + Inventory Management System — Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         BROWSER                                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTP (Port 5173)
┌──────────────────────────────▼──────────────────────────────────┐
│                    REACT FRONTEND (Vite)                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐   │
│  │   Auth    │ │ Dashboard │ │ Employees │ │   Inventory   │   │
│  │  Module   │ │  Module   │ │  Module   │ │    Module     │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────────┘   │
│  ┌───────────┐ ┌───────────┐ ┌──────────────────────────────┐  │
│  │ Customers │ │   Stock   │ │      Shared Components       │  │
│  │  Module   │ │  Module   │ │  (Layout, Tables, Charts)    │  │
│  └───────────┘ └───────────┘ └──────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────────┘
                               │ REST API (Port 8080)
┌──────────────────────────────▼──────────────────────────────────┐
│                   NODE.JS BACKEND (Express)                      │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Middleware Layer                       │ │
│  │  (Auth, CORS, Helmet, Rate Limit, Validation, Logging)     │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐   │
│  │   Auth    │ │ Employee  │ │ Customer  │ │   Inventory   │   │
│  │Controller │ │Controller │ │Controller │ │  Controller   │   │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──────┬────────┘   │
│  ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌──────▼────────┐   │
│  │   Auth    │ │ Employee  │ │ Customer  │ │   Inventory   │   │
│  │  Service  │ │  Service  │ │  Service  │ │   Service     │   │
│  └─────┬─────┘ └─────┬─────┘ └─────┬─────┘ └──────┬────────┘   │
│  ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌──────▼────────┐   │
│  │   Auth    │ │ Employee  │ │ Customer  │ │   Inventory   │   │
│  │   Repo    │ │   Repo    │ │   Repo    │ │     Repo      │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────────┘   │
└──────────────────────────────┬──────────────────────────────────┘
                               │ TCP (Port 3306)
┌──────────────────────────────▼──────────────────────────────────┐
│                 MYSQL (Docker Container)                         │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐   │
│  │   users   │ │ employees │ │ customers │ │   products    │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────────┘   │
│  ┌───────────┐ ┌───────────┐ ┌───────────────────────────────┐ │
│  │   stock   │ │activities │ │        departments            │ │
│  │movements  │ │           │ │                               │ │
│  └───────────┘ └───────────┘ └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Backend Architecture Pattern

```
Request → Router → Middleware → Controller → Service → Repository → Database
                                    ↓
                               DTO/Validation
```

- **Controllers**: Handle HTTP request/response, delegate to services
- **Services**: Business logic, orchestration
- **Repositories**: Data access, SQL queries
- **Middleware**: Auth, validation, error handling, logging
- **DTOs**: Data transfer objects with Zod validation

## Authentication Flow

```
┌────────┐     POST /auth/login      ┌─────────┐
│ Client │ ──────────────────────────►│ Backend │
│        │◄────────────────────────── │         │
└────────┘   { accessToken, user }    └────┬────┘
                                           │ Verify credentials
                                           │ Hash comparison (bcrypt)
                                           │ Generate JWT
                                      ┌────▼────┐
                                      │  MySQL  │
                                      └─────────┘
```

## Role-Based Access Control

| Resource   | Admin | Manager | Employee |
| ---------- | ----- | ------- | -------- |
| Dashboard  | ✓     | ✓       | ✓        |
| Employees  | CRUD  | Read    | Self     |
| Customers  | CRUD  | CRUD    | Read     |
| Inventory  | CRUD  | CRUD    | Read     |
| Stock Mgmt | CRUD  | CRUD    | Read     |
| User Mgmt  | CRUD  | —       | —        |
| Analytics  | ✓     | ✓       | Limited  |

## Environment Variables

All configuration is externalized via environment variables for Kubernetes readiness:

| Variable            | Description             | Default (Dev)           |
| ------------------- | ----------------------- | ----------------------- |
| `DB_HOST`           | MySQL host              | `localhost`             |
| `DB_PORT`           | MySQL port              | `3306`                  |
| `DB_USER`           | MySQL user              | `crm_user`              |
| `DB_PASSWORD`       | MySQL password          | `crm_password`          |
| `DB_NAME`           | MySQL database name     | `crm_db`                |
| `JWT_SECRET`        | JWT signing secret      | —                       |
| `JWT_EXPIRES_IN`    | Token expiration        | `24h`                   |
| `PORT`              | Backend port            | `8080`                  |
| `NODE_ENV`          | Environment             | `development`           |
| `CORS_ORIGIN`       | Allowed CORS origin     | `http://localhost:5173` |
| `RATE_LIMIT_WINDOW` | Rate limit window (ms)  | `900000`                |
| `RATE_LIMIT_MAX`    | Max requests per window | `100`                   |
