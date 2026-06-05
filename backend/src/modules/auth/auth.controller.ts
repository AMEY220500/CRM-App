import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service.js";
import { sendSuccess } from "../../utils/response.js";

const authService = new AuthService();

export class AuthController {
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      sendSuccess(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      sendSuccess(res, result, "Registration successful", 201);
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.getProfile(req.user!.userId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  }
}
