import { pool } from "../../config/database.js";

export class AuthRepository {
  async findByEmail(email) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [
      email,
    ]);
    return rows[0] || null;
  }

  async findById(id) {
    const [rows] = await pool.execute("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  async create(user) {
    const [result] = await pool.execute(
      "INSERT INTO users (email, password_hash, first_name, last_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)",
      [
        user.email,
        user.password_hash,
        user.first_name,
        user.last_name,
        user.role,
        user.is_active,
      ],
    );
    return result.insertId;
  }

  async emailExists(email) {
    const [rows] = await pool.execute(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email],
    );
    return rows[0].count > 0;
  }
}
