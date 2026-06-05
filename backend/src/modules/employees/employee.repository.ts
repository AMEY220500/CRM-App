import { pool } from "../../config/database.js";
import { Employee, PaginationParams } from "../../types/index.js";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export class EmployeeRepository {
  async findAll(
    params: PaginationParams & { department_id?: number; status?: string },
  ) {
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
    const values: any[] = [];

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

    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       WHERE ${whereClause} 
       ORDER BY e.${sortColumn} ${order} 
       LIMIT ? OFFSET ?`,
      [...values, limit.toString(), offset.toString()],
    );

    const [countResult] = await pool.execute<RowDataPacket[]>(
      `SELECT COUNT(*) as total FROM employees e WHERE ${whereClause}`,
      values,
    );

    return {
      data: rows as (Employee & { department_name: string })[],
      total: (countResult[0] as any).total,
    };
  }

  async findById(
    id: number,
  ): Promise<(Employee & { department_name?: string }) | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      `SELECT e.*, d.name as department_name 
       FROM employees e 
       LEFT JOIN departments d ON e.department_id = d.id 
       WHERE e.id = ?`,
      [id],
    );
    return (rows[0] as Employee & { department_name?: string }) || null;
  }

  async create(
    data: Omit<Employee, "id" | "employee_id" | "created_at" | "updated_at">,
  ): Promise<number> {
    const employeeId = await this.generateEmployeeId();
    const [result] = await pool.execute<ResultSetHeader>(
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

  async update(id: number, data: Partial<Employee>): Promise<void> {
    const fields: string[] = [];
    const values: any[] = [];

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

  async delete(id: number): Promise<void> {
    await pool.execute("DELETE FROM employees WHERE id = ?", [id]);
  }

  async emailExists(email: string, excludeId?: number): Promise<boolean> {
    let query = "SELECT COUNT(*) as count FROM employees WHERE email = ?";
    const params: any[] = [email];

    if (excludeId) {
      query += " AND id != ?";
      params.push(excludeId);
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params);
    return (rows[0] as any).count > 0;
  }

  private async generateEmployeeId(): Promise<string> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT employee_id FROM employees ORDER BY id DESC LIMIT 1",
    );
    if (rows.length === 0) return "EMP-001";
    const lastId = (rows[0] as any).employee_id;
    const num = parseInt(lastId.split("-")[1]) + 1;
    return `EMP-${num.toString().padStart(3, "0")}`;
  }
}
