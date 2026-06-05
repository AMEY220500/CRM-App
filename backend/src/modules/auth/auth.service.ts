import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../../config/index.js";
import { AuthRepository } from "./auth.repository.js";
import { LoginDto, RegisterDto } from "./auth.dto.js";
import { UnauthorizedError, ConflictError } from "../../utils/errors.js";
import { JwtPayload } from "../../types/index.js";

export class AuthService {
  private repository = new AuthRepository();

  async login(dto: LoginDto) {
    const user = await this.repository.findByEmail(dto.email);

    if (!user || !user.is_active) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        role: user.role,
      },
    };
  }

  async register(dto: RegisterDto) {
    const exists = await this.repository.emailExists(dto.email);
    if (exists) {
      throw new ConflictError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const userId = await this.repository.create({
      email: dto.email,
      password_hash: passwordHash,
      first_name: dto.first_name,
      last_name: dto.last_name,
      role: dto.role,
      is_active: true,
    });

    const payload: JwtPayload = {
      userId,
      email: dto.email,
      role: dto.role,
    };

    const token = jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn as string,
    });

    return {
      token,
      user: {
        id: userId,
        email: dto.email,
        first_name: dto.first_name,
        last_name: dto.last_name,
        role: dto.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    return {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    };
  }
}
