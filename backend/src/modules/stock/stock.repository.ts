import { pool } from "../../config/database.js";
import { StockMovement, PaginationParams } from "../../types/index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class StockRepository {
  async findAll(
    params: PaginationParams & { product_id?: number; type?: string },
  ) {
    const { page, limit, sortOrder = "desc", product_id, type } = params;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const values: any[] = [];

    if (product_id) {
      whereClause += " AND sm.product_id = ?";
      values.push(product_id);
    }

    if (type) {
      whereClause += " AND sm.type = ?";
      values.push(type);
    }

    const order = sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT sm.*, p.name as product_name, p.sku, u.first_name as performed_by_name 
       FROM stock_movements sm 
       LEFT JOIN products p ON sm.product_id = p.id 
       LEFT JOIN users u ON sm.performed_by = u.id 
       WHERE ${whereClause} 
       ORDER BY sm.created_at ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM stock_movements sm WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows as (StockMovement & {
        product_name: string;
        sku: string;
        performed_by_name: string;
      })[],
      total: (countResult[0] as any).total,
    };
  }

  async create(
    data: Omit<StockMovement, "id" | "created_at">,
  ): Promise<number> {
    const [result] = await pool.execute<ResultSetHeader>(
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

  async getProductMovements(productId: number): Promise<StockMovement[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT sm.*, u.first_name as performed_by_name 
       FROM stock_movements sm 
       LEFT JOIN users u ON sm.performed_by = u.id 
       WHERE sm.product_id = ? 
       ORDER BY sm.created_at DESC 
       LIMIT 50`,
      [productId],
    );
    return rows as StockMovement[];
  }
}
