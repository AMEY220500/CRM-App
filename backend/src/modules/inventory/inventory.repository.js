import { pool } from "../../config/database.js";

export class InventoryRepository {
  async findAll(params) {
    const {
      page,
      limit,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      category_id,
      status,
      supplier_id,
    } = params;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const values = [];

    if (search) {
      whereClause +=
        " AND (p.name LIKE ? OR p.sku LIKE ? OR p.product_id LIKE ?)";
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern, searchPattern);
    }

    if (category_id) {
      whereClause += " AND p.category_id = ?";
      values.push(category_id);
    }

    if (supplier_id) {
      whereClause += " AND p.supplier_id = ?";
      values.push(supplier_id);
    }

    if (status) {
      whereClause += " AND p.status = ?";
      values.push(status);
    }

    const allowedSortColumns = [
      "name",
      "sku",
      "quantity",
      "unit_price",
      "created_at",
      "last_restocked",
    ];
    const sortColumn = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const order = sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE ${whereClause} 
       ORDER BY p.${sortColumn} ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows,
      total: countResult[0].total,
    };
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async create(data) {
    const productId = await this.generateProductId();
    const status = this.calculateStatus(data.quantity, data.min_stock_level);

    const [result] = await pool.execute(
      `INSERT INTO products (product_id, name, sku, category_id, supplier_id, description, quantity, min_stock_level, unit_price, cost_price, status, last_restocked) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        productId,
        data.name,
        data.sku,
        data.category_id,
        data.supplier_id,
        data.description,
        data.quantity,
        data.min_stock_level,
        data.unit_price,
        data.cost_price,
        status,
        data.last_restocked,
      ],
    );
    return result.insertId;
  }

  async update(id, data) {
    const fields = [];
    const values = [];

    Object.entries(data).forEach(([key, value]) => {
      if (
        value !== undefined &&
        !["id", "product_id", "created_at", "updated_at"].includes(key)
      ) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE products SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }

  async delete(id) {
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
  }

  async skuExists(sku, excludeId) {
    let query = "SELECT COUNT(*) as count FROM products WHERE sku = ?";
    const params = [sku];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].count > 0;
  }

  async getLowStockProducts() {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.quantity <= p.min_stock_level AND p.quantity > 0 
       ORDER BY p.quantity ASC`,
    );
    return rows;
  }

  async getOutOfStockProducts() {
    const [rows] = await pool.execute(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.quantity = 0 
       ORDER BY p.name ASC`,
    );
    return rows;
  }

  calculateStatus(quantity, minStockLevel) {
    if (quantity === 0) return "out_of_stock";
    if (quantity <= minStockLevel) return "low_stock";
    return "in_stock";
  }

  async generateProductId() {
    const [rows] = await pool.execute(
      "SELECT product_id FROM products ORDER BY id DESC LIMIT 1",
    );
    if (rows.length === 0) return "PROD-001";
    const lastId = rows[0].product_id;
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `PROD-${num.toString().padStart(3, "0")}`;
  }
}
