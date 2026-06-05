# Development Setup Guide

## Prerequisites

- **Node.js** v18+ (LTS recommended)
- **npm** v9+
- **Docker Desktop** (for MySQL)
- **Git**

## Quick Start

### Step 1: Start MySQL Database (Docker)

```powershell
# Navigate to database directory
cd database

# Start MySQL container
docker-compose up -d

# Verify it's running
docker ps

# Check logs if needed
docker logs crm-mysql
```

MySQL will be available at:

- **Host**: localhost
- **Port**: 3306
- **Database**: crm_db
- **User**: crm_user
- **Password**: crm_password
- **Root Password**: root_password

The schema and seed data will be auto-loaded on first startup from the `migrations/` and `seeds/` directories.

### Step 2: Start Backend

```powershell
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Backend will be available at: **http://localhost:8080**

Health check: http://localhost:8080/health

### Step 3: Start Frontend

```powershell
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: **http://localhost:5173**

## Default Login Credentials

| Role     | Email                | Password  |
| -------- | -------------------- | --------- |
| Admin    | admin@crm-app.com    | Admin@123 |
| Manager  | manager@crm-app.com  | Admin@123 |
| Employee | employee@crm-app.com | Admin@123 |

## API Endpoints

### Auth

| Method | Endpoint           | Description | Auth |
| ------ | ------------------ | ----------- | ---- |
| POST   | /api/auth/login    | Login       | No   |
| POST   | /api/auth/register | Register    | No   |
| GET    | /api/auth/profile  | Get profile | Yes  |

### Employees

| Method | Endpoint           | Description     | Auth | Roles         |
| ------ | ------------------ | --------------- | ---- | ------------- |
| GET    | /api/employees     | List employees  | Yes  | All           |
| GET    | /api/employees/:id | Get employee    | Yes  | All           |
| POST   | /api/employees     | Create employee | Yes  | Admin,Manager |
| PUT    | /api/employees/:id | Update employee | Yes  | Admin,Manager |
| DELETE | /api/employees/:id | Delete employee | Yes  | Admin         |

### Customers

| Method | Endpoint           | Description     | Auth | Roles         |
| ------ | ------------------ | --------------- | ---- | ------------- |
| GET    | /api/customers     | List customers  | Yes  | All           |
| GET    | /api/customers/:id | Get customer    | Yes  | All           |
| POST   | /api/customers     | Create customer | Yes  | Admin,Manager |
| PUT    | /api/customers/:id | Update customer | Yes  | Admin,Manager |
| DELETE | /api/customers/:id | Delete customer | Yes  | Admin         |

### Inventory

| Method | Endpoint                    | Description        | Auth | Roles         |
| ------ | --------------------------- | ------------------ | ---- | ------------- |
| GET    | /api/inventory              | List products      | Yes  | All           |
| GET    | /api/inventory/low-stock    | Low stock items    | Yes  | All           |
| GET    | /api/inventory/out-of-stock | Out of stock items | Yes  | All           |
| GET    | /api/inventory/:id          | Get product        | Yes  | All           |
| POST   | /api/inventory              | Create product     | Yes  | Admin,Manager |
| PUT    | /api/inventory/:id          | Update product     | Yes  | Admin,Manager |
| DELETE | /api/inventory/:id          | Delete product     | Yes  | Admin         |

### Stock Movements

| Method | Endpoint                      | Description              | Auth | Roles         |
| ------ | ----------------------------- | ------------------------ | ---- | ------------- |
| GET    | /api/stock                    | List movements           | Yes  | All           |
| GET    | /api/stock/product/:productId | Product movement history | Yes  | All           |
| POST   | /api/stock                    | Record movement          | Yes  | Admin,Manager |

### Dashboard

| Method | Endpoint                               | Description              |
| ------ | -------------------------------------- | ------------------------ |
| GET    | /api/dashboard/stats                   | Overview statistics      |
| GET    | /api/dashboard/employees-by-department | Chart: employees by dept |
| GET    | /api/dashboard/inventory-by-category   | Chart: inventory by cat  |
| GET    | /api/dashboard/recent-activities       | Recent activity feed     |
| GET    | /api/dashboard/latest-employees        | Latest hired employees   |
| GET    | /api/dashboard/low-stock-alerts        | Stock alert list         |
| GET    | /api/dashboard/customer-growth         | Chart: customer growth   |

## Useful Docker Commands

```powershell
# Stop MySQL
cd database
docker-compose down

# Stop and remove volumes (reset database)
docker-compose down -v

# Connect to MySQL CLI
docker exec -it crm-mysql mysql -u crm_user -pcrm_password crm_db

# View container logs
docker logs -f crm-mysql
```

## Project Structure Overview

```
CRM-App/
├── docs/              # Architecture & documentation
├── database/          # Docker Compose + SQL files
├── backend/           # Node.js Express API
└── frontend/          # React Vite app
```
