# Database Design

## ER Diagram (Mermaid)

```mermaid
erDiagram
    USERS {
        int id PK
        varchar email UK
        varchar password_hash
        varchar first_name
        varchar last_name
        enum role "admin|manager|employee"
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    DEPARTMENTS {
        int id PK
        varchar name UK
        varchar description
        boolean is_active
        datetime created_at
    }

    EMPLOYEES {
        int id PK
        varchar employee_id UK
        int user_id FK
        varchar first_name
        varchar last_name
        varchar email UK
        varchar phone
        int department_id FK
        varchar designation
        decimal salary
        date joining_date
        enum status "active|inactive|terminated"
        text address
        datetime created_at
        datetime updated_at
    }

    CUSTOMERS {
        int id PK
        varchar customer_id UK
        varchar first_name
        varchar last_name
        varchar company
        varchar email
        varchar phone
        text address
        varchar city
        varchar state
        varchar zip_code
        enum status "active|inactive|lead"
        text notes
        datetime created_at
        datetime updated_at
    }

    CATEGORIES {
        int id PK
        varchar name UK
        varchar description
        boolean is_active
        datetime created_at
    }

    SUPPLIERS {
        int id PK
        varchar name
        varchar contact_person
        varchar email
        varchar phone
        text address
        boolean is_active
        datetime created_at
        datetime updated_at
    }

    PRODUCTS {
        int id PK
        varchar product_id UK
        varchar name
        varchar sku UK
        int category_id FK
        int supplier_id FK
        text description
        int quantity
        int min_stock_level
        decimal unit_price
        decimal cost_price
        enum status "in_stock|low_stock|out_of_stock"
        datetime last_restocked
        datetime created_at
        datetime updated_at
    }

    STOCK_MOVEMENTS {
        int id PK
        int product_id FK
        enum type "in|out|adjustment"
        int quantity
        int previous_quantity
        int new_quantity
        varchar reference
        text notes
        int performed_by FK
        datetime created_at
    }

    ACTIVITIES {
        int id PK
        int user_id FK
        enum entity_type "employee|customer|product|stock"
        int entity_id
        varchar action
        text description
        json metadata
        datetime created_at
    }

    USERS ||--o| EMPLOYEES : "has profile"
    DEPARTMENTS ||--o{ EMPLOYEES : "contains"
    CATEGORIES ||--o{ PRODUCTS : "categorizes"
    SUPPLIERS ||--o{ PRODUCTS : "supplies"
    PRODUCTS ||--o{ STOCK_MOVEMENTS : "tracks"
    USERS ||--o{ STOCK_MOVEMENTS : "performed by"
    USERS ||--o{ ACTIVITIES : "performed"
```

## Relationships

| Parent      | Child           | Relationship | FK Column     |
| ----------- | --------------- | ------------ | ------------- |
| users       | employees       | 1:1          | user_id       |
| departments | employees       | 1:N          | department_id |
| categories  | products        | 1:N          | category_id   |
| suppliers   | products        | 1:N          | supplier_id   |
| products    | stock_movements | 1:N          | product_id    |
| users       | stock_movements | 1:N          | performed_by  |
| users       | activities      | 1:N          | user_id       |

## Indexes Strategy

| Table           | Index                | Type   | Purpose                |
| --------------- | -------------------- | ------ | ---------------------- |
| users           | idx_users_email      | UNIQUE | Login lookup           |
| employees       | idx_emp_employee_id  | UNIQUE | Business ID lookup     |
| employees       | idx_emp_department   | INDEX  | Filter by department   |
| employees       | idx_emp_status       | INDEX  | Filter by status       |
| customers       | idx_cust_customer_id | UNIQUE | Business ID lookup     |
| customers       | idx_cust_email       | INDEX  | Search by email        |
| customers       | idx_cust_company     | INDEX  | Search by company      |
| products        | idx_prod_product_id  | UNIQUE | Business ID lookup     |
| products        | idx_prod_sku         | UNIQUE | SKU lookup             |
| products        | idx_prod_category    | INDEX  | Filter by category     |
| products        | idx_prod_status      | INDEX  | Stock status filter    |
| stock_movements | idx_stock_product    | INDEX  | Product history        |
| stock_movements | idx_stock_created    | INDEX  | Chronological queries  |
| activities      | idx_act_user         | INDEX  | User activity history  |
| activities      | idx_act_entity       | INDEX  | Entity activity lookup |
| activities      | idx_act_created      | INDEX  | Recent activities      |
