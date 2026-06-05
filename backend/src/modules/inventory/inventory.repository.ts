import { pool } from "../../config/database.js";
import { Product, PaginationParams } from "../../types/index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class InventoryRepository {
  async findAll(
    params: PaginationParams & {
      category_id?: number;
      status?: string;
      supplier_id?: number;
    },
  ) {
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
    const values: any[] = [];

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

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE ${whereClause} 
       ORDER BY p.${sortColumn} ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM products p WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows as (Product & {
        category_name: string;
        supplier_name: string;
      })[],
      total: (countResult[0] as any).total,
    };
  }

  async findById(
    id: number,
  ): Promise<
    (Product & { category_name?: string; supplier_name?: string }) | null
  > {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name, s.name as supplier_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       LEFT JOIN suppliers s ON p.supplier_id = s.id 
       WHERE p.id = ?`,
      [id],
    );
    return (rows[0] as any) || null;
  }

  async create(
    data: Omit<
      Product,
      "id" | "product_id" | "status" | "created_at" | "updated_at"
    >,
  ): Promise<number> {
    const productId = await this.generateProductId();
    const status = this.calculateStatus(data.quantity, data.min_stock_level);

    const [result] = await pool.execute<ResultSetHeader>(
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

  async update(id: number, data: Partial<Product>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

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

  async delete(id: number): Promise<void> {
    await pool.execute("DELETE FROM products WHERE id = ?", [id]);
  }

  async skuExists(sku: string, excludeId?: number): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM products WHERE sku = ?";
    const params: any[] = [sku];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return (rows[0] as any).count > 0;
  }

  async getLowStockProducts(): Promise<Product[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.quantity <= p.min_stock_level AND p.quantity > 0 
       ORDER BY p.quantity ASC`,
    );
    return rows as Product[];
  }

  async getOutOfStockProducts(): Promise<Product[]> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT p.*, c.name as category_name 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE p.quantity = 0 
       ORDER BY p.name ASC`,
    );
    return rows as Product[];
  }

  private calculateStatus(
    quantity: number,
    minStockLevel: number,
  ): "in_stock" | "low_stock" | "out_of_stock" {
    if (quantity === 0) return "out_of_stock";
    if (quantity <= minStockLevel) return "low_stock";
    return "in_stock";
  }

  private async generateProductId(): Promise<string> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT product_id FROM products ORDER BY id DESC LIMIT 1",
    );
    if (rows.length === 0) return "PROD-001";
    const lastId = (rows[0] as any).product_id;
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `PROD-${num.toString().padStart(3, "0")}`;
  }
}
