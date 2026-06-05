# Project Folder Structure

```
CRM-App/
├── docs/
│   ├── ARCHITECTURE.md
│   ├── FOLDER-STRUCTURE.md
│   ├── DATABASE.md
│   └── SETUP.md
│
├── database/
│   ├── docker-compose.yml
│   ├── migrations/
│   │   └── 001_initial_schema.sql
│   └── seeds/
│       └── seed_data.sql
│
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── index.ts                    # Entry point
│       ├── app.ts                      # Express app setup
│       ├── config/
│       │   ├── index.ts                # Config loader (env vars)
│       │   └── database.ts             # MySQL connection pool
│       ├── middleware/
│       │   ├── auth.middleware.ts       # JWT verification
│       │   ├── rbac.middleware.ts       # Role-based access
│       │   ├── validation.middleware.ts # Request validation
│       │   ├── error.middleware.ts      # Global error handler
│       │   └── logger.middleware.ts     # Request logging
│       ├── modules/
│       │   ├── auth/
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.service.ts
│       │   │   ├── auth.repository.ts
│       │   │   ├── auth.routes.ts
│       │   │   └── auth.dto.ts
│       │   ├── employees/
│       │   │   ├── employee.controller.ts
│       │   │   ├── employee.service.ts
│       │   │   ├── employee.repository.ts
│       │   │   ├── employee.routes.ts
│       │   │   └── employee.dto.ts
│       │   ├── customers/
│       │   │   ├── customer.controller.ts
│       │   │   ├── customer.service.ts
│       │   │   ├── customer.repository.ts
│       │   │   ├── customer.routes.ts
│       │   │   └── customer.dto.ts
│       │   ├── inventory/
│       │   │   ├── inventory.controller.ts
│       │   │   ├── inventory.service.ts
│       │   │   ├── inventory.repository.ts
│       │   │   ├── inventory.routes.ts
│       │   │   └── inventory.dto.ts
│       │   ├── stock/
│       │   │   ├── stock.controller.ts
│       │   │   ├── stock.service.ts
│       │   │   ├── stock.repository.ts
│       │   │   ├── stock.routes.ts
│       │   │   └── stock.dto.ts
│       │   └── dashboard/
│       │       ├── dashboard.controller.ts
│       │       ├── dashboard.service.ts
│       │       └── dashboard.routes.ts
│       ├── utils/
│       │   ├── logger.ts               # Winston/Pino logger
│       │   ├── response.ts             # Standard response helpers
│       │   └── errors.ts               # Custom error classes
│       └── types/
│           └── index.ts                # Shared TypeScript types
│
├── frontend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── .env.example
│   ├── .env
│   └── src/
│       ├── main.tsx                    # Entry point
│       ├── App.tsx                     # Root component
│       ├── index.css                   # Global styles + Tailwind
│       ├── api/
│       │   ├── client.ts              # Axios instance
│       │   ├── auth.api.ts
│       │   ├── employees.api.ts
│       │   ├── customers.api.ts
│       │   └── inventory.api.ts
│       ├── components/
│       │   ├── ui/                    # Shadcn UI components
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── Header.tsx
│       │   │   ├── Layout.tsx
│       │   │   └── MobileNav.tsx
│       │   ├── shared/
│       │   │   ├── DataTable.tsx
│       │   │   ├── LoadingSkeleton.tsx
│       │   │   ├── EmptyState.tsx
│       │   │   ├── ConfirmDialog.tsx
│       │   │   └── StatsCard.tsx
│       │   └── charts/
│       │       ├── BarChart.tsx
│       │       ├── LineChart.tsx
│       │       └── PieChart.tsx
│       ├── hooks/
│       │   ├── useAuth.ts
│       │   ├── useEmployees.ts
│       │   ├── useCustomers.ts
│       │   └── useInventory.ts
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── LoginPage.tsx
│       │   │   ├── RegisterPage.tsx
│       │   │   └── ForgotPasswordPage.tsx
│       │   ├── dashboard/
│       │   │   └── DashboardPage.tsx
│       │   ├── employees/
│       │   │   ├── EmployeeListPage.tsx
│       │   │   ├── EmployeeCreatePage.tsx
│       │   │   ├── EmployeeEditPage.tsx
│       │   │   └── EmployeeDetailPage.tsx
│       │   ├── customers/
│       │   │   ├── CustomerListPage.tsx
│       │   │   ├── CustomerCreatePage.tsx
│       │   │   ├── CustomerEditPage.tsx
│       │   │   └── CustomerDetailPage.tsx
│       │   ├── inventory/
│       │   │   ├── InventoryListPage.tsx
│       │   │   ├── InventoryCreatePage.tsx
│       │   │   └── InventoryEditPage.tsx
│       │   └── settings/
│       │       └── SettingsPage.tsx
│       ├── store/
│       │   └── auth.store.ts          # Auth state (zustand or context)
│       ├── lib/
│       │   └── utils.ts               # Utility functions
│       ├── types/
│       │   └── index.ts               # Shared types
│       └── routes/
│           ├── index.tsx              # Route definitions
│           └── ProtectedRoute.tsx     # Auth guard
│
└── .gitignore
```
