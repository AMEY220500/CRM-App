import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validate } from "../../middleware/validation.middleware.js";
import { authenticate } from "../../middleware/auth.middleware.js";
import { loginSchema, registerSchema } from "./auth.dto.js";

const router = Router();

router.post("/login", validate(loginSchema), AuthController.login);
router.post("/register", validate(registerSchema), AuthController.register);
router.get("/profile", authenticate, AuthController.getProfile);

export { router as authRoutes };
