import { pool } from "../../config/database.js";
import { RowDataPacket } from "mysql2";

export class DashboardService {
  async getStats() {
    const [empCount] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM employees WHERE status = 'active'",
    );
    const [custCount] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM customers",
    );
    const [prodCount] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products",
    );
    const [lowStock] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products WHERE status = 'low_stock'",
    );
    const [outOfStock] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM products WHERE status = 'out_of_stock'",
    );

    return {
      totalEmployees: (empCount[0] as any).total,
      totalCustomers: (custCount[0] as any).total,
      totalProducts: (prodCount[0] as any).total,
      lowStockProducts: (lowStock[0] as any).total,
      outOfStockProducts: (outOfStock[0] as any).total,
    };
  }

  async getEmployeesByDepartment() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT d.name as department, COUNT(e.id) as count 
       FROM departments d 
       LEFT JOIN employees e ON d.id = e.department_id AND e.status = 'active' 
       WHERE d.is_active = TRUE 
       GROUP BY d.id, d.name 
       ORDER BY count DESC`,
    );
    return rows;
  }

  async getInventoryByCategory() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT c.name as category, COUNT(p.id) as count, SUM(p.quantity) as total_quantity 
       FROM categories c 
       LEFT JOIN products p ON c.id = p.category_id 
       WHERE c.is_active = TRUE 
       GROUP BY c.id, c.name 
       ORDER BY total_quantity DESC`,
    );
    return rows;
  }

  async getRecentActivities(limit = 10) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT a.*, u.first_name, u.last_name 
       FROM activities a 
       LEFT JOIN users u ON a.user_id = u.id 
       ORDER BY a.created_at DESC 
       LIMIT ?`,
      [limit.toString()],
    );
    return rows;
  }

  async getLatestEmployees(limit = 5) {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       WHERE e.status = 'active' 
       ORDER BY e.created_at DESC 
       LIMIT ?`,
      [limit.toString()],
    );
    return rows;
  }

  async getLowStockAlerts() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.status IN ('low_stock', 'out_of_stock') 
       ORDER BY p.quantity ASC 
       LIMIT 10`,
    );
    return rows;
  }

  async getCustomerGrowth() {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT 
         DATE_FORMAT(created_at, '%Y-%m') as month,
         COUNT(*) as count
       FROM customers 
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month ASC`,
    );
    return rows;
  }
}
