import { Router } from "express";
import { login, register } from "./auth.controller";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "./auth.schema";

export const authRoutes = Router();

authRoutes.post("/register", validate(registerSchema), register);
authRoutes.post("/login", validate(loginSchema), login);
