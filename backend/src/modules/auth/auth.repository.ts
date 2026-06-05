import { pool } from "../../config/database.js";
import { User } from "../../types/index.js";
import { RowDataPacket } from "mysql2";

export class AuthRepository {
  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );
    return (rows[0] as User) || null;
  }

  async findById(id: number): Promise<User | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );
    return (rows[0] as User) || null;
  }

  async create(
    user: Omit<User, "id" | "created_at" | "updated_at">,
  ): Promise<number> {
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
    return (result as any).insertId;
  }

  async emailExists(email: string): Promise<boolean> {
    const [rows] = await pool.execute<RowDataPacket[]>(
      "SELECT COUNT(*) as count FROM users WHERE email = ?",
      [email],
    );
    return (rows[0] as any).count > 0;
  }
}
