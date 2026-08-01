import { pool } from "../../config/database.js";

export class EmployeeRepository {
  async findAll(params) {
    const {
      page,
      limit,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
      department_id,
      status,
    } = params;
    const offset = (page - 1) * limit;

    let whereClause = "1=1";
    const values = [];

    if (search) {
      whereClause +=
        " AND (e.first_name LIKE ? OR e.last_name LIKE ? OR e.email LIKE ? OR e.employee_id LIKE ?)";
      const searchPattern = `%${search}%`;
      values.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (department_id) {
      whereClause += " AND e.department_id = ?";
      values.push(department_id);
    }

    if (status) {
      whereClause += " AND e.status = ?";
      values.push(status);
    }

    const allowedSortColumns = [
      "first_name",
      "last_name",
      "email",
      "joining_date",
      "created_at",
      "salary",
    ];
    const sortColumn = allowedSortColumns.includes(sortBy)
      ? sortBy
      : "created_at";
    const order = sortOrder === "asc" ? "ASC" : "DESC";

    const [rows] = await pool.execute(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       WHERE ${whereClause} 
       ORDER BY e.${sortColumn} ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM employees e WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows,
      total: countResult[0].total,
    };
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       WHERE e.id = ?`,
      [id],
    );
    return rows[0] || null;
  }

  async create(data) {
    const employeeId = await this.generateEmployeeId();
    const [result] = await pool.execute(
      `INSERT INTO employees (employee_id, first_name, last_name, email, phone, department_id, designation, salary, joining_date, status, address) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employeeId,
        data.first_name,
        data.last_name,
        data.email,
        data.phone,
        data.department_id,
        data.designation,
        data.salary,
        data.joining_date,
        data.status,
        data.address,
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
        !["id", "employee_id", "created_at", "updated_at"].includes(key)
      ) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    values.push(id);
    await pool.execute(
      `UPDATE employees SET ${fields.join(", ")} WHERE id = ?`,
      values,
    );
  }

  async delete(id) {
    await pool.execute("DELETE FROM employees WHERE id = ?", [id]);
  }

  async emailExists(email, excludeId) {
    let query = "SELECT COUNT(*) as count FROM employees WHERE email = ?";
    const params = [email];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute(query, params);
    return rows[0].count > 0;
  }

  async generateEmployeeId() {
    const [rows] = await pool.execute(
      "SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1",
    );
    if (rows.length === 0) return "EMP-001";
    const lastId = rows[0].employee_id;
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `EMP-${num.toString().padStart(3, "0")}`;
  }
}
