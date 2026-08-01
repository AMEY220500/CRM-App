import { pool } from "../../config/database.js";

export class StockRepository {
  async findAll(params) {
    const { page, limit, sortOrder = "desc", product_id, type } = params;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const values = [];

    if (product_id) {
      whereClause += " AND sm.product_id = ?";
      values.push(product_id);
    }

    if (type) {
      whereClause += " AND sm.type = ?";
      values.push(type);
    }

    const order = sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute(
      `SELECT sm.*, p.name as product_name, p.sku, u.first_name as performed_by_name 
       FROM stock_movements sm 
       LEFT JOIN products p ON sm.product_id = p.id 
       LEFT JOIN users u ON sm.performed_by = u.id 
       WHERE ${whereClause} 
       ORDER BY sm.created_at ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM stock_movements sm WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows,
      total: countResult[0].total,
    };
  }

  async create(data) {
    const [result] = await pool.execute(
      `INSERT INTO stock_movements (product_id, type, quantity, previous_quantity, new_quantity, reference, notes, performed_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.product_id,
        data.type,
        data.quantity,
        data.previous_quantity,
        data.new_quantity,
        data.reference,
        data.notes,
        data.performed_by,
      ],
    );
    return result.insertId;
  }

  async getProductMovements(productId) {
    const [rows] = await pool.execute(
      `SELECT sm.*, u.first_name as performed_by_name 
       FROM stock_movements sm 
       LEFT JOIN users u ON sm.performed_by = u.id 
       WHERE sm.product_id = ? 
       ORDER BY sm.created_at DESC 
       LIMIT 50`,
      [productId],
    );
    return rows;
  }
}
