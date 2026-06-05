-- CRM + Inventory Management System
-- Seed Data for Development
-- =============================================

-- =============================================
-- DEFAULT ADMIN USER
-- Password: Admin@123 (bcrypt hash)
-- =============================================
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES
('admin@crm-app.com', '$2b$12$wtm3KXJZo5UXm9WvKlI3nOQsYhf.Rvwk0AsLrPBRFFzkgg7yp58mG', 'System', 'Admin', 'admin', TRUE),
('manager@crm-app.com', '$2b$12$wtm3KXJZo5UXm9WvKlI3nOQsYhf.Rvwk0AsLrPBRFFzkgg7yp58mG', 'John', 'Manager', 'manager', TRUE),
('employee@crm-app.com', '$2b$12$wtm3KXJZo5UXm9WvKlI3nOQsYhf.Rvwk0AsLrPBRFFzkgg7yp58mG', 'Jane', 'Employee', 'employee', TRUE);

-- =============================================
-- DEPARTMENTS
-- =============================================
INSERT INTO departments (name, description) VALUES
('Engineering', 'Software development and technical operations'),
('Sales', 'Sales and business development'),
('Marketing', 'Marketing and brand management'),
('Human Resources', 'People operations and talent management'),
('Finance', 'Financial planning and accounting'),
('Operations', 'Business operations and logistics'),
('Customer Support', 'Customer service and support');

-- =============================================
-- EMPLOYEES
-- =============================================
INSERT INTO employees (employee_id, user_id, first_name, last_name, email, phone, department_id, designation, salary, joining_date, status) VALUES
('EMP-001', 1, 'System', 'Admin', 'admin@crm-app.com', '+1-555-0100', 1, 'CTO', 150000.00, '2023-01-01', 'active'),
('EMP-002', 2, 'John', 'Manager', 'manager@crm-app.com', '+1-555-0101', 2, 'Sales Manager', 95000.00, '2023-03-15', 'active'),
('EMP-003', 3, 'Jane', 'Employee', 'employee@crm-app.com', '+1-555-0102', 1, 'Software Engineer', 85000.00, '2023-06-01', 'active'),
('EMP-004', NULL, 'Michael', 'Chen', 'michael.chen@crm-app.com', '+1-555-0103', 1, 'Senior Developer', 120000.00, '2023-02-01', 'active'),
('EMP-005', NULL, 'Sarah', 'Johnson', 'sarah.johnson@crm-app.com', '+1-555-0104', 3, 'Marketing Lead', 90000.00, '2023-04-15', 'active'),
('EMP-006', NULL, 'David', 'Williams', 'david.williams@crm-app.com', '+1-555-0105', 4, 'HR Specialist', 75000.00, '2023-05-01', 'active'),
('EMP-007', NULL, 'Emily', 'Brown', 'emily.brown@crm-app.com', '+1-555-0106', 5, 'Financial Analyst', 88000.00, '2023-07-01', 'active'),
('EMP-008', NULL, 'Robert', 'Taylor', 'robert.taylor@crm-app.com', '+1-555-0107', 2, 'Sales Representative', 65000.00, '2023-08-15', 'active'),
('EMP-009', NULL, 'Lisa', 'Anderson', 'lisa.anderson@crm-app.com', '+1-555-0108', 7, 'Support Lead', 72000.00, '2023-09-01', 'active'),
('EMP-010', NULL, 'James', 'Wilson', 'james.wilson@crm-app.com', '+1-555-0109', 6, 'Operations Manager', 98000.00, '2024-01-15', 'active');

-- =============================================
-- CUSTOMERS
-- =============================================
INSERT INTO customers (customer_id, first_name, last_name, company, email, phone, address, city, state, zip_code, status, notes) VALUES
('CUST-001', 'Alex', 'Thompson', 'TechCorp Inc.', 'alex@techcorp.com', '+1-555-1001', '123 Tech Blvd', 'San Francisco', 'CA', '94105', 'active', 'Enterprise client - high priority'),
('CUST-002', 'Maria', 'Garcia', 'CloudSoft Solutions', 'maria@cloudsoft.io', '+1-555-1002', '456 Cloud Ave', 'Seattle', 'WA', '98101', 'active', 'Long-term partnership'),
('CUST-003', 'Kevin', 'Lee', 'DataFlow Systems', 'kevin@dataflow.com', '+1-555-1003', '789 Data Lane', 'Austin', 'TX', '73301', 'active', NULL),
('CUST-004', 'Rachel', 'Martinez', 'GreenTech Innovations', 'rachel@greentech.com', '+1-555-1004', '321 Green St', 'Portland', 'OR', '97201', 'lead', 'Interested in inventory solution'),
('CUST-005', 'Thomas', 'Jackson', 'BuildRight Construction', 'thomas@buildright.com', '+1-555-1005', '654 Build Road', 'Denver', 'CO', '80201', 'active', 'Quarterly review scheduled'),
('CUST-006', 'Sophia', 'White', 'MediaPlex Agency', 'sophia@mediaplex.com', '+1-555-1006', '987 Media Blvd', 'Los Angeles', 'CA', '90001', 'active', NULL),
('CUST-007', 'Daniel', 'Harris', 'FinanceFirst Corp', 'daniel@financefirst.com', '+1-555-1007', '111 Finance St', 'New York', 'NY', '10001', 'inactive', 'Contract expired - renewal pending'),
('CUST-008', 'Amanda', 'Clark', 'HealthPlus Medical', 'amanda@healthplus.com', '+1-555-1008', '222 Health Ave', 'Boston', 'MA', '02101', 'active', 'New client - onboarding'),
('CUST-009', 'Ryan', 'Lewis', 'EduLearn Platform', 'ryan@edulearn.com', '+1-555-1009', '333 Learn Way', 'Chicago', 'IL', '60601', 'lead', 'Demo scheduled next week'),
('CUST-010', 'Jessica', 'Robinson', 'RetailMax Stores', 'jessica@retailmax.com', '+1-555-1010', '444 Retail Blvd', 'Miami', 'FL', '33101', 'active', 'Bulk inventory management');

-- =============================================
-- CATEGORIES
-- =============================================
INSERT INTO categories (name, description) VALUES
('Electronics', 'Electronic devices and components'),
('Office Supplies', 'General office supplies and stationery'),
('Furniture', 'Office and workspace furniture'),
('Software', 'Software licenses and subscriptions'),
('Hardware', 'Computer hardware and peripherals'),
('Networking', 'Networking equipment and cables'),
('Storage', 'Storage devices and media'),
('Accessories', 'General accessories and peripherals');

-- =============================================
-- SUPPLIERS
-- =============================================
INSERT INTO suppliers (name, contact_person, email, phone, address) VALUES
('TechDistributor Pro', 'Mark Stevens', 'mark@techdist.com', '+1-555-2001', '100 Supply Chain Dr, Dallas, TX'),
('Office Essentials Co', 'Laura Adams', 'laura@officeess.com', '+1-555-2002', '200 Office Park, Chicago, IL'),
('Global Electronics Ltd', 'Peter Wong', 'peter@globalelec.com', '+1-555-2003', '300 Electronics Way, San Jose, CA'),
('FurniturePlus Direct', 'Nancy Miller', 'nancy@furniplus.com', '+1-555-2004', '400 Furniture Ln, Grand Rapids, MI'),
('NetGear Solutions', 'Chris Taylor', 'chris@netgearsol.com', '+1-555-2005', '500 Network Blvd, Raleigh, NC');

-- =============================================
-- PRODUCTS
-- =============================================
INSERT INTO products (product_id, name, sku, category_id, supplier_id, description, quantity, min_stock_level, unit_price, cost_price, status, last_restocked) VALUES
('PROD-001', 'Dell Latitude 5540 Laptop', 'DEL-LAT-5540', 1, 1, '15.6" FHD, Intel i7, 16GB RAM, 512GB SSD', 25, 10, 1299.99, 950.00, 'in_stock', '2024-11-01 10:00:00'),
('PROD-002', 'HP LaserJet Pro M404dn', 'HP-LJ-M404', 1, 1, 'Monochrome laser printer, duplex, network', 8, 5, 349.99, 240.00, 'in_stock', '2024-10-15 14:00:00'),
('PROD-003', 'Ergonomic Office Chair', 'FRN-ERGO-CH1', 3, 4, 'Adjustable lumbar support, mesh back, armrests', 3, 5, 449.99, 280.00, 'low_stock', '2024-09-20 09:00:00'),
('PROD-004', 'Standing Desk Electric', 'FRN-STND-DSK', 3, 4, 'Electric height adjustable, 60x30 inch top', 12, 5, 599.99, 380.00, 'in_stock', '2024-10-01 11:00:00'),
('PROD-005', 'Cisco Catalyst 1000 Switch', 'NET-CSC-1000', 6, 5, '24-port Gigabit managed switch', 0, 3, 899.99, 650.00, 'out_of_stock', '2024-08-15 08:00:00'),
('PROD-006', 'Microsoft 365 Business License', 'SW-MS365-BIZ', 4, 1, 'Annual subscription per user', 100, 20, 149.99, 120.00, 'in_stock', '2024-11-01 00:00:00'),
('PROD-007', 'Logitech MX Master 3S Mouse', 'ACC-LOG-MX3S', 8, 3, 'Wireless ergonomic mouse, USB-C charging', 45, 15, 99.99, 65.00, 'in_stock', '2024-10-20 16:00:00'),
('PROD-008', 'Samsung 27" 4K Monitor', 'HW-SAM-27-4K', 5, 3, '27" UHD IPS, USB-C, HDR10', 6, 8, 449.99, 320.00, 'low_stock', '2024-09-30 13:00:00'),
('PROD-009', 'Cat6 Ethernet Cable 50ft', 'NET-CAT6-50', 6, 5, 'Cat6 UTP, snagless boot, blue', 200, 50, 24.99, 12.00, 'in_stock', '2024-11-05 07:00:00'),
('PROD-010', 'WD 4TB External HDD', 'STR-WD-4TB', 7, 3, 'USB 3.0 portable external hard drive', 4, 10, 109.99, 75.00, 'low_stock', '2024-09-10 15:00:00'),
('PROD-011', 'A4 Copy Paper (5000 sheets)', 'OFC-A4-5000', 2, 2, 'Premium white A4 paper, 80gsm, 10 reams', 35, 20, 44.99, 28.00, 'in_stock', '2024-11-10 09:00:00'),
('PROD-012', 'Webcam HD 1080p', 'ACC-WBC-1080', 8, 3, 'Full HD webcam with microphone, auto-focus', 18, 10, 79.99, 45.00, 'in_stock', '2024-10-25 11:00:00');

-- =============================================
-- STOCK MOVEMENTS (sample history)
-- =============================================
INSERT INTO stock_movements (product_id, type, quantity, previous_quantity, new_quantity, reference, notes, performed_by, created_at) VALUES
(1, 'in', 30, 0, 30, 'PO-2024-001', 'Initial stock purchase', 1, '2024-09-01 10:00:00'),
(1, 'out', 5, 30, 25, 'REQ-2024-015', 'Issued to Engineering team', 1, '2024-11-01 10:00:00'),
(3, 'in', 10, 0, 10, 'PO-2024-003', 'Initial stock purchase', 1, '2024-08-01 09:00:00'),
(3, 'out', 7, 10, 3, 'REQ-2024-022', 'Office expansion - new hires', 2, '2024-09-20 09:00:00'),
(5, 'in', 5, 0, 5, 'PO-2024-005', 'Network upgrade project', 1, '2024-06-15 08:00:00'),
(5, 'out', 5, 5, 0, 'REQ-2024-030', 'Deployed to server room', 2, '2024-08-15 08:00:00'),
(8, 'in', 15, 0, 15, 'PO-2024-008', 'Bulk monitor purchase', 1, '2024-07-01 13:00:00'),
(8, 'out', 9, 15, 6, 'REQ-2024-035', 'Developer workstation upgrades', 1, '2024-09-30 13:00:00'),
(10, 'in', 20, 0, 20, 'PO-2024-010', 'Storage backup devices', 1, '2024-07-15 15:00:00'),
(10, 'out', 16, 20, 4, 'REQ-2024-040', 'Distributed to departments', 2, '2024-09-10 15:00:00');

-- =============================================
-- ACTIVITIES (sample audit log)
-- =============================================
INSERT INTO activities (user_id, entity_type, entity_id, action, description, created_at) VALUES
(1, 'employee', 4, 'created', 'Added new employee Michael Chen', '2024-02-01 09:00:00'),
(1, 'employee', 5, 'created', 'Added new employee Sarah Johnson', '2024-04-15 10:00:00'),
(1, 'customer', 1, 'created', 'Added new customer TechCorp Inc.', '2024-03-01 11:00:00'),
(2, 'customer', 2, 'created', 'Added new customer CloudSoft Solutions', '2024-03-15 14:00:00'),
(1, 'product', 1, 'created', 'Added Dell Latitude 5540 to inventory', '2024-09-01 10:00:00'),
(1, 'stock', 1, 'stock_in', 'Received 30 units of Dell Latitude 5540', '2024-09-01 10:30:00'),
(2, 'stock', 5, 'stock_out', 'Issued 5 Cisco switches for server room', '2024-08-15 08:30:00'),
(1, 'employee', 10, 'created', 'Added new employee James Wilson', '2024-01-15 09:00:00'),
(1, 'product', 5, 'updated', 'Updated stock status to out_of_stock', '2024-08-15 09:00:00'),
(2, 'customer', 8, 'created', 'Added new customer HealthPlus Medical', '2024-10-01 16:00:00');
