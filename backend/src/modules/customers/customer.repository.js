import { pool } from "../../config/database.js";

export class CustomerRepository {
  async findAll(params) {
    const {
      page,
      limit,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      status,
    } = params;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const values = [];

    if (search) {
      whereClause +=
        " AND (first_name LIKE ? OR last_name LIKE ? OR company LIKE ? OR email LIKE ? OR customer_id LIKE ?)";
      const searchPattern = `%${search}%`;
      values.push(
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
        searchPattern,
      );
    }

    if (status) {
      whereClause += " AND status = ?";
      values.push(status);
    }

    const allowedSortColumns = [
      "first_name",
      "last_name",
      "company",
      "email",
      "created_at",
    ];
    const sortColumn = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const order = sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute(
      `SELECT * FROM customers WHERE ${whereClause} ORDER BY ${sortColumn} ${order} LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM customers WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows,
      total: countResult[0].total,
    };
  }

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM customers WHERE id = ?", [
      id,
    ]);
    return rows[0] || null;
  }

  async create(data) {
    const customerId = await this.generateCustomerId();
    const [result] = await pool.execute(
      `INSERT INTO customers (customer_id, first_name, last_name, company, email, phone, address, city, state, zip_code, status, notes) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customerId,
        data.first_name,
        data.last_name,
        data.company,
        data.email,
        data.phone,
        data.address,
        data.city,
        data.state,
        data.zip_code,
        data.status,
        data.notes,
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
        !["id", "customer_id", "created_at", "updated_at"].includes(key)
      ) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE customers SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }

  async delete(id) {
    await pool.execute("DELETE FROM customers WHERE id = ?", [id]);
  }

  async generateCustomerId() {
    const [rows] = await pool.execute(
      "SELECT customer_id FROM customers ORDER BY id DESC LIMIT 1",
    );
    if (rows.length === 0) return "CUST-001";
    const lastId = rows[0].customer_id;
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `CUST-${num.toString().padStart(3, "0")}`;
  }
}
